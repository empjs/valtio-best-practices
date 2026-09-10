import {defineConfig} from '@rslib/core'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
  lib: [
    {format: 'esm', syntax: 'es2021', dts: {autoExtension: true, distPath: './dist/types/esm'}},
    {format: 'cjs', syntax: 'es2021', dts: {autoExtension: true, distPath: './dist/types/cjs'}},
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
