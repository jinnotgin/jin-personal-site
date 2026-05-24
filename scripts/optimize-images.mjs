import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentRoot = path.join(root, 'src/content')
const generatedRoot = path.join(root, '.generated')
const mediaRoot = path.join(generatedRoot, 'media')
const manifestPath = path.join(generatedRoot, 'imageManifest.ts')

const sourcePattern = /\.(jpe?g|png)$/i
const widths = [640, 960, 1400]
const formats = [
	{ name: 'avif', options: { quality: 50, effort: 4 } },
	{ name: 'webp', options: { quality: 80, effort: 4 } },
]

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true })
	const files = []

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)))
		} else if (entry.isFile() && sourcePattern.test(entry.name)) {
			files.push(fullPath)
		}
	}

	return files
}

function toPosix(value) {
	return value.split(path.sep).join('/')
}

function withoutExtension(value) {
	return value.slice(0, -path.extname(value).length)
}

async function optimizeImage(filePath) {
	const sourceStats = await stat(filePath)
	const image = sharp(filePath)
	const metadata = await image.metadata()

	if (!metadata.width || !metadata.height) return undefined

	const relativeFromContent = path.relative(contentRoot, filePath)
	const outputDir = path.join(mediaRoot, 'content', path.dirname(relativeFromContent))
	const baseName = withoutExtension(path.basename(filePath))
	const usableWidths = widths.filter((width) => width <= metadata.width)
	if (!usableWidths.includes(metadata.width)) usableWidths.push(metadata.width)

	await mkdir(outputDir, { recursive: true })

	const variants = []
	for (const width of usableWidths.sort((a, b) => a - b)) {
		for (const format of formats) {
			const outputPath = path.join(outputDir, `${baseName}-${width}.${format.name}`)
			const outputStats = await stat(outputPath).catch(() => undefined)
			if (!outputStats || outputStats.mtimeMs < sourceStats.mtimeMs) {
				await sharp(filePath)
					.rotate()
					.resize({ width, withoutEnlargement: true })
					.toFormat(format.name, format.options)
					.toFile(outputPath)
			}

			variants.push({
				format: format.name,
				width,
				path: `../../.generated/${toPosix(path.relative(generatedRoot, outputPath))}`,
			})
		}
	}

	return {
		source: `../content/${toPosix(relativeFromContent)}`,
		width: metadata.width,
		height: metadata.height,
		variants,
	}
}

function renderManifest(entries) {
	return `import type { ResponsiveImageManifestEntry } from '@/lib/contentAssets'

export const imageManifest: ResponsiveImageManifestEntry[] = ${JSON.stringify(entries, null, 2)}
`
}

await mkdir(generatedRoot, { recursive: true })

try {
	await stat(contentRoot)

	const files = await walk(contentRoot)
	const entries = (await Promise.all(files.map(optimizeImage))).filter(Boolean)
	entries.sort((a, b) => a.source.localeCompare(b.source))

	await writeFile(manifestPath, renderManifest(entries))
	console.log(`Optimized ${entries.length} images into ${path.relative(root, mediaRoot)}`)
} catch (error) {
	console.error(error)
	process.exitCode = 1
}
