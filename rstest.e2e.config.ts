import {defineConfig} from '@rstest/core'

export default defineConfig({
  include: ['tests/e2e/**/*.test.ts'],
  testEnvironment: 'node',
  testTimeout: 30_000,
  reporters: ['default', ['json', {outputPath: 'artifacts/e2e/results.json'}]],
})
