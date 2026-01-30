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
        remotes: {
          host: `host@http://${store.server.ip}:1112/emp.json`,
        },
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
    server: {
      port: 1111,
      open: false,
    },
  }
})
