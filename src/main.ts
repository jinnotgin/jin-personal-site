import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import posthog from 'posthog-js'

import './main.css'
import App from './App.vue'
import { createChunkLoadRecovery } from './lib/deploymentSkew'
import {
	categories,
	deslugifyCategory,
	pageSize,
	readWritingPageCache,
	seedWritingPageCache,
	slugifyCategory,
	totalsByFilter,
} from './lib/markdown'
import { installNavigationProgress, isNavigating } from './lib/navigation'
import { getCachedPost, seedPostCache } from './lib/postMarkdown'
import { getCachedProject, seedProjectCache } from './lib/projects'
import { installScrollPositionStore, routes, scrollBehavior } from './router/routes'

function writingPageState(route: { query: Record<string, unknown> }) {
	const categoryQuery = route.query.category
	const categorySlug = Array.isArray(categoryQuery) ? categoryQuery[0] : categoryQuery
	const filter =
		typeof categorySlug === 'string'
			? (deslugifyCategory(categorySlug) ?? (categories.includes(categorySlug) ? categorySlug : 'All'))
			: 'All'
	const filterSlug = filter === 'All' ? 'all' : slugifyCategory(filter)
	const pageQuery = route.query.page
	const pageValue = Number(Array.isArray(pageQuery) ? pageQuery[0] : pageQuery)
	const currentPage = Number.isFinite(pageValue) && pageValue >= 1 ? Math.floor(pageValue) : 1
	const totalPages = Math.max(1, Math.ceil((totalsByFilter[filterSlug] ?? 0) / pageSize))
	return { filterSlug, page: Math.min(currentPage, totalPages) }
}

export const createApp = ViteSSG(
	App,
	{ routes, base: import.meta.env.BASE_URL, scrollBehavior },
	({ app, router, isClient, initialState, onSSRAppRendered }) => {
		app.use(createPinia())

		if (import.meta.env.SSR) {
			onSSRAppRendered(() => {
				const route = router.currentRoute.value
				if (route.name === 'post') {
					const post = getCachedPost(String(route.params.slug))
					if (post) initialState.post = post
				}
				if (route.name === 'project') {
					const project = getCachedProject(String(route.params.slug))
					if (project) initialState.project = project
				}
				if (route.name === 'writing') {
					const page = writingPageState(route)
					const cached = readWritingPageCache(page.filterSlug, page.page)
					if (cached.hit) initialState.writingPage = { ...page, items: cached.value }
				}
			})
		} else {
			if (initialState.post) seedPostCache(initialState.post)
			if (initialState.project) seedProjectCache(initialState.project)
			if (initialState.writingPage) {
				seedWritingPageCache(
					initialState.writingPage.filterSlug,
					initialState.writingPage.page,
					initialState.writingPage.items,
				)
			}
		}

		if (isClient) {
			installNavigationProgress(router)

			const chunkLoadRecovery = createChunkLoadRecovery({
				assign: (path) => window.location.assign(path),
				sessionStorage: window.sessionStorage,
				onBeforeAssign: () => { isNavigating.value = true },
			})
			const isLocalhost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname)
			const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN

			if (!isLocalhost && posthogToken) {
				posthog.init(posthogToken, {
					api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
					ui_host: 'https://us.posthog.com',
					defaults: '2026-01-30',
				})

				app.config.errorHandler = (err) => {
					posthog.captureException(err)
				}
			}

			router.afterEach((to) => {
				chunkLoadRecovery.clearRefreshAttempt()
				document.title = (to.meta.title as string) ?? 'Jin'
			})
			router.onError(chunkLoadRecovery.handleRouterError)

			installScrollPositionStore(router)
		}
	},
)
