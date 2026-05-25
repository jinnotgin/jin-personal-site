import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const sourcePath = join(process.cwd(), 'src/lib/markdown.ts')
const postSourcePath = join(process.cwd(), 'src/lib/postMarkdown.ts')

describe('writing Markdown module boundary', () => {
	it('keeps writing asset URL imports out of the index metadata module', () => {
		const source = readFileSync(sourcePath, 'utf8')

		expect(source).not.toContain('query: \'?url\'')
		expect(source).not.toContain('renderMarkdown')
		expect(source).not.toContain('buildResponsiveImageMap')
	})

	it('loads writing asset URL imports only for post rendering', () => {
		const source = readFileSync(postSourcePath, 'utf8')

		expect(source).toContain('query: \'?url\'')
		expect(source).toContain('renderMarkdown')
		expect(source).toContain('buildResponsiveImageMap')
	})
})
