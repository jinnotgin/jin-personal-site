import type { Post, WritingPostSource } from '@/data/types'
import {
	buildResponsiveImageMap,
	resolveMarkdownAssetReferences,
	type ResponsiveImageManifestEntry,
} from '@/lib/contentAssets'
import { renderMarkdown } from '@/lib/renderMarkdown'

const postSources = import.meta.glob<{ postSource: WritingPostSource }>(
	'../../.generated/writing/posts/*.ts',
)

const postManifests = import.meta.glob<{ imageManifest: ResponsiveImageManifestEntry[] }>(
	'../../.generated/imageManifest/content/writing/**/*.ts',
)

const assets = import.meta.glob('../content/writing/**/*.{avif,gif,jpeg,jpg,pdf,png,svg,webp}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

const generatedAssets = import.meta.glob(
	'../../.generated/media/content/writing/**/*.{avif,webp}',
	{ eager: true, query: '?url', import: 'default' },
) as Record<string, string>

const assetMap = { ...assets, ...generatedAssets }

function firstMarkdownImage(body: string): Post['image'] {
	const match = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/.exec(body)
	if (!match || !match[2]) return undefined
	return {
		src: match[2],
		alt: match[1] || 'Writing preview image',
	}
}

function findEntry<T>(
	map: Record<string, () => Promise<T>>,
	slug: string,
): (() => Promise<T>) | undefined {
	const suffix = `/${slug}.ts`
	for (const key of Object.keys(map)) {
		if (key.endsWith(suffix)) return map[key]
	}
	return undefined
}

export async function getPost(slug: string): Promise<Post | undefined> {
	const sourceLoader = findEntry(postSources, slug)
	if (!sourceLoader) return undefined
	const { postSource } = await sourceLoader()
	if (postSource.meta.status !== 'published') return undefined

	const manifestLoader = findEntry(postManifests, slug)
	const manifest = manifestLoader ? (await manifestLoader()).imageManifest : []
	const responsiveImages = buildResponsiveImageMap(manifest, assetMap)

	const resolvedBody = resolveMarkdownAssetReferences(postSource.body, postSource.markdownPath, assetMap)
	const words = resolvedBody.trim().split(/\s+/).filter(Boolean).length
	const image = firstMarkdownImage(resolvedBody)

	return {
		...postSource.meta,
		...(image ? { image } : {}),
		html: renderMarkdown(resolvedBody, responsiveImages),
		readingMinutes: Math.max(1, Math.round(words / 200)),
	}
}
