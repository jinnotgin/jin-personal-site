import { describe, expect, it } from 'vitest'

import {
	buildResponsiveImageMap,
	resolveContentAsset,
	resolveMarkdownAssetReferences,
} from '@/lib/contentAssets'

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

	it('builds responsive image data from generated asset URLs', () => {
		const responsiveAssets = {
			...assets,
			'../generated/media/content/writing/2026/2026-05-18-code-first-design/cover-640.avif':
				'/assets/cover-640.aaa111.avif',
			'../generated/media/content/writing/2026/2026-05-18-code-first-design/cover-960.avif':
				'/assets/cover-960.bbb222.avif',
			'../generated/media/content/writing/2026/2026-05-18-code-first-design/cover-640.webp':
				'/assets/cover-640.ccc333.webp',
			'../generated/media/content/writing/2026/2026-05-18-code-first-design/cover-960.webp':
				'/assets/cover-960.ddd444.webp',
		}

		expect(
			buildResponsiveImageMap(
				[
					{
						source: '../content/writing/2026/2026-05-18-code-first-design/cover.jpg',
						width: 1200,
						height: 800,
						variants: [
							{
								format: 'avif',
								width: 640,
								path: '../generated/media/content/writing/2026/2026-05-18-code-first-design/cover-640.avif',
							},
							{
								format: 'avif',
								width: 960,
								path: '../generated/media/content/writing/2026/2026-05-18-code-first-design/cover-960.avif',
							},
							{
								format: 'webp',
								width: 640,
								path: '../generated/media/content/writing/2026/2026-05-18-code-first-design/cover-640.webp',
							},
							{
								format: 'webp',
								width: 960,
								path: '../generated/media/content/writing/2026/2026-05-18-code-first-design/cover-960.webp',
							},
						],
					},
				],
				responsiveAssets,
			),
		).toEqual({
			'/assets/cover.abc123.jpg': {
				width: 1200,
				height: 800,
				fallback: '/assets/cover-960.ddd444.webp',
				sources: [
					{
						type: 'image/avif',
						srcset: '/assets/cover-640.aaa111.avif 640w, /assets/cover-960.bbb222.avif 960w',
					},
					{
						type: 'image/webp',
						srcset: '/assets/cover-640.ccc333.webp 640w, /assets/cover-960.ddd444.webp 960w',
					},
				],
			},
		})
	})
})
