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
      'AI work here starts from real constraints: confidential data, uneven adoption, messy files, cost, latency, and the cognitive and intent debt these tools can create. The pattern is turning model capability into something usable, inspectable, and safe enough for actual work.',
    angle: 270,
    journey: ['applied-innovation-lead'],
  },
  {
    id: 'public-platforms',
    label: 'Public platforms',
    line: 'Policy intent translated into services people depend on.',
    blurb:
      'These are large public-sector systems where the hard part is making policy, agency needs, delivery constraints, and user outcomes meet in one working service. The public artifact is only part of the story; much of the work sits in coordination, tradeoffs, and keeping the platform usable at scale.',
    angle: 198,
    journey: ['training-allowance-system', 'student-learning-space'],
  },
  {
    id: 'signals',
    label: 'Sensemaking tools',
    line: 'Making messy signals easier to inspect and act on.',
    blurb:
      'These projects begin with scattered information: events across the web, skills taxonomies, survey responses, market signals. The work is to clean, structure, and present the material so a person can see what matters without wading through everything first.',
    angle: 126,
    journey: ['forensic-analytics', 'signals-and-research'],
  },
  {
    id: 'human',
    label: 'Commercial workflows',
    line: 'Client and enterprise operations made easier to run.',
    blurb:
      'This is work shaped by commercial needs and operational use cases, where the goal is to make client or enterprise workflows easier to run. The value is not a dramatic new interface; it is removing enough friction that the work becomes easier to manage and easier to trust.',
    angle: 54,
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
    journey: [],
  },
]

export const threadById = (id: string) => threads.find((t) => t.id === id)
