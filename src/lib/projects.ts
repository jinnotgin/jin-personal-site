import type { Project, ProjectImage, ProjectLink, ProjectSource } from '@/data/types'
import {
	buildResponsiveImageMap,
	resolveContentAsset,
	type ResponsiveImageManifestEntry,
} from '@/lib/contentAssets'
import { renderMarkdown } from '@/lib/renderMarkdown'

const projectSources = import.meta.glob<{ projectSource: ProjectSource }>(
	'../../.generated/projects/*.ts',
)

const projectManifests = import.meta.glob<{ imageManifest: ResponsiveImageManifestEntry[] }>(
	'../../.generated/imageManifest/content/projects/*.ts',
)

const assets = import.meta.glob('../content/projects/**/*.{avif,gif,jpeg,jpg,pdf,png,svg,webp}', {
	eager: true,
	query: '?url',
	import: 'default',
}) as Record<string, string>

const generatedAssets = import.meta.glob(
	'../../.generated/media/content/projects/**/*.{avif,webp}',
	{ eager: true, query: '?url', import: 'default' },
) as Record<string, string>

const assetMap = { ...assets, ...generatedAssets }

function findEntry<T>(
	map: Record<string, () => Promise<T>>,
	slug: string,
): (() => Promise<T>) | undefined {
	const suffix = `/${slug}.ts`
	for (const key of Object.keys(map)) {
		if (key.endsWith(suffix)) return map[key]
	}
	return undefined
}

function parseLinks(raw: string[], markdownPath: string): ProjectLink[] | undefined {
	const result: ProjectLink[] = []
	for (const item of raw) {
		const sep = item.indexOf('::')
		if (sep === -1) continue
		result.push({
			label: item.slice(0, sep).trim(),
			href: resolveContentAsset(item.slice(sep + 2).trim(), markdownPath, assetMap),
		})
	}
	return result.length ? result : undefined
}

function parseImages(
	raw: string[],
	markdownPath: string,
	responsiveImages: ReturnType<typeof buildResponsiveImageMap>,
): ProjectImage[] | undefined {
	const result: ProjectImage[] = []
	for (const item of raw) {
		const sep = item.indexOf('::')
		if (sep === -1) continue
		const src = resolveContentAsset(item.slice(0, sep).trim(), markdownPath, assetMap)
		result.push({
			src,
			alt: item.slice(sep + 2).trim(),
			...(responsiveImages[src] ? { responsive: responsiveImages[src] } : {}),
		})
	}
	return result.length ? result : undefined
}

export async function getProject(slug: string): Promise<Project | undefined> {
	const sourceLoader = findEntry(projectSources, slug)
	if (!sourceLoader) return undefined
	const { projectSource } = await sourceLoader()

	const manifestLoader = findEntry(projectManifests, slug)
	const manifest = manifestLoader ? (await manifestLoader()).imageManifest : []
	const responsiveImages = buildResponsiveImageMap(manifest, assetMap)

	const links = parseLinks(projectSource.rawLinks, projectSource.markdownPath)
	const images = parseImages(projectSource.rawImages, projectSource.markdownPath, responsiveImages)

	return {
		...projectSource.meta,
		...(links ? { links } : {}),
		...(images ? { images } : {}),
		html: renderMarkdown(projectSource.body.trim(), responsiveImages),
	}
}
