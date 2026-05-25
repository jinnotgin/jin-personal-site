import type { Post } from '@/data/types'
import { buildResponsiveImageMap, resolveMarkdownAssetReferences } from '@/lib/contentAssets'
import { renderMarkdown } from '@/lib/renderMarkdown'
import { imageManifest } from '@generated/imageManifest'

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

const generatedAssets = import.meta.glob('../../.generated/media/content/writing/**/*.{avif,webp}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

const responsiveImages = buildResponsiveImageMap(imageManifest, {
	...assets,
	...generatedAssets,
})

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

function buildPost(raw: string, markdownPath: string): Post {
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
		html: renderMarkdown(resolvedBody, responsiveImages),
		readingMinutes: Math.max(1, Math.round(words / 200)),
	}
}

const allPosts: Post[] = Object.entries(files)
	.map(([path, raw]) => buildPost(raw, path))
	.filter((p) => p.slug && p.status === 'published')
	.sort((a, b) => (a.date < b.date ? 1 : -1))

export function getPost(slug: string): Post | undefined {
	return allPosts.find((p) => p.slug === slug)
}
