import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Jin — Applied innovation, shaping digital and human systems' },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: 'Projects — Jin' },
  },
  {
    path: '/projects/:slug',
    name: 'project',
    component: () => import('@/views/ProjectView.vue'),
    meta: { title: 'Projects — Jin' },
  },
  {
    path: '/tools',
    redirect: '/projects',
  },
  {
    path: '/tools/:slug',
    redirect: (to) => `/projects/${to.params.slug}`,
  },
  {
    path: '/workbench',
    redirect: '/projects',
  },
  {
    path: '/workbench/:slug',
    redirect: (to) => `/projects/${to.params.slug}`,
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
]

export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash, behavior: 'smooth' }
  return { top: 0 }
}
