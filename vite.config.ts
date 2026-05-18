import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

function contentSlugs(folder: string): string[] {
  const dir = fileURLToPath(new URL(`./src/content/${folder}`, import.meta.url))
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  server: {
    port: 5174,
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
} as any)
