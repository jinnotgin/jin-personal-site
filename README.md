# Jin Personal Site

This repository contains the source for Jin's personal site: a Vue-powered,
statically generated portfolio and writing archive about applied innovation,
AI adoption, product systems, and the human work around technology change.

The 2026 revision turns the site into a living public archive: part profile,
part project record, part writing system, and part working memory for ideas that
are still developing.

The README is written for people browsing the public repository and for future
maintainers. It explains how the site is put together, which files carry the
content, and how the build process turns those files into the published site.

## How The Site Is Built

The site is a Vue 3 application built with Vite and exported as a static site
with `vite-ssg`. Routes are declared once in Vue Router, then expanded at build
time so Markdown-backed writing and project pages are generated as individual
static URLs.

The technical shape is intentionally small:

- Vue 3 provides the component model for page views, layout, and interaction.
- Vite provides the dev server, bundling pipeline, and production build.
- `vite-ssg` turns the Vue app into static HTML for fast hosting and durable
  public URLs.
- Vue Router owns the site map, redirects, page titles, and static route list.
- Markdown files hold long-form writing and project content, with parsing
  handled in `src/lib/`.
- Tailwind CSS 4 is available through the Vite plugin, alongside site-specific
  global CSS in `src/main.css`.
- Pinia is available for shared state if the site needs richer client-side
  behavior, though most content is static and file-driven.
- TypeScript, ESLint, oxlint, and Prettier form the current quality and
  formatting toolchain. Vitest and Playwright are configured for future
  substantive test specs.

The main flow is:

1. Route definitions live in `src/router/routes.ts`.
2. Core profile, navigation, and contact details live in `src/data/site.ts`.
3. Writing entries live as Markdown files in `src/content/writing/`.
4. Project entries live as Markdown files in `src/content/projects/`.
5. Shared data for journey, shelf, threads, and workbench-style content lives
   in `src/data/`.
6. Vue views in `src/views/` render each top-level section.
7. `vite.config.ts` discovers Markdown slugs and tells `vite-ssg` which static
   routes to generate.

## Content Process

Most site updates should start with content. The site is meant to keep evolving
as new work, essays, prototypes, references, and reflections are added over
time.

For a writing update, add or edit a Markdown file in `src/content/writing/`,
place any supporting images under the matching `public/img/writing/` folder,
and confirm the article appears in the writing index and generated post route.

For a project update, add or edit a Markdown file in `src/content/projects/`.
Project list behavior and derived project metadata are handled through
`src/lib/projects.ts` and the relevant views.

For profile or navigation changes, update `src/data/site.ts` first. Only change
Vue components when the content model no longer supports the intended page.

For visual or interaction changes, check the design documents before editing
`src/main.css` or page components. The site is meant to feel editorial,
personal, and deliberate.

The archive matters as much as the current profile. Older projects and writing
belong to the record of how the work, interests, and technical practice have
changed.

## Local Checks

The main checks during development are the static build and lint pass:

```sh
npm run build
npm run lint
```

`npm run build` runs TypeScript checks and the static-site build. This is the
most important pre-publish check because it verifies both Vue compilation and
static route generation.

Vitest and Playwright scripts exist in `package.json`. The repository currently
has no meaningful unit or end-to-end test files, leaving room for future
coverage once the site has behavior that deserves automated tests.

## AI-Assisted Development

This site is developed with AI assistance as an explicit part of the working
process. The current workflow acknowledges use of:

- Codex, using GPT 5.5
- Claude Code, using Opus 4.7 and Sonnet 4.6
- The [Impeccable](https://impeccable.style) skill for interface critique and
  frontend design refinement

This repository is also an attempt at practicing AI-driven lifecycle software
development, or AI-DLC: using AI throughout the work across product direction,
information architecture, content editing, interface implementation, design
review, technical trade-offs, and process documentation.

The repository includes AI-facing product and design context so agents have a
clearer brief before changing the site. [PRODUCT.md](PRODUCT.md) captures the
audience, brand register, purpose, tone, anti-references, and strategic
principles. [DESIGN.md](DESIGN.md) records the visual system: palette,
typography, spacing, components, and the "waterside workshop map" direction for
the 2026 revision. [DESIGN_BRIEF.md](DESIGN_BRIEF.md) and
[BRAND_TOOLKIT.md](BRAND_TOOLKIT.md) provide additional design rationale and
brand guidance, including the
[brand toolkit reference sheet](docs/design-references/brand-toolkit-reference-sheet.png).

These documents are active workflow inputs. They give
[Impeccable](https://impeccable.style) and other AI coding agents shared context
for critique, implementation, and refinement, so design decisions are less
likely to drift into generic portfolio or AI-product patterns.

Human review remains part of the process, especially for content voice, factual
claims, visual taste, and what should or should not be published.

## Repository Status

This is a personal-site repository. The code is public so the structure, writing
process, and implementation decisions can be inspected. The content, images,
biography, and project materials are specific to Jin.
