import { createRouter, createWebHistory } from 'vue-router'
import { routes, scrollBehavior } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior,
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) ?? 'Jin'
})

export default router
