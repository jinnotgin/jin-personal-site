import { describe, expect, it } from 'vitest'

import { contentAssetFileName } from '@/lib/buildAssetNames'

describe('content asset file names', () => {
	it('emits source content images at stable content paths', () => {
		expect(
			contentAssetFileName({
				originalFileNames: ['src/content/writing/2026/example-post/cover.jpg'],
			}),
		).toBe('content/writing/2026/example-post/cover.jpg')
	})

	it('emits generated responsive variants at stable content paths', () => {
		expect(
			contentAssetFileName({
				originalFileNames: ['.generated/media/content/projects/promptpal/promptpal-960.webp'],
			}),
		).toBe('content/projects/promptpal/promptpal-960.webp')
	})

	it('normalizes Windows-style source paths', () => {
		expect(
			contentAssetFileName({
				originalFileNames: ['src\\content\\projects\\promptpal\\promptpal.png'],
			}),
		).toBe('content/projects/promptpal/promptpal.png')
	})

	it('keeps non-content assets hashed', () => {
		expect(
			contentAssetFileName({
				originalFileNames: ['src/main.css'],
			}),
		).toBe('assets/[name]-[hash][extname]')
	})
})
