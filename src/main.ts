import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import posthog from 'posthog-js'

import './main.css'
import App from './App.vue'
import { routes, scrollBehavior } from './router/routes'

export const createApp = ViteSSG(
	App,
	{ routes, base: import.meta.env.BASE_URL, scrollBehavior },
	({ app, router, isClient }) => {
		app.use(createPinia())

		if (isClient) {
			posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN || '', {
				api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
				defaults: '2026-01-30',
			})

			app.config.errorHandler = (err) => {
				posthog.captureException(err)
			}

			router.afterEach((to) => {
				document.title = (to.meta.title as string) ?? 'Jin'
			})
		}
	},
)
