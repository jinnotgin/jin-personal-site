import type { JourneyEntry } from './types'

/**
 * Career timeline and older context. Less a ladder, more the terrain
 * Jin has worked in. Replace orgs and dates with real ones.
 */
export const journey: JourneyEntry[] = [
  {
    id: 'applied-innovation',
    period: '2023 — now',
    role: 'Applied innovation',
    org: 'Independent & embedded',
    summary:
      'Putting GenAI into real workflows and helping organisations adopt it without losing judgement. Equal parts building the tooling and facilitating the change around it.',
    threads: ['applied-ai', 'human'],
  },
  {
    id: 'product-systems',
    period: '2019 — 2023',
    role: 'Product & platform',
    org: 'Product teams',
    summary:
      'Shaping platform systems and the practices around them. Learned that most product problems are coordination problems wearing a technical costume.',
    threads: ['public-life', 'human'],
  },
  {
    id: 'signals',
    period: '2020 — 2022',
    role: 'Data & sensemaking',
    org: 'Side and applied work',
    summary:
      'Scraping, analytics, and trend detection. Built CoinGossip and Relatus; left with a durable distrust of single metrics.',
    threads: ['signals'],
  },
  {
    id: 'maker-years',
    period: '2017 — 2020',
    role: 'Maker & builder',
    org: 'Workshop',
    summary:
      'A run of small public utilities and home systems: Now In Singapore, FavEats, Smart Mirror, Alastair. The habit of noticing friction and building the small system around it formed here.',
    threads: ['public-life', 'homegrown'],
  },
]
