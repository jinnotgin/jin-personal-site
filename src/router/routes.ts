import type { RouteRecordRaw, Router, RouterScrollBehavior } from 'vue-router'

const PAGE_LEAVE_TRANSITION_MS = 180
const scrollPositions = new Map<string, { left: number; top: number }>()
const installedScrollRouters = new WeakSet<Router>()

async function waitForRouteView() {
	if (typeof window === 'undefined') return

	await new Promise((resolve) => window.setTimeout(resolve, PAGE_LEAVE_TRANSITION_MS))
	await new Promise((resolve) => window.requestAnimationFrame(resolve))
	await new Promise((resolve) => window.requestAnimationFrame(resolve))
}

function isWritingIndexQueryNavigation(to: { name?: unknown; fullPath: string }, from: { name?: unknown; fullPath: string }) {
	return to.name === 'writing' && from.name === 'writing' && to.fullPath !== from.fullPath
}

export function installScrollPositionStore(router: Router) {
	if (typeof window === 'undefined') return
	if (installedScrollRouters.has(router)) return
	installedScrollRouters.add(router)

	if ('scrollRestoration' in window.history) {
		window.history.scrollRestoration = 'manual'
	}

	router.beforeEach((_to, from) => {
		scrollPositions.set(from.fullPath, {
			left: window.scrollX,
			top: window.scrollY,
		})
	})
}

export const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/HomeView.vue'),
		meta: { title: 'Jin - Applied innovation, shaping digital and human systems' },
	},
	{
		path: '/projects',
		name: 'projects',
		component: () => import('@/views/ProjectsView.vue'),
		meta: { title: 'Projects - Jin' },
	},
	{
		path: '/projects/:slug',
		name: 'project',
		component: () => import('@/views/ProjectView.vue'),
		meta: { title: 'Projects - Jin' },
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
		meta: { title: 'Writing - Jin' },
	},
	{
		path: '/writing/:slug',
		name: 'post',
		component: () => import('@/views/PostView.vue'),
		meta: { title: 'Writing - Jin' },
	},
	{
		path: '/journey',
		name: 'journey',
		component: () => import('@/views/JourneyView.vue'),
		meta: { title: 'Journey - Jin' },
	},
	{
		path: '/shelf',
		name: 'shelf',
		component: () => import('@/views/ShelfView.vue'),
		meta: { title: 'Shelf - Jin' },
	},
	{
		path: '/contact',
		name: 'contact',
		component: () => import('@/views/ContactView.vue'),
		meta: { title: 'Contact - Jin' },
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: () => import('@/views/NotFoundView.vue'),
		meta: { title: 'Not found - Jin' },
	},
]

export const scrollBehavior: RouterScrollBehavior = async (to, from, savedPosition) => {
	if (isWritingIndexQueryNavigation(to, from)) {
		return { el: '.filters', top: 112, behavior: 'auto' }
	}

	await waitForRouteView()

	if (savedPosition) {
		const rememberedPosition = scrollPositions.get(to.fullPath)
		return rememberedPosition ?? savedPosition
	}

	if (to.hash) return { el: to.hash, behavior: 'auto' }

	return { top: 0, left: 0, behavior: 'auto' }
}
