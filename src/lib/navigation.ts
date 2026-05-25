import { ref } from 'vue'
import type { Router } from 'vue-router'

const REVEAL_DELAY = 150

export const isNavigating = ref(false)
// Stays false until the first client-side navigation fires.
// Used to suppress the skeleton on direct/SSR page loads.
export const hasNavigated = ref(false)

export function installNavigationProgress(router: Router) {
	let timer: ReturnType<typeof setTimeout> | undefined

	const finish = () => {
		if (timer) {
			clearTimeout(timer)
			timer = undefined
		}
		isNavigating.value = false
	}

	router.beforeEach((to, from) => {
		if (to.path === from.path) return
		hasNavigated.value = true
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			isNavigating.value = true
		}, REVEAL_DELAY)
	})

	router.afterEach(finish)
	router.onError(finish)
}
