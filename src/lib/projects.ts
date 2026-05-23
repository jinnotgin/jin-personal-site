import type {
	ProjectMeta,
	Project,
	ProjectLink,
	ProjectImage,
	ThreadId,
	ProjectStatus,
} from '@/data/types'
import { resolveContentAsset } from '@/lib/contentAssets'
import { renderMarkdown } from '@/lib/renderMarkdown'

/**
 * Project content lives as index.md files with YAML-ish frontmatter under
 * src/content/projects/{slug}. Same parser pattern as markdown.ts.
 */

const files = import.meta.glob('../content/projects/**/*.md', {
	eager: true,
	query: '?raw',
	import: 'default',
}) as Record<string, string>

const assets = import.meta.glob('../content/projects/**/*.{avif,gif,jpeg,jpg,pdf,png,svg,webp}', {
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

/**
 * Parse `label::href` pairs from a string array.
 * e.g. ["Live site::https://example.com", "GitHub::https://github.com/x"]
 */
function parseLinks(raw: unknown, markdownPath: string): ProjectLink[] | undefined {
	if (!Array.isArray(raw)) return undefined
	const result: ProjectLink[] = []
	for (const item of raw as string[]) {
		const sep = item.indexOf('::')
		if (sep === -1) continue
		result.push({
			label: item.slice(0, sep).trim(),
			href: resolveContentAsset(item.slice(sep + 2).trim(), markdownPath, assets),
		})
	}
	return result.length ? result : undefined
}

/**
 * Parse `src::alt` pairs from a string array.
 * e.g. ["/img/foo.png::Alt text here"]
 */
function parseImages(raw: unknown, markdownPath: string): ProjectImage[] | undefined {
	if (!Array.isArray(raw)) return undefined
	const result: ProjectImage[] = []
	for (const item of raw as string[]) {
		const sep = item.indexOf('::')
		if (sep === -1) continue
		result.push({
			src: resolveContentAsset(item.slice(0, sep).trim(), markdownPath, assets),
			alt: item.slice(sep + 2).trim(),
		})
	}
	return result.length ? result : undefined
}

function buildProject(raw: string, markdownPath: string): Project {
	const { data, body } = parseFrontmatter(raw)
	const links = parseLinks(data.links, markdownPath)
	const images = parseImages(data.images, markdownPath)
	return {
		slug: String(data.slug ?? ''),
		name: String(data.name ?? ''),
		threads: (Array.isArray(data.thread)
			? data.thread
			: data.thread
				? [String(data.thread)]
				: []) as ThreadId[],
		year: String(data.year ?? ''),
		status: (data.status === 'active' ? 'active' : 'archived') as ProjectStatus,
		intent: String(data.intent ?? ''),
		stack: Array.isArray(data.stack) ? (data.stack as string[]) : [],
		...(links ? { links } : {}),
		...(images ? { images } : {}),
		html: renderMarkdown(body.trim()),
	}
}

const allProjects: Project[] = Object.entries(files)
	.map(([path, raw]) => buildProject(raw, path))
	.filter((p) => p.slug)

export function listProjects(): ProjectMeta[] {
	return allProjects.map(({ html: _html, ...meta }) => meta)
}

const latestYear = (project: ProjectMeta) => {
	if (project.year.toLowerCase().includes('now')) return Number.MAX_SAFE_INTEGER

	const years = project.year.match(/\d{4}/g)?.map(Number) ?? []
	return Math.max(...years, 0)
}

const firstYear = (project: ProjectMeta) => {
	const years = project.year.match(/\d{4}/g)?.map(Number) ?? []
	return Math.min(...years, 0)
}

export const byMostRecentProject = (a: ProjectMeta, b: ProjectMeta) =>
	latestYear(b) - latestYear(a) || firstYear(b) - firstYear(a)

export function getProject(slug: string): Project | undefined {
	return allProjects.find((p) => p.slug === slug)
}

export const projects: ProjectMeta[] = listProjects()

export function projectBySlug(slug: string): ProjectMeta | undefined {
	return projects.find((p) => p.slug === slug)
}

export function projectsByThread(threadId: string): ProjectMeta[] {
	return projects.filter((p) => p.threads.includes(threadId as ThreadId))
}
