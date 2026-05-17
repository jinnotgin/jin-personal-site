import type { ShelfItem } from './types'

/**
 * Books, people, places, and ideas shaping Jin's thinking.
 * The Shelf is the most personal surface; keep notes specific and honest.
 */
export const shelf: ShelfItem[] = [
  {
    kind: 'book',
    title: 'Deep Human',
    by: 'Crystal Lim-Lange and Greg Lim-Lange',
    href: 'https://www.goodreads.com/en/book/show/52455951-deep-human',
    note: 'I found this while navigating the early LLM wave in 2022. It reminded me there are other parts of being human besides just using my brain.',
  },
  {
    kind: 'book',
    title: 'Nonviolent Communication',
    by: 'Marshall B. Rosenberg',
    href: 'https://www.goodreads.com/book/show/71730.Nonviolent_Communication',
    note: 'Opened my eyes to how often we miscommunicate with each other, and how much changes when we learn to empathise properly.',
  },
  {
    kind: 'book',
    title: 'Good Strategy Bad Strategy',
    by: 'Richard Rumelt',
    href: 'https://www.goodreads.com/book/show/11721966-good-strategy-bad-strategy',
    note: 'Helped demystify the big word "strategy", and gave me a clearer way to separate strategy from tactics.',
  },
  {
    kind: 'book',
    title: 'The Phoenix Project',
    by: 'Gene Kim, Kevin Behr, and George Spafford',
    href: 'https://www.goodreads.com/en/book/show/17255186-the-phoenix-project',
    note: 'A fun story that revealed a lot of the pitfalls and patterns that still show up in software development today.',
  },
  {
    kind: 'book',
    title: 'Rich by Retirement',
    by: 'Joshua Giersch',
    href: 'https://www.goodreads.com/book/show/31454071-rich-by-retirement',
    note: 'My introduction to the difference between investing and gambling, and the importance of boring investing.',
  },
  {
    kind: 'person',
    title: 'Alok Kanojia',
    by: 'HealthyGamerGG',
    href: 'https://www.youtube.com/@HealthyGamerGG',
    note: 'Helped me a lot during periods of stress, and opened my eyes to meditation and better self-understanding.',
  },
  {
    kind: 'person',
    title: 'Sam Harris',
    by: 'Waking Up',
    href: 'https://www.wakingup.com/',
    note: 'Deepened my journey into meditation, self-awareness, and understanding how the mind works.',
  },
  {
    kind: 'person',
    title: 'Simon Willison',
    href: 'https://simonwillison.net/',
    note: 'One of the people who inspired me to write more. Also one of my favourite people to read for understanding AI.',
  },
  {
    kind: 'idea',
    title: 'Cynefin Framework',
    href: 'https://thecynefin.co/about-us/about-cynefin-framework/',
    note: 'Useful when I need to ask whether a problem is obvious, complicated, complex, or chaotic before choosing how to act.',
  },
  {
    kind: 'idea',
    title: "Kegan's Subject Object Shift",
    href: 'https://aliveandthriving.substack.com/p/kegans-theory-of-development-framework',
    note: 'A frame I keep returning to for noticing the assumptions I am inside of, not just the thoughts I am having.',
  },
  {
    kind: 'idea',
    title: 'Five Types of Conversation',
    href: 'https://www.thnk.org/blog/leader-essential-conversations-part-1',
    note: 'A reminder to notice what kind of conversation I am actually in before trying to move it forward.',
  },
]
