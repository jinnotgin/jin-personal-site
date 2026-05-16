export type ProjectStatus = 'active' | 'experiment' | 'archived' | 'discontinued'

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  slug: string
  name: string
  thread: ThreadId
  year: string
  status: ProjectStatus
  /** One-line statement of what it is. */
  intent: string
  /** Why it existed. */
  why: string
  /** The system or friction it responded to. */
  friction: string
  /** What was actually built. */
  built: string
  /** What it left behind: a lesson, a pattern, or where it went. */
  trace?: string
  stack: string[]
  links?: ProjectLink[]
}

export type ThreadId =
  | 'applied-ai'
  | 'public-life'
  | 'signals'
  | 'homegrown'
  | 'human'

export interface Thread {
  id: ThreadId
  label: string
  /** Short line shown on the map node. */
  line: string
  /** Longer framing shown when the trail opens. */
  blurb: string
  /** Angle in degrees around the identity centre, 0 = right, clockwise. */
  angle: number
  projects: string[]
  writing: string[]
  journey: string[]
  external?: ProjectLink[]
}

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  status: 'published' | 'draft'
  category: string
}

export interface Post extends PostMeta {
  html: string
  readingMinutes: number
}

export interface JourneyEntry {
  id: string
  period: string
  role: string
  org: string
  summary: string
  threads: ThreadId[]
}

export interface ShelfItem {
  kind: 'book' | 'person' | 'place' | 'idea'
  title: string
  by?: string
  note: string
}
