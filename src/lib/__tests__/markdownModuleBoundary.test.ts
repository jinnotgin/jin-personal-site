import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const sourcePath = join(process.cwd(), 'src/lib/markdown.ts')
const postSourcePath = join(process.cwd(), 'src/lib/postMarkdown.ts')
const projectSourcePath = join(process.cwd(), 'src/lib/projects.ts')

describe('writing Markdown module boundary', () => {
	it('keeps writing asset URL imports out of the index metadata module', () => {
		const source = readFileSync(sourcePath, 'utf8')

		expect(source).not.toContain("query: '?url'")
		expect(source).not.toContain('renderMarkdown')
		expect(source).not.toContain('buildResponsiveImageMap')
	})

	it('keeps section-wide asset URL globs out of post rendering', () => {
		const source = readFileSync(postSourcePath, 'utf8')

		expect(source).not.toContain("query: '?url'")
		expect(source).toContain('renderMarkdown')
		expect(source).toContain('buildResponsiveImageMap')
	})

	it('loads writing data lazily per slug, never the bundled section manifest', () => {
		const postSource = readFileSync(postSourcePath, 'utf8')

		expect(postSource).not.toContain('@generated/imageManifest.writing')
		expect(postSource).not.toContain('@generated/imageManifest.projects')
		expect(postSource).toContain('.generated/writing/posts/*.ts')
		expect(postSource).toContain('.generated/imageManifest/content/writing/')
	})

	it('loads project data lazily per slug, never the bundled section manifest', () => {
		const projectSource = readFileSync(projectSourcePath, 'utf8')

		expect(projectSource).not.toContain("query: '?url'")
		expect(projectSource).not.toContain('@generated/imageManifest.projects')
		expect(projectSource).not.toContain('@generated/imageManifest.writing')
		expect(projectSource).toContain('.generated/projects/*.ts')
		expect(projectSource).toContain('.generated/imageManifest/content/projects/')
	})
})
