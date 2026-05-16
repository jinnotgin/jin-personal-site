# Design Brief

## Summary

Build Jin's personal website as a personal systems map with evidence trails: a calm, credible, slightly novel portfolio and writing home that shows how his work, projects, ideas, and influences connect.

The site should not open like a resume or trophy case. It should open like: here are the threads Jin keeps returning to, and here are the receipts if a visitor wants to go deeper.

## Primary Audience

The site is for recruiters, future collaborators, people considering working with Jin, and people who look him up to understand his credibility, judgment, and point of view.

## Identity And Positioning

- Public identity: Jin.
- Formal identity: Lin Jin, only where formal credentials require it.
- Positioning: applied innovation, digital systems, human systems, GenAI in practice, and maker-led learning.
- One-line role: Applied innovation | Shaping digital and human systems.
- Tone: practical, systems-minded, humane, curious, and quietly playful.

## Design Direction

Use a committed green palette with tinted neutrals. Green should feel calm, living, reflective, and systems-oriented, not neon startup green or generic sustainability.

The mood should draw from Braun and Nomos: functional form, precise hierarchy, restrained confidence. Use PostHog's redesign only as permission for an authored world with novel navigation and personality. Do not borrow its maximalism, brand chaos, or heavy illustrative density.

The site should feel like a well-kept workshop near water: structured, serene, useful, and personal.

## Anti-References

Avoid generic portfolio hero sections, LinkedIn reformatted into cards, overblown AI branding, consultant gloss, decorative hacker aesthetics, and project grids that treat every item as the same kind of object.

## Information Architecture

- Now: current focus, applied innovation, PromptPal, AI adoption, organisational learning.
- Workbench: projects and written case studies, grouped by intent.
- Writing: Markdown posts with list and detail routes.
- Journey: career timeline and older context.
- Shelf: books, people, references, places, and ideas shaping Jin's thinking.
- Contact: simple routes to email, LinkedIn, and GitHub.

## Homepage Model

The homepage should be an interactive but calm systems map of recurring threads:

- Applied AI in practice: PromptPal, PromptPal Transcribe, Bifrost Claude caching plugin, RAG, agents, voice-model experiments, AI-assisted research, and prototyping work.
- Public platforms: SkillsFuture Mid-Career Training Allowance, Student Learning Space, policy-to-product translation, public service delivery, and platform architecture.
- Sensemaking tools: Skills Framework Explorer, Now In Singapore, CoinGossip, analytics, scraping, categorisation, trend detection, and social sentiment.
- Commercial workflows: Relatus, JT Concierge, KPMG audit tooling, BMW Vantage, MINDEF purchase-order tracking, NCS deployment automation, and enterprise operational tools.
- Personal builds: FavEats, Alastair, Smart Mirror, The Resistance, Nearly, TimeMoo, DIY work, and self-initiated utility projects.

Each thread should lead to writing, work history, project entries, or external links. Metrics and credentials should appear inside relevant trails, not as a loud top-level proof strip.

## Writing

Version 1 should include real Markdown infrastructure:

- `/writing`
- `/writing/:slug`
- Frontmatter fields: `title`, `date`, `excerpt`, `tags`, `status`
- Initial categories: AI in practice, product systems, human systems, learning notes, maker notes

Writing detail pages should be highly readable, quiet, and blog-first. The reference is closer to Simon Willison's usefulness than portfolio-blog polish.

## Workbench

Use Workbench rather than Projects because it better fits the maker, research, prototype, and archive pattern.

Project entries should support:

- Short intent statement
- Why it existed
- What system or friction it responded to
- What was built
- Status: active, archived
- Links to live site, GitHub, or source material when available
- Optional image from old portfolio assets

Seed project groups from the old portfolio and GitHub:

- Now In Singapore
- FavEats
- CoinGossip
- Smart Mirror
- The Resistance
- Alastair
- Nearly
- Relatus
- TimeMoo
- JT Concierge
- Bifrost Claude default caching plugin
- TestForge
- Pete

## Interaction Model

The main interaction should be a systems map, not a gimmick. Hovering or tapping a thread should reveal connected projects, posts, jobs, or influences. On mobile, the same information should become a clear stacked index.

Reduced motion should show the same content without animated dependency.

## Content Strategy

Lead with plain credibility, then let people follow evidence trails:

- State Jin's current focus directly.
- Show the terrain he has worked in.
- Let project and writing pages carry details, metrics, and context.
- Preserve old project archaeology where it reveals a recurring pattern of noticing friction and building systems around it.

The homepage should say less than a resume but connect to more than a resume.

## Visual And Layout Notes

- Use strong typography with readable long-form line length.
- Avoid repeated identical card grids.
- Let sections have different rhythms: index-like for navigation, spacious for reflection, denser where discovery benefits.
- Use images or screenshots where they reveal real work. Avoid generic stock tech imagery.
- Keep navigation conventional enough for recruiters while making the site structure feel authored.

## Reference Mockups

Generated reference mockups are stored in `docs/design-references/`.

- `homepage-directions-contact-sheet.png`: four homepage direction probes for the systems-map concept.
- `content-and-workbench-contact-sheet.png`: mobile homepage, writing index, Markdown article, and Workbench detail probes.
- `brand-toolkit-reference-sheet.png`: palette, type, layout, interaction, voice, and do/don't board.

Use these as directional references, not literal specs. Preserve the calm systems-map intent, committed green palette, readable hierarchy, and Workbench/Writing content model. Do not copy generated artifacts blindly if they conflict with accessibility, responsiveness, or real content.

## Accessibility

Target WCAG AA. Prioritize readable typography, strong contrast, keyboard navigation, reduced-motion support, and content that remains coherent without animation. Do not rely on color alone to communicate categories or status.

## Implementation References

Use these impeccable references when moving into implementation:

- `craft.md` for implementation flow
- `brand.md` for anti-generic portfolio checks
- `typeset.md` for Markdown and blog readability
- `layout.md` for the systems map and section rhythm
- `adapt.md` for responsive behavior
- `delight.md` only for the systems-map interaction
