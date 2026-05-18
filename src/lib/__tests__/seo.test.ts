import { describe, expect, it } from 'vitest'

import { postSeo, projectSeo } from '@/lib/seo'
import type { Post, Project } from '@/data/types'

function metaContent(
  tags: ReturnType<typeof postSeo>['meta'],
  key: { name?: string; property?: string },
) {
  return tags.find((tag) =>
    'name' in key && key.name
      ? 'name' in tag && tag.name === key.name
      : 'property' in tag && tag.property === key.property,
  )?.content
}

describe('seo', () => {
  it('builds social metadata for writing posts from article data', () => {
    const post: Post = {
      slug: 'ai-universal-translator-still-amplifies-your-intent',
      title: 'AI is a universal translator, but it still amplifies your intent',
      date: '2026-05-02',
      excerpt: 'AI compresses the distance between intent and working software.',
      tags: ['ai', 'applied-ai'],
      status: 'published',
      category: 'AI in practice',
      image: {
        src: '/img/writing/ai-universal-translator-still-amplifies-your-intent/cover.jpg',
        alt: 'Illustrated cover about AI translating intent into working software',
      },
      html: '<p>Body</p>',
      readingMinutes: 6,
    }

    const head = postSeo(post)

    expect(head.title).toBe(
      'AI is a universal translator, but it still amplifies your intent - Jin',
    )
    expect(head.link).toContainEqual({
      rel: 'canonical',
      href: 'https://itsjin.com/writing/ai-universal-translator-still-amplifies-your-intent',
    })
    expect(metaContent(head.meta, { name: 'description' })).toBe(post.excerpt)
    expect(metaContent(head.meta, { property: 'og:type' })).toBe('article')
    expect(metaContent(head.meta, { property: 'og:image' })).toBe(
      'https://itsjin.com/img/writing/ai-universal-translator-still-amplifies-your-intent/cover.jpg',
    )
    expect(metaContent(head.meta, { property: 'article:published_time' })).toBe(
      '2026-05-02',
    )
    expect(metaContent(head.meta, { name: 'twitter:card' })).toBe('summary_large_image')
  })

  it('builds social metadata for projects from project data', () => {
    const project: Project = {
      slug: 'promptpal',
      name: 'PromptPal',
      threads: ['applied-ai'],
      year: '2023-now',
      status: 'active',
      intent: 'An internal Generative AI product for confidential, organisation-wide LLM access.',
      stack: ['LLMs', 'RAG'],
      images: [
        {
          src: '/img/projects/promptpal.png',
          alt: 'PromptPal interface showing internal AI work with files and prompt workflows.',
        },
      ],
      html: '<p>Body</p>',
    }

    const head = projectSeo(project)

    expect(head.title).toBe('PromptPal - Jin')
    expect(head.link).toContainEqual({
      rel: 'canonical',
      href: 'https://itsjin.com/projects/promptpal',
    })
    expect(metaContent(head.meta, { property: 'og:title' })).toBe('PromptPal - Jin')
    expect(metaContent(head.meta, { property: 'og:description' })).toBe(project.intent)
    expect(metaContent(head.meta, { property: 'og:image' })).toBe(
      'https://itsjin.com/img/projects/promptpal.png',
    )
    expect(metaContent(head.meta, { name: 'twitter:image' })).toBe(
      'https://itsjin.com/img/projects/promptpal.png',
    )
  })
})
