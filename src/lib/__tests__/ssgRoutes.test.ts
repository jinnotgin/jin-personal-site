import { describe, expect, it } from 'vitest'

import { contentSlugs } from '../../../ssg-routes'

describe('SSG content routes', () => {
	it('collects nested writing routes from frontmatter slugs', () => {
		expect(contentSlugs('writing')).toContain('building-tools-with-agentic-coding')
	})

	it('collects nested project routes from frontmatter slugs', () => {
		expect(contentSlugs('projects')).toContain('promptpal')
	})
})
