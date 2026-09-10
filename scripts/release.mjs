import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {appendFileSync, readFileSync, writeFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

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
  // v2 publishes a rebuilt, versioned artifact rather than patching only its manifest.
  hash.update('versioned-build-v2\0')
  hash.update(JSON.stringify(content))
  for (const file of [...files].sort((a, b) => a.path.localeCompare(b.path))) {
    if (file.path === 'package.json') continue
    hash.update(`\0${file.path}\0${file.content.length}\0`)
    hash.update(file.content)
  }
  return hash.digest('hex')
}

export function selectRelease(manifest, published, digest, commit) {
  const next = nextVersion(manifest.version, published.version)
  const explicitBump = next === manifest.version && manifest.version !== published.version
  const publish = explicitBump || published.empRelease?.fingerprint !== digest
  return {
    publish,
    manifest: {
      ...manifest,
      version: publish ? next : published.version,
      empRelease: publish ? {fingerprint: digest, commit} : published.empRelease,
    },
  }
}

export function shouldPublish(manifest, published) {
  if (!manifest.empRelease?.fingerprint) throw new Error('Missing prepared release fingerprint')
  if (!published) return true
  if (published.version !== manifest.version || published.empRelease?.fingerprint !== manifest.empRelease.fingerprint) {
    throw new Error('npm version already exists with different release content')
  }
  return false
}

async function metadata(name, version = 'latest', allowMissing = false) {
  const response = await fetch(`${registry}/${encodeURIComponent(name)}/${version}`, {
    signal: AbortSignal.timeout(30_000),
  })
  if (allowMissing && response.status === 404) return null
  if (!response.ok) throw new Error(`npm metadata request failed: HTTP ${response.status}`)
  return response.json()
}

async function main() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (process.argv.includes('--check')) {
    // The manifest and dist were versioned, built, and tested together in verify.
    // Exact-version lookup makes a retry after a successful publish idempotent.
    const published = await metadata(manifest.name, manifest.version, true)
    const publish = shouldPublish(manifest, published)
    appendFileSync(process.env.GITHUB_OUTPUT, `publish=${publish}\n`)
    console.log(
      publish
        ? `Publish ${manifest.name}@${manifest.version}`
        : `Already published ${manifest.name}@${manifest.version}`,
    )
    return
  }
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
  const exports = manifest.exports['.']
  for (const path of [
    manifest.main,
    manifest.types,
    ...Object.values(exports.import),
    ...Object.values(exports.require),
  ].map(path => path.replace(/^\.\//, ''))) {
    if (!pack.files.some(file => file.path === path)) throw new Error(`Missing package output: ${path}`)
  }
  // Both public module formats must report the version actually being published.
  for (const entry of [exports.import.default, exports.require.default]) {
    const built = await import(pathToFileURL(resolve(directory, entry)).href)
    if (built.version !== manifest.version) {
      throw new Error(
        `${entry} exports version ${built.version}; expected ${manifest.version}. Rebuild after selecting the release version.`,
      )
    }
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
  const release = selectRelease(manifest, published, digest, process.env.GITHUB_SHA)
  // Also write the npm version for page-only updates; source version may lag npm.
  writeFileSync(manifestPath, `${JSON.stringify(release.manifest, null, 2)}\n`)
  const {version} = release.manifest
  appendFileSync(process.env.GITHUB_OUTPUT, `publish=${release.publish}\nversion=${version}\n`)
  const message = release.publish
    ? `Prepared ${manifest.name}@${version}; rebuild before publishing`
    : `Package unchanged; build page with npm version ${version}`
  console.log(message)
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
