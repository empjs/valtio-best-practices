import {defineConfig} from '@rstest/core'

export default defineConfig({
  include: ['test/**/*.test.{ts,tsx}'],
  testEnvironment: 'happy-dom',
  setupFiles: ['./test/setup.ts'],
})
