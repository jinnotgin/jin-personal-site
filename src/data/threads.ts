import type { Thread } from './types'

/**
 * The recurring threads Jin returns to. These are the homepage.
 * `angle` places the node on the constellation (degrees, 0 = right,
 * clockwise; 270 = top). Connections are the evidence trails.
 */
export const threads: Thread[] = [
  {
    id: 'applied-ai',
    label: 'Applied AI & tooling',
    line: 'GenAI that earns its keep in real workflows.',
    blurb:
      'Retrieval, small agents, and the unglamorous plumbing that makes model output auditable instead of impressive-once. The throughline: defaults that are cheap and honest by design.',
    angle: 270,
    projects: ['promptpal', 'bifrost-caching-plugin', 'rootstock', 'model-adapters'],
    writing: ['retrieval-over-vibes', 'the-gap-we-underestimate'],
    journey: ['applied-innovation'],
    external: [{ label: 'GitHub', href: 'https://github.com/' }],
  },
  {
    id: 'public-life',
    label: 'Public-life utilities',
    line: 'Small systems that remove public friction.',
    blurb:
      'Civic and everyday tools built from a single observation: the data was public, the access was not. Deliberately small, deliberately accountable.',
    angle: 342,
    projects: ['now-in-singapore', 'faveats', 'jt-concierge', 'nearly'],
    writing: ['notice-friction-build-small'],
    journey: ['maker-years', 'product-systems'],
  },
  {
    id: 'signals',
    label: 'Signals & sensemaking',
    line: 'Reading attention, not just the number.',
    blurb:
      'Scraping, sentiment, and trend detection, with a standing distrust of any single metric. Show the workings, not just the conclusion.',
    angle: 54,
    projects: ['coingossip', 'relatus'],
    writing: ['distrust-one-metric'],
    journey: ['signals'],
  },
  {
    id: 'homegrown',
    label: 'Homegrown systems',
    line: 'Local-first machines I can read the source of.',
    blurb:
      'Self-hosted home automation and physical builds. The lessons here are paid for in downtime, which is why they stick.',
    angle: 126,
    projects: ['alastair', 'smart-mirror', 'the-resistance', 'timemoo'],
    writing: ['maker-notes-downtime'],
    journey: ['maker-years'],
  },
  {
    id: 'human',
    label: 'Human systems',
    line: 'Adoption that keeps judgement and dignity.',
    blurb:
      'Facilitation, stakeholder alignment, and change that does not cost people their standing. The half of the work that does not show up in a repo.',
    angle: 198,
    projects: ['relatus'],
    writing: ['adoption-without-attrition', 'building-habits-not-features'],
    journey: ['applied-innovation', 'product-systems'],
  },
]

export const threadById = (id: string) => threads.find((t) => t.id === id)
