import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {dirname, join, resolve} from 'node:path'
import test from 'node:test'
import {fileURLToPath} from 'node:url'
import {fingerprint, nextVersion, selectRelease, shouldPublish} from './release.mjs'

test('automatic patch starts from npm latest and honors explicit larger versions', () => {
  assert.equal(nextVersion('0.0.3', '0.0.3'), '0.0.4')
  assert.equal(nextVersion('0.0.3', '0.1.9'), '0.1.10')
  assert.equal(nextVersion('0.2.0', '0.1.9'), '0.2.0')
  assert.equal(nextVersion('1.0.0', '0.9.9'), '1.0.0')
  assert.throws(() => nextVersion('1.0.0-beta.1', '0.0.3'))
})

test('reruns ignore version and release metadata; published content changes cause a release', () => {
  const files = [{path: 'dist/index.js', content: Buffer.from('export const value = 1')}]
  const manifest = {name: '@empjs/valtio', version: '0.0.3', dependencies: {valtio: '^2.3.0'}}
  const before = fingerprint(files, manifest)
  assert.equal(before, fingerprint(files, {...manifest, version: '0.0.4', empRelease: {fingerprint: before}}))
  assert.notEqual(before, fingerprint([{...files[0], content: Buffer.from('changed')}], manifest))
  assert.notEqual(before, fingerprint(files, {...manifest, dependencies: {valtio: '^2.4.0'}}))
  assert.equal(before, fingerprint([...files, {path: 'package.json', content: Buffer.from('ignored')}], manifest))
})

test('page-only updates build with the published version rather than the source baseline', () => {
  const source = {name: '@empjs/valtio', version: '0.0.3'}
  const published = {version: '0.0.4', empRelease: {fingerprint: 'same-content', commit: 'original'}}
  const result = selectRelease(source, published, 'same-content', 'page-change')
  assert.equal(result.publish, false)
  assert.equal(result.manifest.version, '0.0.4')
  assert.deepEqual(result.manifest.empRelease, published.empRelease)
  assert.equal(source.version, '0.0.3')
})

test('changed packages select the next version before building', () => {
  const result = selectRelease({version: '0.0.3'}, {version: '0.0.4'}, 'new-content', 'new-commit')
  assert.equal(result.publish, true)
  assert.equal(result.manifest.version, '0.0.5')
  assert.equal(result.manifest.empRelease.fingerprint, 'new-content')
})

test('publish retries skip identical versions but fail on version collisions', () => {
  const prepared = {version: '0.0.5', empRelease: {fingerprint: 'same-content'}}
  assert.equal(shouldPublish(prepared, null), true)
  assert.equal(shouldPublish(prepared, prepared), false)
  assert.throws(() => shouldPublish(prepared, {...prepared, empRelease: {fingerprint: 'different-content'}}))
  assert.throws(() => shouldPublish({version: '0.0.5'}, null))
})

test('real package validation rejects stale built versions and passes after rebuilding', () => {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const fixture = realpathSync(mkdtempSync(join(tmpdir(), 'valtio-release-version-')))
  const packageDir = join(fixture, 'packages/valtio')
  try {
    mkdirSync(packageDir, {recursive: true})
    mkdirSync(join(fixture, 'scripts'))
    symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir')
    symlinkSync(join(root, 'packages/valtio/node_modules'), join(packageDir, 'node_modules'), 'dir')
    for (const file of ['src', 'package.json', 'rslib.config.ts', 'tsconfig.json']) {
      cpSync(join(root, 'packages/valtio', file), join(packageDir, file), {recursive: true})
    }
    cpSync(join(root, 'scripts/release.mjs'), join(fixture, 'scripts/release.mjs'))
    const build = () => {
      const result = spawnSync(join(root, 'node_modules/.bin/rslib'), ['build'], {
        cwd: packageDir,
        env: {...process.env, NODE_ENV: 'production'},
        encoding: 'utf8',
      })
      assert.equal(result.status, 0, result.stdout + result.stderr)
    }
    const validate = () => spawnSync(process.execPath, [join(fixture, 'scripts/release.mjs')], {encoding: 'utf8'})
    build()
    const baseline = validate()
    assert.equal(baseline.status, 0, baseline.stdout + baseline.stderr)
    assert.match(baseline.stdout, /Validated/)
    const manifestPath = join(packageDir, 'package.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    manifest.version = nextVersion(manifest.version, manifest.version)
    writeFileSync(manifestPath, JSON.stringify(manifest))
    const stale = validate()
    assert.notEqual(stale.status, 0)
    assert.match(stale.stderr, /exports version .* expected/)
    build()
    const rebuilt = validate()
    assert.equal(rebuilt.status, 0, rebuilt.stdout + rebuilt.stderr)
  } finally {
    rmSync(fixture, {recursive: true, force: true})
  }
})
