import { createRouter, createWebHistory } from 'vue-router'
import { installScrollPositionStore, routes, scrollBehavior } from './routes'
import { installNavigationProgress } from '@/lib/navigation'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior,
})

installNavigationProgress(router)
installScrollPositionStore(router)

router.afterEach((to) => {
  document.title = (to.meta.title as string) ?? 'Jin'
})

export default router
