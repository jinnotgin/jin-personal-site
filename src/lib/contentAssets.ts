type AssetMap = Record<string, string>

const relativeReference = /^(?:\.{1,2}\/|[^/#][^:]*$)/

function dirname(path: string): string {
	const index = path.lastIndexOf('/')
	return index === -1 ? '' : path.slice(0, index)
}

function normalizePath(path: string): string {
	const parts: string[] = []
	for (const part of path.split('/')) {
		if (!part || part === '.') continue
		if (part === '..') {
			const previous = parts[parts.length - 1]
			if (previous && previous !== '..') {
				parts.pop()
			} else {
				parts.push(part)
			}
			continue
		}
		parts.push(part)
	}
	return parts.join('/')
}

export function isRelativeContentReference(value: string): boolean {
	return relativeReference.test(value)
}

export function resolveContentAsset(value: string, markdownPath: string, assets: AssetMap): string {
	if (!isRelativeContentReference(value)) return value

	const resolvedPath = normalizePath(`${dirname(markdownPath)}/${value}`)
	return assets[resolvedPath] ?? value
}

export function resolveMarkdownAssetReferences(
	body: string,
	markdownPath: string,
	assets: AssetMap,
): string {
	return body.replace(
		/!\[([^\]]*)\]\(([^)\s]+)(\s+["'][^"']*["'])?\)/g,
		(match, alt: string, src: string, title: string = '') => {
			const resolved = resolveContentAsset(src, markdownPath, assets)
			if (resolved === src) return match
			return `![${alt}](${resolved}${title})`
		},
	)
}
