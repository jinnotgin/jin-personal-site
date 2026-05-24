import { Renderer, marked, type Tokens } from 'marked'
import type { ResponsiveImageMap } from '@/lib/contentAssets'

const escapeAttr = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export function renderMarkdown(markdown: string, responsiveImages: ResponsiveImageMap = {}): string {
  const renderer = new Renderer()

  renderer.link = ({ href, title, tokens }: Tokens.Link) => {
    const text = renderer.parser.parseInline(tokens)
    const titleAttribute = title ? ` title="${escapeAttr(title)}"` : ''
    return `<a href="${escapeAttr(href)}"${titleAttribute} target="_blank" rel="noopener noreferrer">${text}</a>`
  }

  renderer.image = ({ href, title, text }: Tokens.Image) => {
    const responsiveImage = responsiveImages[href]
    const img = responsiveImage
      ? `<picture>${responsiveImage.sources
          .map(
            (source) =>
              `<source type="${escapeAttr(source.type)}" srcset="${escapeAttr(source.srcset)}" />`,
          )
          .join('')}<img src="${escapeAttr(responsiveImage.fallback)}" alt="${escapeAttr(text)}" loading="lazy" decoding="async" width="${responsiveImage.width}" height="${responsiveImage.height}" sizes="(min-width: 760px) 720px, 92vw" /></picture>`
      : `<img src="${escapeAttr(href)}" alt="${escapeAttr(text)}" loading="lazy" decoding="async" />`
    if (title) {
      const caption = marked.parseInline(title, {
        async: false,
        gfm: true,
        renderer,
      }) as string
      return `<figure>${img}<figcaption>${caption}</figcaption></figure>`
    }
    return img
  }

  return marked.parse(markdown, {
    async: false,
    gfm: true,
    breaks: false,
    renderer,
  }) as string
}
