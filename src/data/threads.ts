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
      'AI work here starts from real constraints: confidential data, uneven adoption, messy files, cost, latency, and people who need the tool to fit into their day. The pattern is turning model capability into something usable, inspectable, and safe enough for actual work.',
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
      'These are large public-sector systems where the hard part is making policy, agency needs, delivery constraints, and user outcomes meet in one working service. The public artifact is only part of the story; much of the work sits in coordination, tradeoffs, and keeping the platform usable at scale.',
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
      'These projects begin with scattered information: events across the web, skills taxonomies, survey responses, market signals. The work is to clean, structure, and present the material so a person can see what matters without wading through everything first.',
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
      'This is work around everyday business operations: quoting, tracking, deployment, reporting, concierge flows, procurement, and audit. The value is not a dramatic new interface; it is removing enough friction that the work becomes easier to run and easier to trust.',
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
      'These are smaller builds that started from my own friction or curiosity: food decisions, hardware experiments, games, utilities, and small apps. They are deliberately close to the problem: notice the repeated irritation, build around it, and keep enough personality in the result.',
    angle: 342,
    projects: ['faveats', 'alastair', 'smart-mirror', 'the-resistance', 'timemoo', 'nearly'],
    writing: [],
    journey: [],
  },
]

export const threadById = (id: string) => threads.find((t) => t.id === id)
