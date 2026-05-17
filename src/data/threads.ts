import type { Thread } from './types'

/**
 * The recurring threads Jin returns to. These are the homepage.
 * `angle` places the node on the constellation (degrees, 0 = right,
 * increasing with screen y; 270 = top). Connections are the evidence trails.
 */
export const threads: Thread[] = [
  {
    id: 'applied-ai',
    label: 'Applied AI in practice',
    line: 'AI tools that survive contact with real workflows.',
    blurb:
      'Internal AI products, transcription flows, retrieval systems, agents, voice experiments, and the operating practices around them. The throughline is not novelty; it is making AI useful, confidential, legible, and adoptable inside real organisations.',
    angle: 270,
    projects: [
      'promptpal',
      'promptpal-transcribe',
      'now-in-singapore',
      'testforge',
      'pete',
    ],
    writing: [
      'how-you-talk-ai-itself-design-decision',
      'ai-universal-translator-still-amplifies-your-intent',
      'before-adopting-ai-agree-what-you-mean',
      'thinking-you-cant-get-back-hidden-cost-ai',
      'five-levels-ai-first-software-team',
      'why-ai-features-need-proving-before-ship-demos-arent-enough',
      'finding-the-unwritten-context-in-code-and-documentation',
      'building-tools-with-agentic-coding',
      'piloting-ai-tools-for-survey-analysis',
    ],
    journey: ['applied-innovation-lead'],
  },
  {
    id: 'public-platforms',
    label: 'Public platforms',
    line: 'Policy intent translated into services people depend on.',
    blurb:
      'National-scale product work where policy, agency priorities, delivery constraints, and citizen or student outcomes have to resolve into a working platform. Most of the evidence here lives in the journey rather than a public demo.',
    angle: 198,
    projects: ['training-allowance-system', 'student-learning-space'],
    writing: [],
    journey: ['training-allowance-system', 'student-learning-space'],
  },
  {
    id: 'signals',
    label: 'Sensemaking tools',
    line: 'Making messy signals easier to inspect and act on.',
    blurb:
      'Scraping, summarisation, categorisation, taxonomy exploration, trend detection, and AI-assisted research. The recurring move is to turn scattered information into a surface that helps people make better judgement calls.',
    angle: 126,
    projects: [
      'skills-framework-explorer',
      'now-in-singapore',
      'coingossip',
    ],
    writing: ['piloting-ai-tools-for-survey-analysis'],
    journey: ['forensic-analytics', 'signals-and-research'],
  },
  {
    id: 'human',
    label: 'Commercial workflows',
    line: 'Client and enterprise operations made easier to run.',
    blurb:
      'Client, enterprise, and operational tooling where the value is in making a messy workflow easier to quote, track, deploy, report on, or manage. Some of this sits in project pages; some belongs in the career timeline because the artifact itself is not public.',
    angle: 54,
    projects: ['relatus', 'jt-concierge', 'bmw-vantage'],
    writing: [],
    journey: [
      'audit-modernisation',
      'digital-village-developer',
      'mindef-procurement',
      'ncs-deployment',
    ],
  },
  {
    id: 'homegrown',
    label: 'Personal builds',
    line: 'Self-initiated tools built close to the problem.',
    blurb:
      'Personal utilities, hardware builds, games, small apps, and experiments that started from my own friction or curiosity. The pattern is deliberately small: notice the repeated irritation, build a useful thing around it, and keep the maker signal visible.',
    angle: 342,
    projects: ['faveats', 'alastair', 'smart-mirror', 'the-resistance', 'timemoo', 'nearly'],
    writing: [],
    journey: [],
  },
]

export const threadById = (id: string) => threads.find((t) => t.id === id)
