import { Renderer, marked, type Tokens } from 'marked'

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export function renderMarkdown(markdown: string): string {
  const renderer = new Renderer()

  renderer.link = ({ href, title, tokens }: Tokens.Link) => {
    const text = renderer.parser.parseInline(tokens)
    const titleAttribute = title
      ? ` title="${escapeAttribute(title)}"`
      : ''

    return `<a href="${escapeAttribute(href)}"${titleAttribute} target="_blank" rel="noopener noreferrer">${text}</a>`
  }

  return marked.parse(markdown, {
    async: false,
    gfm: true,
    breaks: false,
    renderer,
  }) as string
}
