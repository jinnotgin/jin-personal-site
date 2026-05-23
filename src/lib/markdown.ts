import type { Post, PostMeta } from '@/data/types'
import { resolveMarkdownAssetReferences } from '@/lib/contentAssets'
import { renderMarkdown } from '@/lib/renderMarkdown'

/**
 * Real Markdown infrastructure: posts live as index.md files with YAML-ish
 * frontmatter under dated src/content/writing folders. No build step beyond
 * Vite's raw glob import; no heavy frontmatter dependency.
 */

const files = import.meta.glob('../content/writing/**/*.md', {
	eager: true,
	query: '?raw',
	import: 'default',
}) as Record<string, string>

const assets = import.meta.glob('../content/writing/**/*.{avif,gif,jpeg,jpg,pdf,png,svg,webp}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

function parseFrontmatter(raw: string): {
	data: Record<string, unknown>
	body: string
} {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
	if (!match) return { data: {}, body: raw }

	const front = match[1] ?? ''
	const rawBody = match[2] ?? ''
	const data: Record<string, unknown> = {}
	for (const line of front.split(/\r?\n/)) {
		const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
		if (!kv || !kv[1]) continue
		const key = kv[1]
		let value: unknown = (kv[2] ?? '').trim()
		if (typeof value === 'string') {
			if (/^\[.*\]$/.test(value)) {
				value = value
					.slice(1, -1)
					.split(',')
					.map((s) => s.trim().replace(/^["']|["']$/g, ''))
					.filter(Boolean)
			} else {
				value = value.replace(/^["']|["']$/g, '')
			}
		}
		data[key] = value
	}
	return { data, body: rawBody }
}

function firstMarkdownImage(body: string): Post['image'] {
	const match = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/.exec(body)
	if (!match || !match[2]) return undefined
	return {
		src: match[2],
		alt: match[1] || 'Writing preview image',
	}
}

function build(raw: string, markdownPath: string): Post {
	const { data, body } = parseFrontmatter(raw)
	const resolvedBody = resolveMarkdownAssetReferences(body, markdownPath, assets)
	const words = resolvedBody.trim().split(/\s+/).filter(Boolean).length
	const image = firstMarkdownImage(resolvedBody)
	return {
		slug: String(data.slug ?? ''),
		title: String(data.title ?? 'Untitled'),
		date: String(data.date ?? ''),
		excerpt: String(data.excerpt ?? ''),
		tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
		status: data.status === 'draft' ? 'draft' : 'published',
		category: String(data.category ?? 'Notes'),
		...(image ? { image } : {}),
		html: renderMarkdown(resolvedBody),
		readingMinutes: Math.max(1, Math.round(words / 200)),
	}
}

const allPosts: Post[] = Object.entries(files)
	.map(([path, raw]) => build(raw, path))
	.filter((p) => p.slug && p.status === 'published')
	.sort((a, b) => (a.date < b.date ? 1 : -1))

export function listPosts(): PostMeta[] {
	return allPosts.map(({ html: _html, readingMinutes: _r, ...meta }) => meta)
}

export function getPost(slug: string): Post | undefined {
	return allPosts.find((p) => p.slug === slug)
}

export function postsBySlugs(slugs: string[]): PostMeta[] {
	return slugs.map((s) => allPosts.find((p) => p.slug === s)).filter((p): p is Post => Boolean(p))
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
