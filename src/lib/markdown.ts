import type { PostMeta } from '@/data/types'
import { writingIndex } from '@generated/writingIndex'

const allPosts: PostMeta[] = writingIndex

export function listPosts(): PostMeta[] {
	return allPosts
}

export function postsBySlugs(slugs: string[]): PostMeta[] {
	return slugs.map((s) => allPosts.find((p) => p.slug === s)).filter((p): p is PostMeta => Boolean(p))
}

export function postsByThread(threadId: string): PostMeta[] {
	return allPosts.filter((p) => p.tags.includes(threadId))
}

export const categories = Array.from(new Set(allPosts.map((p) => p.category)))

export function slugifyCategory(cat: string): string {
	return cat
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
}

export function deslugifyCategory(slug: string): string | undefined {
	return categories.find((c) => slugifyCategory(c) === slug)
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
