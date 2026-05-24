import { describe, expect, it } from 'vitest'

import { renderMarkdown } from '@/lib/renderMarkdown'

describe('renderMarkdown', () => {
  it('renders image titles as captions', () => {
    const html = renderMarkdown(
      '![Output preview](/img/output.png "How the converted output looks")',
    )

    expect(html).toContain('<figure>')
    expect(html).toContain('<img src="/img/output.png" alt="Output preview"')
    expect(html).toContain('<figcaption>How the converted output looks</figcaption>')
    expect(html).not.toContain('![Output preview]')
  })

  it('expands a :::cols block into a side-by-side wrapper with parsed markdown inside', () => {
    const html = renderMarkdown(
      [':::cols', '![left](/img/a.png "A")', '', '![right](/img/b.png "B")', ':::'].join('\n'),
    )

    expect(html).toContain('<div class="cols">')
    expect(html).toContain('<img src="/img/a.png" alt="left"')
    expect(html).toContain('<img src="/img/b.png" alt="right"')
    expect(html).toContain('<figcaption>A</figcaption>')
    expect(html).toContain('<figcaption>B</figcaption>')
    expect(html).not.toContain(':::')
  })

  it('renders responsive image metadata as a picture element', () => {
    const html = renderMarkdown('![Output preview](/assets/output.abc123.jpg)', {
      '/assets/output.abc123.jpg': {
        width: 1200,
        height: 800,
        fallback: '/assets/output-960.def456.webp',
        sources: [
          {
            type: 'image/avif',
            srcset: '/assets/output-640.aaa111.avif 640w, /assets/output-960.bbb222.avif 960w',
          },
          {
            type: 'image/webp',
            srcset: '/assets/output-640.ccc333.webp 640w, /assets/output-960.def456.webp 960w',
          },
        ],
      },
    })

    expect(html).toContain('<picture>')
    expect(html).toContain(
      '<source type="image/avif" srcset="/assets/output-640.aaa111.avif 640w, /assets/output-960.bbb222.avif 960w" />',
    )
    expect(html).toContain(
      '<img src="/assets/output-960.def456.webp" alt="Output preview" loading="lazy" decoding="async" width="1200" height="800" sizes="(min-width: 760px) 720px, 92vw" />',
    )
  })
})
