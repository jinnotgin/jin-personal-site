import { site } from '@/data/site'
import type { Post, Project, ProjectImage } from '@/data/types'

type MetaTag =
  | { name: string; content: string }
  | { property: string; content: string }

interface SeoInput {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  image?: ProjectImage
  publishedTime?: string
}

const absoluteUrl = (value: string) => new URL(value, site.url).toString()

function titleWithSite(title: string): string {
  return title === site.name ? `${site.name} - ${site.role}` : `${title} - ${site.name}`
}

export function seo(input: SeoInput) {
  const title = titleWithSite(input.title)
  const url = absoluteUrl(input.path)
  const image = absoluteUrl(input.image?.src ?? site.previewImage)
  const description = input.description || site.previewDescription
  const meta: MetaTag[] = [
    { name: 'description', content: description },
    { property: 'og:type', content: input.type ?? 'website' },
    { property: 'og:site_name', content: site.name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: input.image?.alt ?? `${site.name} preview card` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]

  if (input.type === 'article' && input.publishedTime) {
    meta.push({ property: 'article:published_time', content: input.publishedTime })
  }

  return {
    title,
    link: [{ rel: 'canonical' as const, href: url }],
    meta,
  }
}

export function siteSeo(path = '/') {
  return seo({
    title: site.name,
    description: site.description,
    path,
    image: { src: site.previewImage, alt: `${site.name} site preview` },
  })
}

export function writingIndexSeo() {
  return seo({
    title: 'Writing',
    description: 'Working notes on applied AI, product systems, software, and organisational change.',
    path: '/writing',
    image: { src: '/img/writing-vignette-v2.webp', alt: 'Writing preview image' },
  })
}

export function postSeo(post: Post) {
  return seo({
    title: post.title,
    description: post.excerpt,
    path: `/writing/${post.slug}`,
    type: 'article',
    image: post.image,
    publishedTime: post.date,
  })
}

export function projectsIndexSeo() {
  return seo({
    title: 'Projects',
    description: 'Projects and tools grouped by why they existed, from applied AI to public platforms and homegrown experiments.',
    path: '/projects',
    image: { src: '/img/projects-vignette.webp', alt: 'Projects preview image' },
  })
}

export function projectSeo(project: Project) {
  return seo({
    title: project.name,
    description: project.intent,
    path: `/projects/${project.slug}`,
    image: project.images?.[0],
  })
}
