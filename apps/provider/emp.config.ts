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
            requiredVersion: '19',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '19',
          },
        },
      }),
    ],
    server: {
      port: 2222,
      open: false,
    },
  }
})
