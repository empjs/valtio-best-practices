import {execFileSync, spawnSync} from 'node:child_process'
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repo = 'empjs/valtio-best-practices'
const manifest = JSON.parse(readFileSync(join(root, 'packages/valtio/package.json'), 'utf8'))
const {version, empRelease} = manifest
if (!/^\d+\.\d+\.\d+$/.test(version) || !/^[a-f0-9]{40}$/.test(empRelease?.commit ?? '')) {
  throw new Error('Expected a prepared release manifest with version and original npm commit')
}
const tag = `v${version}`
const run = (command, args) => execFileSync(command, args, {cwd: root, encoding: 'utf8'}).trim()
const api = path => {
  const result = spawnSync('gh', ['api', `repos/${repo}/${path}`], {encoding: 'utf8'})
  if (result.status === 0) return JSON.parse(result.stdout)
  if (result.stderr.includes('(HTTP 404)')) return null
  throw new Error(`GitHub API failed: ${result.stderr}`)
}
const verify = release => {
  if (!release || release.draft || !release.body?.trim()) throw new Error('Release description was not published')
  let object = api(`git/ref/tags/${tag}`)?.object
  while (object?.type === 'tag') object = api(`git/tags/${object.sha}`)?.object
  if (object?.sha !== empRelease.commit) throw new Error('Release tag does not match the npm source commit')
  console.log(`Verified GitHub Release: ${release.html_url}`)
}

const existing = api(`releases/tags/${tag}`)
if (existing) {
  verify(existing)
} else {
  const previous = api('releases/latest')
  const args = previous ? [`${previous.tag_name}..${empRelease.commit}`] : [empRelease.commit, '-20']
  const commits = run('git', ['log', ...args, '--no-merges', '--format=%H%x09%s'])
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [sha, ...subject] = line.split('\t')
      return `- ${subject.join('\t')} ([${sha.slice(0, 7)}](https://github.com/${repo}/commit/${sha}))`
    })
    .join('\n')
  const comparison = previous
    ? `https://github.com/${repo}/compare/${previous.tag_name}...${tag}`
    : `https://github.com/${repo}/commits/${tag}`
  const body =
    `## 安装\n\n\`pnpm add @empjs/valtio@${version}\`\n\n` +
    `## 更新内容${previous ? '' : '（最近 20 条提交）'}\n\n${commits}\n\n` +
    `[npm 包](https://www.npmjs.com/package/@empjs/valtio/v/${version}) · [完整变更](${comparison})\n\n` +
    `源码提交：\`${empRelease.commit}\`。此 Release 在 npm 发布回读成功后创建；页面部署状态以 Actions 为准。\n`
  const temporary = mkdtempSync(join(tmpdir(), 'valtio-release-notes-'))
  try {
    const file = join(temporary, 'notes.md')
    writeFileSync(file, body)
    run('gh', [
      'release',
      'create',
      tag,
      '--repo',
      repo,
      '--target',
      empRelease.commit,
      '--title',
      `@empjs/valtio ${tag}`,
      '--notes-file',
      file,
    ])
    verify(api(`releases/tags/${tag}`))
  } finally {
    rmSync(temporary, {recursive: true, force: true})
  }
}
