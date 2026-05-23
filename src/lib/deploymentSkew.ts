const REFRESH_ATTEMPT_KEY = 'jin:chunk-refresh-attempted'
const CHUNK_LOAD_ERROR_PATTERNS = [
	'Failed to fetch dynamically imported module',
	'Importing a module script failed',
	'error loading dynamically imported module',
]

type StorageLike = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>

interface ChunkLoadRecoveryOptions {
	assign: (path: string) => void
	sessionStorage: StorageLike
}

interface FailedRoute {
	fullPath?: string
}

function isChunkLoadError(error: unknown) {
	if (!(error instanceof Error)) return false
	return CHUNK_LOAD_ERROR_PATTERNS.some((pattern) => error.message.includes(pattern))
}

export function createChunkLoadRecovery({ assign, sessionStorage }: ChunkLoadRecoveryOptions) {
	function freshNavigate(path: string) {
		if (sessionStorage.getItem(REFRESH_ATTEMPT_KEY)) return

		sessionStorage.setItem(REFRESH_ATTEMPT_KEY, 'true')
		assign(path)
	}

	return {
		clearRefreshAttempt() {
			sessionStorage.removeItem(REFRESH_ATTEMPT_KEY)
		},
		handleRouterError(error: unknown, to: FailedRoute) {
			if (!isChunkLoadError(error)) return
			freshNavigate(to.fullPath || window.location.href)
		},
	}
}
