import { describe, expect, it, vi } from 'vitest'

import { createChunkLoadRecovery } from '@/lib/deploymentSkew'

describe('deployment skew recovery', () => {
	it('freshly navigates to the failed route when a route chunk is missing', () => {
		const sessionStorage = new Map<string, string>()
		const assign = vi.fn()
		const recovery = createChunkLoadRecovery({
			assign,
			sessionStorage: {
				getItem: (key) => sessionStorage.get(key) ?? null,
				setItem: (key, value) => sessionStorage.set(key, value),
				removeItem: (key) => sessionStorage.delete(key),
			},
		})

		recovery.handleRouterError(
			new TypeError('Failed to fetch dynamically imported module'),
			{ fullPath: '/writing/example-post' },
		)

		expect(assign).toHaveBeenCalledWith('/writing/example-post')
		expect(sessionStorage.get('jin:chunk-refresh-attempted')).toBe('true')
	})

	it('does not repeatedly navigate when the refresh attempt already happened', () => {
		const assign = vi.fn()
		const recovery = createChunkLoadRecovery({
			assign,
			sessionStorage: {
				getItem: () => 'true',
				setItem: vi.fn(),
				removeItem: vi.fn(),
			},
		})

		recovery.handleRouterError(
			new TypeError('Importing a module script failed'),
			{ fullPath: '/projects/promptpal' },
		)

		expect(assign).not.toHaveBeenCalled()
	})

	it('clears the refresh guard after successful navigation', () => {
		const removeItem = vi.fn()
		const recovery = createChunkLoadRecovery({
			assign: vi.fn(),
			sessionStorage: {
				getItem: vi.fn(),
				setItem: vi.fn(),
				removeItem,
			},
		})

		recovery.clearRefreshAttempt()

		expect(removeItem).toHaveBeenCalledWith('jin:chunk-refresh-attempted')
	})
})
