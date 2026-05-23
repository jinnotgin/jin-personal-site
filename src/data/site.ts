export const site = {
	name: 'Jin',
	formalName: 'Lin Jin',
	url: import.meta.env.VITE_SITE_URL ?? 'https://itsjin.com',
	role: 'Applied innovation, shaping digital and human systems',
	description:
		"Jin's personal systems map with evidence trails: applied innovation, GenAI in practice, product and platform work, and the human systems that keep teams healthy.",
	previewDescription:
		'A personal systems map: the threads Jin keeps returning to, and the work, writing, and roles behind each.',
	previewImage: '/img/og-card.svg',
	/** Plain-credibility paragraph. Replace with Jin's own words. */
	positioning:
		'I work between emerging technology, organisational change, and the human systems underneath both. The work is turning ambiguous possibilities into practice teams can actually keep: applied AI, product and platform systems, and the facilitation that makes the change stick.',
	/** Current focus, surfaced on the homepage as "Now". Keep it short and true. */
	now: [
		'Putting GenAI into real workflows: PromptPal context, retrieval, and small agents that earn their keep.',
		'Helping organisations adopt AI without losing judgement, dignity, or institutional memory.',
		'Maker work in the open: Skills Framework Explorer, Now In Singapore, and prototypes that test an idea cheaply.',
	],
	nowUpdated: 'May 2026',
	contact: {
		email: 'hey@itsjin.com',
		links: [
			{ label: 'Email', href: 'mailto:hey@itsjin.com' },
			{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/jin-sg/' },
			{ label: 'GitHub', href: 'https://github.com/jinnotgin' },
		],
	},
}

export const nav = [
	{ to: '/', label: 'About' },
	{ to: '/writing', label: 'Writing' },
	{ to: '/projects', label: 'Projects' },
	{ to: '/journey', label: 'Journey' },
	{ to: '/shelf', label: 'Shelf' },
	{ to: '/contact', label: 'Contact' },
]
