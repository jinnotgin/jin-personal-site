import fs from 'node:fs'
import path from 'node:path'

function markdownFiles(dir: string): string[] {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = `${dir}/${entry.name}`

		if (entry.isDirectory()) return markdownFiles(path)
		if (entry.isFile() && entry.name.endsWith('.md')) return [path]
		return []
	})
}

function frontmatter(raw: string): Record<string, string> {
	const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
	if (!match?.[1]) return {}

	return Object.fromEntries(
		match[1]
			.split(/\r?\n/)
			.map((line) => {
				const [key, ...value] = line.split(':')

				return [
					key,
					value
						.join(':')
						.trim()
						.replace(/^["']|["']$/g, ''),
				]
			})
			.filter(([key, value]) => key && value),
	)
}

export function contentSlugs(folder: string): string[] {
	const dir = path.join(process.cwd(), 'src', 'content', folder)

	return markdownFiles(dir)
		.map((file) => frontmatter(fs.readFileSync(file, 'utf8')))
		.filter((data) => data.status !== 'draft')
		.map((data) => data.slug)
		.filter((slug): slug is string => Boolean(slug))
}
