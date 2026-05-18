import { Renderer, marked, type Tokens } from 'marked'

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

export function renderMarkdown(markdown: string): string {
  const renderer = new Renderer()

  renderer.link = ({ href, title, tokens }: Tokens.Link) => {
    const text = renderer.parser.parseInline(tokens)
    const titleAttribute = title ? ` title="${escapeAttr(title)}"` : ''
    return `<a href="${escapeAttr(href)}"${titleAttribute} target="_blank" rel="noopener noreferrer">${text}</a>`
  }

  renderer.image = ({ href, title, text }: Tokens.Image) => {
    const img = `<img src="${escapeAttr(href)}" alt="${escapeAttr(text)}" loading="lazy" />`
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
