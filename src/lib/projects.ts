import { marked } from 'marked'
import type { ProjectMeta, Project, ProjectLink, ProjectImage, ThreadId, ProjectStatus } from '@/data/types'

/**
 * Project content lives as .md files with YAML-ish frontmatter under
 * src/content/projects. Same parser pattern as markdown.ts.
 */

const files = import.meta.glob('../content/projects/*.md', {
  eager: true,
  query: '?raw',
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
function parseLinks(raw: unknown): ProjectLink[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const result: ProjectLink[] = []
  for (const item of raw as string[]) {
    const sep = item.indexOf('::')
    if (sep === -1) continue
    result.push({ label: item.slice(0, sep).trim(), href: item.slice(sep + 2).trim() })
  }
  return result.length ? result : undefined
}

/**
 * Parse `src::alt` pairs from a string array.
 * e.g. ["/img/foo.png::Alt text here"]
 */
function parseImages(raw: unknown): ProjectImage[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const result: ProjectImage[] = []
  for (const item of raw as string[]) {
    const sep = item.indexOf('::')
    if (sep === -1) continue
    result.push({ src: item.slice(0, sep).trim(), alt: item.slice(sep + 2).trim() })
  }
  return result.length ? result : undefined
}

marked.setOptions({ gfm: true, breaks: false })

function buildProject(raw: string): Project {
  const { data, body } = parseFrontmatter(raw)
  const links = parseLinks(data.links)
  const images = parseImages(data.images)
  return {
    slug: String(data.slug ?? ''),
    name: String(data.name ?? ''),
    thread: String(data.thread ?? '') as ThreadId,
    year: String(data.year ?? ''),
    status: (data.status === 'active' ? 'active' : 'archived') as ProjectStatus,
    intent: String(data.intent ?? ''),
    stack: Array.isArray(data.stack) ? (data.stack as string[]) : [],
    ...(links ? { links } : {}),
    ...(images ? { images } : {}),
    html: marked.parse(body.trim(), { async: false }) as string,
  }
}

const allProjects: Project[] = Object.values(files)
  .map(buildProject)
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
