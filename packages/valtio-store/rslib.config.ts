import {defineConfig} from '@rslib/core'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
  lib: [
    {format: 'esm', syntax: 'es2021', dts: true},
    {format: 'cjs', syntax: 'es2021', dts: true},
  ],
  source: {
    entry: {index: 'src/index.ts'},
  },
  output: {
    target: 'web',
    cleanDistPath: true,
    sourceMap: isDev,
    minify: !isDev,
    externals: ['react', 'react-dom'],
  },
})
