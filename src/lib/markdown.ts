import type { PostMeta } from '@/data/types'
import {
	categories as generatedCategories,
	pageSize as generatedPageSize,
	totalsByFilter as generatedTotalsByFilter,
} from '@generated/writing/pagesIndex'

const pageLoaders = import.meta.glob<{ items: PostMeta[] }>(
	'../../.generated/writing/pages/*.ts',
)

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

export async function loadWritingPage(filterSlug: string, page: number): Promise<PostMeta[]> {
	const suffix = `/${filterSlug}-${page}.ts`
	for (const [key, loader] of Object.entries(pageLoaders)) {
		if (key.endsWith(suffix)) {
			const mod = await loader()
			return mod.items
		}
	}
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
