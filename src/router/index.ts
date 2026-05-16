import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Jin — Applied innovation, shaping digital and human systems' },
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('@/views/WorkbenchView.vue'),
      meta: { title: 'Projects — Jin' },
    },
    {
      path: '/tools/:slug',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
      meta: { title: 'Projects — Jin' },
    },
    {
      path: '/workbench',
      redirect: '/tools',
    },
    {
      path: '/workbench/:slug',
      redirect: (to) => `/tools/${to.params.slug}`,
    },
    {
      path: '/writing',
      name: 'writing',
      component: () => import('@/views/WritingView.vue'),
      meta: { title: 'Writing — Jin' },
    },
    {
      path: '/writing/:slug',
      name: 'post',
      component: () => import('@/views/PostView.vue'),
      meta: { title: 'Writing — Jin' },
    },
    {
      path: '/journey',
      name: 'journey',
      component: () => import('@/views/JourneyView.vue'),
      meta: { title: 'Journey — Jin' },
    },
    {
      path: '/shelf',
      name: 'shelf',
      component: () => import('@/views/ShelfView.vue'),
      meta: { title: 'Shelf — Jin' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { title: 'Contact — Jin' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Not found — Jin' },
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = (to.meta.title as string) ?? 'Jin'
  document.title = title
})

export default router
