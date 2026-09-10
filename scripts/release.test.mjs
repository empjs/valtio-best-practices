import assert from 'node:assert/strict'
import test from 'node:test'
import {fingerprint, nextVersion} from './release.mjs'

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
