import { describe, expect, it } from 'vitest'

import { resolveContentAsset, resolveMarkdownAssetReferences } from '@/lib/contentAssets'

const assets = {
	'../content/writing/2026/2026-05-18-code-first-design/cover.jpg': '/assets/cover.abc123.jpg',
	'../content/writing/2026/2026-05-18-code-first-design/inline/one.png': '/assets/one.def456.png',
	'../content/projects/promptpal/promptpal.png': '/assets/promptpal.abc123.png',
}

describe('content asset resolution', () => {
	it('resolves relative Markdown images against the Markdown file location', () => {
		const body = [
			'![Cover](./cover.jpg "Caption")',
			'![Inline](./inline/one.png)',
			'![Absolute](/img/writing/existing.png)',
			'![Remote](https://example.com/remote.png)',
		].join('\n')

		expect(
			resolveMarkdownAssetReferences(
				body,
				'../content/writing/2026/2026-05-18-code-first-design/index.md',
				assets,
			),
		).toBe(
			[
				'![Cover](/assets/cover.abc123.jpg "Caption")',
				'![Inline](/assets/one.def456.png)',
				'![Absolute](/img/writing/existing.png)',
				'![Remote](https://example.com/remote.png)',
			].join('\n'),
		)
	})

	it('resolves project frontmatter image paths against the project folder', () => {
		expect(
			resolveContentAsset('./promptpal.png', '../content/projects/promptpal/index.md', assets),
		).toBe('/assets/promptpal.abc123.png')
	})
})
