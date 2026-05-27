import type { Post, WritingPostSource } from '@/data/types'
import {
	buildResponsiveImageMap,
	resolveMarkdownAssetReferences,
	type ResponsiveImageManifestEntry,
} from '@/lib/contentAssets'
import { renderMarkdown } from '@/lib/renderMarkdown'

const postSources = import.meta.glob<{
	postSource: WritingPostSource
	assets: Record<string, string>
}>('../../.generated/writing/posts/*.ts')

const postManifests = import.meta.glob<{ imageManifest: ResponsiveImageManifestEntry[] }>(
	'../../.generated/imageManifest/content/writing/**/*.ts',
)

const postCache = new Map<string, Post | undefined>()

function firstMarkdownImage(body: string): Post['image'] {
	const match = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'))?\)/.exec(body)
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

export function getCachedPost(slug: string): Post | undefined {
	return postCache.get(slug)
}

export function readPostCache(slug: string) {
	return postCache.has(slug)
		? ({ hit: true, value: postCache.get(slug) } as const)
		: ({ hit: false } as const)
}

export function seedPostCache(post: Post) {
	postCache.set(post.slug, post)
}

export async function getPost(slug: string): Promise<Post | undefined> {
	if (postCache.has(slug)) return postCache.get(slug)

	const sourceLoader = findEntry(postSources, slug)
	if (!sourceLoader) {
		postCache.set(slug, undefined)
		return undefined
	}
	const { postSource, assets } = await sourceLoader()
	if (postSource.meta.status !== 'published') {
		postCache.set(slug, undefined)
		return undefined
	}

	const manifestLoader = findEntry(postManifests, slug)
	const manifest = manifestLoader ? (await manifestLoader()).imageManifest : []
	const responsiveImages = buildResponsiveImageMap(manifest, assets)

	const resolvedBody = resolveMarkdownAssetReferences(postSource.body, postSource.markdownPath, assets)
	const words = resolvedBody.trim().split(/\s+/).filter(Boolean).length
	const image = firstMarkdownImage(resolvedBody)

	const post = {
		...postSource.meta,
		...(image ? { image } : {}),
		...(postSource.prev ? { prev: postSource.prev } : {}),
		...(postSource.next ? { next: postSource.next } : {}),
		html: renderMarkdown(resolvedBody, responsiveImages),
		readingMinutes: Math.max(1, Math.round(words / 200)),
	}
	postCache.set(slug, post)
	return post
}
