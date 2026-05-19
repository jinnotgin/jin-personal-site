export type ProjectStatus = 'active' | 'archived'

export interface ProjectLink {
  label: string
  href: string
}

export interface ProjectImage {
  src: string
  alt: string
}

export interface ProjectMeta {
  slug: string
  name: string
  threads: ThreadId[]
  year: string
  status: ProjectStatus
  /** One-line statement of what it is. */
  intent: string
  stack: string[]
  links?: ProjectLink[]
  images?: ProjectImage[]
}

export interface Project extends ProjectMeta {
  html: string
}

export type ThreadId =
  | 'applied-ai'
  | 'public-platforms'
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
  /** Angle in degrees around the identity centre, 0 = right, 270 = top. */
  angle: number
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
  image?: ProjectImage
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
  summary: string | string[]
  threads: ThreadId[]
}

export interface ShelfItem {
  kind: 'book' | 'person' | 'place' | 'idea'
  title: string
  by?: string
  href: string
  note: string
}
