import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import { contentSlugs } from './ssg-routes'

interface ViteSsgConfig extends UserConfig {
  ssgOptions: {
    script: string
    formatting: string
    includedRoutes: (paths: string[]) => string[]
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  server: {
    port: 5465,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths: string[]) {
      const projectSlugs = contentSlugs('projects')
      const writingSlugs = contentSlugs('writing')

      const skipPatterns = new Set([
        '/tools',
        '/tools/:slug',
        '/workbench',
        '/workbench/:slug',
        '/:pathMatch(.*)*',
      ])

      return paths
        .filter((p) => !skipPatterns.has(p))
        .flatMap((path) => {
          if (path === '/projects/:slug') return projectSlugs.map((s) => `/projects/${s}`)
          if (path === '/writing/:slug') return writingSlugs.map((s) => `/writing/${s}`)
          return [path]
      })
    },
  },
} as ViteSsgConfig)
