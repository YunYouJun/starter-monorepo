import { fileURLToPath } from 'node:url'
import { getViteConfig } from '@yunyoujun/docs'
import { defineConfig } from 'vite'
import Tsconfig from 'vite-tsconfig-paths'

const viteConfig = getViteConfig({})

export default defineConfig({
  ...viteConfig,

  plugins: [
    ...(viteConfig.plugins || []),

    Tsconfig({
      projects: [
        fileURLToPath(new URL('../../tsconfig.json', import.meta.url)),
      ],
    }),
  ],
})
