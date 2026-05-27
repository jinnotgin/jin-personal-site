import type { ThreadId } from '@/data/types'
import { homeLatestPosts, homePostsByThread as generatedHomePostsByThread } from '@generated/homeWriting'

export { homeLatestPosts }

export function homePostsByThread(threadId: ThreadId) {
	return generatedHomePostsByThread[threadId] ?? []
}

export function slugifyCategory(cat: string): string {
	return cat
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
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
