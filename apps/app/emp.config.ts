import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'
export default defineConfig(store => {
  return {
    plugins: [pluginReact(), pluginTailwindcss()],
    server: {
      port: 1111,
      open: false,
    },
  }
})
