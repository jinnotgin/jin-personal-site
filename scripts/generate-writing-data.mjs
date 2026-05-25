import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentRoot = path.join(root, 'src/content')
const generatedRoot = path.join(root, '.generated')
const writingIndexPath = path.join(generatedRoot, 'writingIndex.ts')
const homeWritingPath = path.join(generatedRoot, 'homeWriting.ts')
const homeProjectsPath = path.join(generatedRoot, 'homeProjects.ts')
const writingPostsRoot = path.join(generatedRoot, 'writing/posts')
const projectSourcesRoot = path.join(generatedRoot, 'projects')
const writingPagesRoot = path.join(generatedRoot, 'writing/pages')
const legacyWritingCatalogPath = path.join(generatedRoot, 'writingCatalog.ts')
const threadIds = ['applied-ai', 'public-platforms', 'signals', 'homegrown', 'human']

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

function renderWritingIndex(posts) {
	return `import type { PostMeta } from '@/data/types'

export const writingIndex: PostMeta[] = ${JSON.stringify(posts, null, 2)}
`
}

function renderWritingPostSource(source) {
	return `import type { WritingPostSource } from '@/data/types'

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

function renderHomeProjects(projects) {
	return `import type { ProjectMeta } from '@/data/types'

export const homeProjects: ProjectMeta[] = ${JSON.stringify(projects, null, 2)}
`
}

function renderProjectSource(source) {
	return `import type { ProjectSource } from '@/data/types'

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
		await writeFile(
			path.join(projectSourcesRoot, `${meta.slug}.ts`),
			renderProjectSource(source),
		)
	}

	await writeFile(homeProjectsPath, renderHomeProjects(projects))
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
		sources.push({
			meta,
			body,
			markdownPath,
		})
	}

	sources.sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1))

	await writeFile(
		writingIndexPath,
		renderWritingIndex(sources.map((source) => source.meta)),
	)

	await writeFile(homeWritingPath, renderHomeWriting(sources.map((source) => source.meta)))

	await Promise.all(
		sources.map((source) =>
			writeFile(path.join(writingPostsRoot, `${source.meta.slug}.ts`), renderWritingPostSource(source)),
		),
	)

	return sources.length
}

async function cleanStaleOutputs() {
	await Promise.all([
		rm(writingPagesRoot, { recursive: true, force: true }),
		rm(legacyWritingCatalogPath, { force: true }),
		rm(writingPostsRoot, { recursive: true, force: true }),
		rm(projectSourcesRoot, { recursive: true, force: true }),
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
