import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import posthog from 'posthog-js'

import './main.css'
import App from './App.vue'
import { createChunkLoadRecovery } from './lib/deploymentSkew'
import { installScrollPositionStore, routes, scrollBehavior } from './router/routes'

export const createApp = ViteSSG(
	App,
	{ routes, base: import.meta.env.BASE_URL, scrollBehavior },
	({ app, router, isClient }) => {
		app.use(createPinia())

		if (isClient) {
			const chunkLoadRecovery = createChunkLoadRecovery({
				assign: (path) => window.location.assign(path),
				sessionStorage: window.sessionStorage,
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
