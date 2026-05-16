import type { ShelfItem } from './types'

/**
 * Books, people, places, and ideas shaping Jin's thinking.
 * The Shelf is the most personal surface; keep notes specific and honest.
 * Replace with real influences.
 */
export const shelf: ShelfItem[] = [
  {
    kind: 'book',
    title: 'Thinking in Systems',
    by: 'Donella Meadows',
    note: 'The book the whole site borrows its grammar from. Leverage points over heroics.',
  },
  {
    kind: 'book',
    title: 'The Timeless Way of Building',
    by: 'Christopher Alexander',
    note: 'Why a well-kept workshop feels different from a tidy one. Patterns, not templates.',
  },
  {
    kind: 'book',
    title: 'Seeing Like a State',
    by: 'James C. Scott',
    note: 'A standing warning about legibility imposed from above. I reread it before every "let’s standardise this".',
  },
  {
    kind: 'person',
    title: 'Simon Willison',
    note: 'The bar for writing usefully in public: show the work, link the receipts, no polish tax.',
  },
  {
    kind: 'person',
    title: 'Dieter Rams',
    note: 'Less, but better, taken seriously rather than quoted. The reason this site is quiet.',
  },
  {
    kind: 'idea',
    title: 'Build habits, not features',
    note: 'A feature ships once. A habit compounds. Most of my product writing argues this.',
  },
  {
    kind: 'idea',
    title: 'Dignity in work',
    note: 'Adoption that costs people their judgement or standing is not adoption. It is attrition with a launch date.',
  },
  {
    kind: 'place',
    title: 'Water, near a workshop',
    note: 'Where the thinking actually happens. The site is trying to feel like that, not a dashboard.',
  },
]
