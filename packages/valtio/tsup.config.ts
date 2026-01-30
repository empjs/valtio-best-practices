import {defineConfig} from 'tsup'
import packageJson from './package.json'

console.log('TSUP CONFIG LOADED')

export default defineConfig(({watch}) => {
  const isDev = watch !== undefined
  return {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    target: 'es2021',
    outDir: 'dist',
    sourcemap: isDev,
    minify: !isDev,
    clean: true,
    treeshake: true,
    skipNodeModulesBundle: true,
    external: [
      'fsevents',
      /fsevents/,
      'react',
      'react-dom',
      'valtio',
      'valtio/utils',
      'derive-valtio',
      'valtio-history',
    ],
    loader: {
      '.node': 'empty',
    },
    metafile: true,
  }
})
