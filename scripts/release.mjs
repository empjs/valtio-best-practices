import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {appendFileSync, readFileSync, writeFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const directory = resolve(root, 'packages/valtio')
const manifestPath = resolve(directory, 'package.json')
const registry = 'https://registry.npmjs.org'

export function nextVersion(source, published) {
  const parse = value => {
    if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)) {
      throw new Error(`Expected stable semver, received ${value}`)
    }
    return value.split('.').map(Number)
  }
  const local = parse(source)
  if (!published) return source
  const remote = parse(published)
  for (let index = 0; index < 3; index++) {
    if (local[index] > remote[index]) return source
    if (local[index] < remote[index]) break
  }
  return `${remote[0]}.${remote[1]}.${remote[2] + 1}`
}

// Hash the actual package contents, excluding only release-generated metadata.
export function fingerprint(files, manifest) {
  const {version, empRelease, ...content} = manifest
  const hash = createHash('sha256')
  hash.update(JSON.stringify(content))
  for (const file of [...files].sort((a, b) => a.path.localeCompare(b.path))) {
    if (file.path === 'package.json') continue
    hash.update(`\0${file.path}\0${file.content.length}\0`)
    hash.update(file.content)
  }
  return hash.digest('hex')
}

async function metadata(name, version = 'latest') {
  const response = await fetch(`${registry}/${encodeURIComponent(name)}/${version}`, {
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`npm metadata request failed: HTTP ${response.status}`)
  return response.json()
}

async function main() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (process.argv.includes('--verify')) {
    for (let attempt = 0; attempt < 6; attempt++) {
      const published = await metadata(manifest.name, manifest.version).catch(() => null)
      if (published?.empRelease?.fingerprint === manifest.empRelease?.fingerprint && manifest.empRelease) {
        console.log(`Verified ${manifest.name}@${manifest.version} on npm`)
        return
      }
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
    throw new Error('Published version or fingerprint could not be verified on npm')
  }
  const [pack] = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
      cwd: directory,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    }),
  )
  for (const path of ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'dist/index.d.cts']) {
    if (!pack.files.some(file => file.path === path)) throw new Error(`Missing package output: ${path}`)
  }
  const digest = fingerprint(
    pack.files.map(file => ({
      path: file.path,
      content: readFileSync(resolve(directory, file.path)),
    })),
    manifest,
  )
  if (!process.argv.includes('--write')) {
    console.log(`Validated ${pack.files.length} package files; fingerprint ${digest}`)
    return
  }
  if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REF !== 'refs/heads/main') {
    throw new Error('Release preparation is only allowed in GitHub Actions on main')
  }
  // Fail closed on registry/auth/network errors; this package already exists.
  const published = await metadata(manifest.name)
  const version = nextVersion(manifest.version, published.version)
  const explicitBump = version === manifest.version && manifest.version !== published.version
  const publish = explicitBump || published.empRelease?.fingerprint !== digest
  if (publish) {
    manifest.version = version
    manifest.empRelease = {fingerprint: digest, commit: process.env.GITHUB_SHA}
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  }
  appendFileSync(process.env.GITHUB_OUTPUT, `publish=${publish}\nversion=${manifest.version}\n`)
  const message = publish ? `Publish ${manifest.name}@${manifest.version}` : 'Package unchanged; skip npm publish'
  console.log(message)
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
