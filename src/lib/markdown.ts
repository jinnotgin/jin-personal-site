import type { PostMeta } from '@/data/types'
import {
	categories as generatedCategories,
	pageSize as generatedPageSize,
	totalsByFilter as generatedTotalsByFilter,
} from '@generated/writing/pagesIndex'

const pageLoaders = import.meta.glob<{ items: PostMeta[] }>(
	'../../.generated/writing/pages/*.ts',
)
const pageCache = new Map<string, PostMeta[]>()

export const pageSize = generatedPageSize
export const totalsByFilter = generatedTotalsByFilter
export const categories = generatedCategories.map((c) => c.label)

export function slugifyCategory(cat: string): string {
	return cat
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
}

export function deslugifyCategory(slug: string): string | undefined {
	return generatedCategories.find((c) => c.slug === slug)?.label
}

function pageCacheKey(filterSlug: string, page: number): string {
	return `${filterSlug}:${page}`
}

export function readWritingPageCache(filterSlug: string, page: number) {
	const key = pageCacheKey(filterSlug, page)
	return pageCache.has(key)
		? ({ hit: true, value: pageCache.get(key) } as const)
		: ({ hit: false } as const)
}

export function seedWritingPageCache(filterSlug: string, page: number, items: PostMeta[]) {
	pageCache.set(pageCacheKey(filterSlug, page), items)
}

export async function loadWritingPage(filterSlug: string, page: number): Promise<PostMeta[]> {
	const cached = readWritingPageCache(filterSlug, page)
	if (cached.hit) return cached.value ?? []

	const suffix = `/${filterSlug}-${page}.ts`
	for (const [key, loader] of Object.entries(pageLoaders)) {
		if (key.endsWith(suffix)) {
			const mod = await loader()
			seedWritingPageCache(filterSlug, page, mod.items)
			return mod.items
		}
	}
	seedWritingPageCache(filterSlug, page, [])
	return []
}

export function formatDate(iso: string): string {
	if (!iso) return ''
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return iso
	return d.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}
