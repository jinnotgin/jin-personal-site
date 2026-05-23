export interface BuildInfo {
	commit: string
	builtAt: string
}

export const buildInfo: BuildInfo = {
	commit: __APP_COMMIT__,
	builtAt: __APP_BUILT_AT__,
}

export function shortCommit(commit: string) {
	return commit.slice(0, 7)
}
