import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentRoot = path.join(root, 'src/content')
const generatedRoot = path.join(root, '.generated')
const homeWritingPath = path.join(generatedRoot, 'homeWriting.ts')
const projectsIndexPath = path.join(generatedRoot, 'projectsIndex.ts')
const writingPostsRoot = path.join(generatedRoot, 'writing/posts')
const writingPagesRoot = path.join(generatedRoot, 'writing/pages')
const writingPagesIndexPath = path.join(generatedRoot, 'writing/pagesIndex.ts')
const projectSourcesRoot = path.join(generatedRoot, 'projects')
const threadIds = ['applied-ai', 'public-platforms', 'signals', 'homegrown', 'human']
const WRITING_PAGE_SIZE = 8

async function walk(dir, matches) {
	const entries = await readdir(dir, { withFileTypes: true })
	const files = []

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath, matches)))
		} else if (entry.isFile() && matches(entry.name)) {
			files.push(fullPath)
		}
	}

	return files
}

function toPosix(value) {
	return value.split(path.sep).join('/')
}

function parseFrontmatter(raw) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
	if (!match) return { data: {}, body: raw }

	const front = match[1] ?? ''
	const body = match[2] ?? ''
	const data = {}
	for (const line of front.split(/\r?\n/)) {
		const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
		if (!kv?.[1]) continue
		const key = kv[1]
		let value = (kv[2] ?? '').trim()
		if (/^\[.*\]$/.test(value)) {
			value = value
				.slice(1, -1)
				.split(',')
				.map((item) => item.trim().replace(/^["']|["']$/g, ''))
				.filter(Boolean)
		} else {
			value = value.replace(/^["']|["']$/g, '')
		}
		data[key] = value
	}

	return { data, body }
}

function firstMarkdownImage(body) {
	const match = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/.exec(body)
	if (!match?.[2]) return undefined
	return {
		src: match[2],
		alt: match[1] || 'Writing preview image',
	}
}

function buildWritingMeta(raw) {
	const { data, body } = parseFrontmatter(raw)
	const image = firstMarkdownImage(body)
	return {
		slug: String(data.slug ?? ''),
		title: String(data.title ?? 'Untitled'),
		date: String(data.date ?? ''),
		excerpt: String(data.excerpt ?? ''),
		tags: Array.isArray(data.tags) ? data.tags : [],
		status: data.status === 'draft' ? 'draft' : 'published',
		category: String(data.category ?? 'Notes'),
		...(image ? { image } : {}),
	}
}

function slugifyCategory(cat) {
	return cat
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
}

function renderWritingPage(items) {
	return `import type { PostMeta } from '@/data/types'

export const items: PostMeta[] = ${JSON.stringify(items, null, 2)}
`
}

function renderWritingPagesIndex({ pageSize, categories, totalsByFilter }) {
	return `export const pageSize = ${pageSize}

export const categories: { slug: string; label: string }[] = ${JSON.stringify(categories, null, 2)}

export const totalsByFilter: Record<string, number> = ${JSON.stringify(totalsByFilter, null, 2)}
`
}

const SOURCE_GLOB_EXT = '{avif,gif,jpeg,jpg,pdf,png,svg,webp}'
const MEDIA_GLOB_EXT = '{avif,webp}'

function renderWritingPostSource(source, { contentDir }) {
	const sourceGlob = `../../../src/content/writing/${contentDir}/**/*.${SOURCE_GLOB_EXT}`
	const mediaGlob = `../../../.generated/media/content/writing/${contentDir}/**/*.${MEDIA_GLOB_EXT}`
	return `import type { WritingPostSource } from '@/data/types'

const sourceAssets = import.meta.glob('${sourceGlob}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

const mediaAssets = import.meta.glob('${mediaGlob}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

function rekey(map: Record<string, string>, from: string, to: string): Record<string, string> {
	const out: Record<string, string> = {}
	for (const [k, v] of Object.entries(map)) out[k.replace(from, to)] = v
	return out
}

export const assets: Record<string, string> = {
	...rekey(sourceAssets, '../../../src/', '../'),
	...rekey(mediaAssets, '../../../.generated/', '../../.generated/'),
}

export const postSource: WritingPostSource = ${JSON.stringify(source, null, 2)}
`
}

function renderHomeWriting(posts) {
	const byThread = Object.fromEntries(
		threadIds.map((threadId) => [
			threadId,
			posts.filter((post) => post.tags.includes(threadId)).slice(0, 4),
		]),
	)

	return `import type { PostMeta, ThreadId } from '@/data/types'

export const homeLatestPosts: PostMeta[] = ${JSON.stringify(posts.slice(0, 3), null, 2)}

export const homePostsByThread: Partial<Record<ThreadId, PostMeta[]>> = ${JSON.stringify(byThread, null, 2)}
`
}

function buildProjectMeta(data) {
	const thread = data.thread
	return {
		slug: String(data.slug ?? ''),
		name: String(data.name ?? ''),
		threads: Array.isArray(thread) ? thread : thread ? [String(thread)] : [],
		year: String(data.year ?? ''),
		status: data.status === 'active' ? 'active' : 'archived',
		intent: String(data.intent ?? ''),
		stack: Array.isArray(data.stack) ? data.stack : [],
	}
}

function renderProjectsIndex(projects) {
	return `import type { ProjectMeta } from '@/data/types'

export const projectsIndex: ProjectMeta[] = ${JSON.stringify(projects, null, 2)}
`
}

function renderProjectSource(source, { slug }) {
	const sourceGlob = `../../src/content/projects/${slug}/**/*.${SOURCE_GLOB_EXT}`
	const mediaGlob = `../../.generated/media/content/projects/${slug}/**/*.${MEDIA_GLOB_EXT}`
	return `import type { ProjectSource } from '@/data/types'

const sourceAssets = import.meta.glob('${sourceGlob}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

const mediaAssets = import.meta.glob('${mediaGlob}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

function rekey(map: Record<string, string>, from: string, to: string): Record<string, string> {
	const out: Record<string, string> = {}
	for (const [k, v] of Object.entries(map)) out[k.replace(from, to)] = v
	return out
}

export const assets: Record<string, string> = {
	...rekey(sourceAssets, '../../src/', '../'),
	...rekey(mediaAssets, '../../.generated/', '../../.generated/'),
}

export const projectSource: ProjectSource = ${JSON.stringify(source, null, 2)}
`
}

async function generateProjectData() {
	const projectsRoot = path.join(contentRoot, 'projects')
	const markdownFiles = await walk(projectsRoot, (fileName) => fileName === 'index.md')
	const projects = []

	await mkdir(projectSourcesRoot, { recursive: true })

	for (const file of markdownFiles) {
		const raw = await readFile(file, 'utf8')
		const { data, body } = parseFrontmatter(raw)
		const meta = buildProjectMeta(data)
		if (!meta.slug) continue
		projects.push(meta)

		const markdownPath = `../content/${toPosix(path.relative(contentRoot, file))}`
		const source = {
			meta,
			body,
			markdownPath,
			rawLinks: Array.isArray(data.links) ? data.links : [],
			rawImages: Array.isArray(data.images) ? data.images : [],
		}
		const projectsRel = path.relative(projectsRoot, path.dirname(file))
		const projectDir = toPosix(projectsRel)
		await writeFile(
			path.join(projectSourcesRoot, `${meta.slug}.ts`),
			renderProjectSource(source, { slug: projectDir }),
		)
	}

	await writeFile(projectsIndexPath, renderProjectsIndex(projects))
	return projects.length
}

async function generateWritingData() {
	const writingRoot = path.join(contentRoot, 'writing')
	const markdownFiles = await walk(writingRoot, (fileName) => fileName.endsWith('.md'))
	const sources = []

	await mkdir(writingPostsRoot, { recursive: true })

	for (const file of markdownFiles) {
		const raw = await readFile(file, 'utf8')
		const meta = buildWritingMeta(raw)
		if (!meta.slug || meta.status === 'draft') continue

		const { body } = parseFrontmatter(raw)
		const markdownPath = `../content/${toPosix(path.relative(contentRoot, file))}`
		const writingRel = path.relative(writingRoot, file)
		const writingRelNoExt = writingRel.slice(0, -path.extname(writingRel).length)
		const isIndex = path.basename(writingRelNoExt) === 'index'
		const contentDir = toPosix(isIndex ? path.dirname(writingRelNoExt) : writingRelNoExt)
		sources.push({
			meta,
			body,
			markdownPath,
			contentDir,
		})
	}

	sources.sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1))

	const allMetas = sources.map((source) => source.meta)

	await mkdir(writingPagesRoot, { recursive: true })

	const categoryLabels = []
	for (const meta of allMetas) {
		if (!categoryLabels.includes(meta.category)) categoryLabels.push(meta.category)
	}
	const categories = categoryLabels.map((label) => ({ slug: slugifyCategory(label), label }))

	const filterGroups = [
		{ slug: 'all', items: allMetas },
		...categories.map(({ slug, label }) => ({
			slug,
			items: allMetas.filter((m) => m.category === label),
		})),
	]

	const totalsByFilter = {}
	const pageWrites = []
	for (const { slug, items } of filterGroups) {
		totalsByFilter[slug] = items.length
		const totalPages = Math.max(1, Math.ceil(items.length / WRITING_PAGE_SIZE))
		for (let page = 1; page <= totalPages; page++) {
			const start = (page - 1) * WRITING_PAGE_SIZE
			const chunk = items.slice(start, start + WRITING_PAGE_SIZE)
			pageWrites.push(
				writeFile(path.join(writingPagesRoot, `${slug}-${page}.ts`), renderWritingPage(chunk)),
			)
		}
	}
	await Promise.all(pageWrites)

	await writeFile(
		writingPagesIndexPath,
		renderWritingPagesIndex({ pageSize: WRITING_PAGE_SIZE, categories, totalsByFilter }),
	)

	await writeFile(homeWritingPath, renderHomeWriting(allMetas))

	const neighbor = (source) => ({ slug: source.meta.slug, title: source.meta.title })
	await Promise.all(
		sources.map((source, index) => {
			const prevSource = index > 0 ? sources[index - 1] : undefined
			const nextSource = index < sources.length - 1 ? sources[index + 1] : undefined
			const { contentDir, ...rest } = source
			const withNeighbors = {
				...rest,
				...(prevSource ? { prev: neighbor(prevSource) } : {}),
				...(nextSource ? { next: neighbor(nextSource) } : {}),
			}
			return writeFile(
				path.join(writingPostsRoot, `${source.meta.slug}.ts`),
				renderWritingPostSource(withNeighbors, { contentDir }),
			)
		}),
	)

	return sources.length
}

async function cleanStaleOutputs() {
	await Promise.all([
		rm(writingPostsRoot, { recursive: true, force: true }),
		rm(writingPagesRoot, { recursive: true, force: true }),
		rm(projectSourcesRoot, { recursive: true, force: true }),
		rm(path.join(generatedRoot, 'writingIndex.ts'), { force: true }),
	])
}

await mkdir(generatedRoot, { recursive: true })

try {
	await cleanStaleOutputs()
	const [postCount, projectCount] = await Promise.all([generateWritingData(), generateProjectData()])
	console.log(`Generated writing data for ${postCount} posts, ${projectCount} projects`)
} catch (error) {
	console.error(error)
	process.exitCode = 1
}
