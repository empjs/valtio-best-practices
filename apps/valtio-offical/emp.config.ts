import {defineConfig} from '@empjs/cli'
import pluginReact from '@empjs/plugin-react'
import pluginTailwindcss from '@empjs/plugin-tailwindcss'
export default defineConfig(() => {
  return {
    plugins: [pluginReact(), pluginTailwindcss()],
    server: {
      port: Number(process.env.E2E_PORT ?? 1111),
      open: false,
    },
    cache: false,
    html: {
      title: 'Valtio Enhanced Store',
    },
  }
})
