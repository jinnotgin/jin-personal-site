type AssetMap = Record<string, string>
export type ResponsiveImageFormat = 'avif' | 'webp'

export interface ResponsiveImageVariant {
	format: ResponsiveImageFormat
	width: number
	path: string
}

export interface ResponsiveImageManifestEntry {
	source: string
	width: number
	height: number
	variants: ResponsiveImageVariant[]
}

export interface ResponsiveImageSource {
	type: string
	srcset: string
}

export interface ResponsiveImage {
	width: number
	height: number
	fallback: string
	sources: ResponsiveImageSource[]
}

export type ResponsiveImageMap = Record<string, ResponsiveImage>

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

export function buildResponsiveImageMap(
	manifest: ResponsiveImageManifestEntry[],
	assets: AssetMap,
): ResponsiveImageMap {
	const responsiveImages: ResponsiveImageMap = {}

	for (const entry of manifest) {
		const originalUrl = assets[entry.source]
		if (!originalUrl) continue

		const sources = (['avif', 'webp'] as const)
			.map((format) => {
				const variants = entry.variants
					.filter((variant) => variant.format === format)
					.sort((a, b) => a.width - b.width)
					.map((variant) => {
						const url = assets[variant.path]
						return url ? `${url} ${variant.width}w` : undefined
					})
					.filter((value): value is string => Boolean(value))

				return variants.length
					? {
							type: `image/${format}`,
							srcset: variants.join(', '),
						}
					: undefined
			})
			.filter((source): source is ResponsiveImageSource => Boolean(source))

		const webpFallback = entry.variants
			.filter((variant) => variant.format === 'webp')
			.sort((a, b) => b.width - a.width)
			.map((variant) => assets[variant.path])
			.find(Boolean)

		if (!sources.length || !webpFallback) continue

		responsiveImages[originalUrl] = {
			width: entry.width,
			height: entry.height,
			fallback: webpFallback,
			sources,
		}
	}

	return responsiveImages
}
