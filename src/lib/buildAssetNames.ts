export interface BuildAssetInfo {
	name?: string
	names?: string[]
	originalFileNames?: string[]
}

const hashedAssetFileName = 'assets/[name]-[hash][extname]'

function normalizePath(path: string) {
	return path.replace(/\\/g, '/')
}

function stableContentPath(path: string) {
	const normalized = normalizePath(path)
	const sourceContent = /(?:^|\/)src\/content\/(.+)$/.exec(normalized)
	if (sourceContent?.[1]) return `content/${sourceContent[1]}`

	const generatedContent = /(?:^|\/)\.generated\/media\/content\/(.+)$/.exec(normalized)
	if (generatedContent?.[1]) return `content/${generatedContent[1]}`

	return undefined
}

export function contentAssetFileName(assetInfo: BuildAssetInfo): string {
	const source =
		assetInfo.originalFileNames?.[0] ?? assetInfo.names?.[0] ?? assetInfo.name ?? ''

	return stableContentPath(source) ?? hashedAssetFileName
}
