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

// Transforms `:::cols\n...\n:::` blocks into a `<div class="cols">` wrapper.
// Blank lines around the inner content let marked re-enter markdown parsing
// per CommonMark HTML block rules.
function expandColsDirective(markdown: string): string {
  return markdown.replace(
    /^:::cols[ \t]*\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm,
    (_match, inner: string) => `<div class="cols">\n\n${inner}\n\n</div>`,
  )
}

export function renderMarkdown(markdown: string, responsiveImages: ResponsiveImageMap = {}): string {
  const renderer = new Renderer()

  renderer.link = ({ href, title, tokens }: Tokens.Link) => {
    const text = renderer.parser.parseInline(tokens)
    const titleAttribute = title ? ` title="${escapeAttr(title)}"` : ''
    return `<a href="${escapeAttr(href)}"${titleAttribute} target="_blank" rel="noopener noreferrer">${text}</a>`
  }

  renderer.image = ({ href, title, text }: Tokens.Image) => {
    const responsiveImage = responsiveImages[href]
    const imageClass = ' class="content-image"'
    const img = responsiveImage
      ? `<picture class="content-picture">${responsiveImage.sources
          .map(
            (source) =>
              `<source type="${escapeAttr(source.type)}" srcset="${escapeAttr(source.srcset)}" />`,
          )
          .join('')}<img${imageClass} src="${escapeAttr(responsiveImage.fallback)}" alt="${escapeAttr(text)}" loading="lazy" decoding="async" width="${responsiveImage.width}" height="${responsiveImage.height}" sizes="(min-width: 760px) 720px, 92vw" /></picture>`
      : `<img${imageClass} src="${escapeAttr(href)}" alt="${escapeAttr(text)}" loading="lazy" decoding="async" />`
    if (title) {
      const caption = marked.parseInline(title, {
        async: false,
        gfm: true,
        renderer,
      }) as string
      return `<figure class="content-figure">${img}<figcaption>${caption}</figcaption></figure>`
    }
    return img
  }

  return marked.parse(expandColsDirective(markdown), {
    async: false,
    gfm: true,
    breaks: false,
    renderer,
  }) as string
}
