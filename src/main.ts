import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'

import './main.css'
import App from './App.vue'
import { routes, scrollBehavior } from './router/routes'

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL, scrollBehavior },
  ({ app, router, isClient }) => {
    app.use(createPinia())

    if (isClient) {
      router.afterEach((to) => {
        document.title = (to.meta.title as string) ?? 'Jin'
      })
    }
  },
)
