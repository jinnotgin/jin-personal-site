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
})
