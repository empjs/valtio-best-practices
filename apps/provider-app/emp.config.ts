import path from 'node:path'
import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginRspackEmpShare from '@empjs/share/rspack'

export default defineConfig(store => {
  return {
    plugins: [
      pluginReact(),
      pluginRspackEmpShare({
        name: store.uniqueName,
        experiments: {
          asyncStartup: true,
        },
        exposes: {},
        shared: {
          react: {
            singleton: true,
            requiredVersion: '19.2.4',
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '19.2.4',
            eager: true,
          },
        },
      }),
    ],
    // 从源码解析 @empjs/valtio-store，避免使用预构建 dist 中打包的 React（导致多份 React → Invalid hook call）
    resolve: {
      alias: {
        '@empjs/valtio-store': path.resolve(
          __dirname,
          '../../packages/valtio-store/src/index.ts',
        ),
      },
    },
    server: {
      port: 1112,
      open: false,
    },
  }
})
