import { marked } from 'marked'
import type { Post, PostMeta } from '@/data/types'

/**
 * Real Markdown infrastructure: posts live as .md files with YAML-ish
 * frontmatter under src/content/writing. No build step beyond Vite's
 * raw glob import; no heavy frontmatter dependency.
 */

const files = import.meta.glob('../content/writing/*.md', {
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

marked.setOptions({ gfm: true, breaks: false })

function build(raw: string): Post {
  const { data, body } = parseFrontmatter(raw)
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return {
    slug: String(data.slug ?? ''),
    title: String(data.title ?? 'Untitled'),
    date: String(data.date ?? ''),
    excerpt: String(data.excerpt ?? ''),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    status: data.status === 'draft' ? 'draft' : 'published',
    category: String(data.category ?? 'Notes'),
    html: marked.parse(body, { async: false }) as string,
    readingMinutes: Math.max(1, Math.round(words / 200)),
  }
}

const allPosts: Post[] = Object.values(files)
  .map(build)
  .filter((p) => p.slug && p.status === 'published')
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function listPosts(): PostMeta[] {
  return allPosts.map(({ html: _html, readingMinutes: _r, ...meta }) => meta)
}

export function getPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug)
}

export function postsBySlugs(slugs: string[]): PostMeta[] {
  return slugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter((p): p is Post => Boolean(p))
}

export const categories = Array.from(
  new Set(allPosts.map((p) => p.category)),
)

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
