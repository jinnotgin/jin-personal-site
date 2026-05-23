# Jin Personal Site

This repository contains the source for Jin's personal site: a Vue-powered,
statically generated portfolio and writing archive about applied innovation,
AI adoption, product systems, and the human work around technology change.

The 2026 revision turns the site into a living public archive: part profile,
part project record, part writing system, and part working memory for ideas that
are still developing.

The README is written for people browsing the public repository and for future
maintainers. It focuses on intent, workflow, and project-specific choices rather
than repeating details that can be discovered from the codebase.

## AI Use

This project is also a practical way to try AI-assisted development on a static
site, from content and design to implementation.

The current workflow acknowledges use of tools including:

- Codex
- Claude Code
- The [Impeccable](https://impeccable.style) skill for interface critique and
  frontend design refinement

The repository includes AI-facing product and design context so agents have a
clearer brief before changing the site. [PRODUCT.md](PRODUCT.md) captures the
audience, brand register, purpose, tone, anti-references, and strategic
principles. [DESIGN.md](DESIGN.md) records the visual system: palette,
typography, spacing, components, and the "waterside workshop map" direction for
the 2026 revision. [DESIGN_BRIEF.md](DESIGN_BRIEF.md) and
[BRAND_TOOLKIT.md](BRAND_TOOLKIT.md) provide additional design rationale and
brand guidance, including the
[brand toolkit reference sheet](docs/design-references/brand-toolkit-reference-sheet.png).

These documents are active workflow inputs. They give AI coding agents shared
context for critique, implementation, and refinement, so design and product
decisions are less likely to drift into generic portfolio or AI-product
patterns.

Human review remains part of the process, especially for content voice, factual
claims, visual taste, and what should or should not be published.

## How The Site Works

The site is a Vue 3 application built with Vite and exported as a static site
with `vite-ssg`. Most content is static and file-driven: Markdown carries the
long-form writing and project records, while small TypeScript data modules carry
site-level facts and curated collections.

The important project convention is that the Markdown frontmatter is the source
of public identity. Folder names help keep the archive organized, but published
writing and project URLs come from each file's `slug`.

The build currently pre-renders the top-level site sections. Markdown-backed
detail pages are routed by Vue and hydrated from the bundled content modules.

## Content Process

Most site updates should start with content. The site is meant to keep evolving
as new work, essays, prototypes, references, and reflections are added over
time.

For a writing update, add or edit
`src/content/writing/{year}/{date}-{slug}/index.md`, place any supporting
images next to that file, reference them with relative Markdown paths such as
`./cover.jpg`, and confirm the article appears in the writing index and
generated post route. Public URLs still come from the frontmatter `slug`, not
from the dated folder name.

For a project update, add or edit `src/content/projects/{slug}/index.md`, place
any project assets next to that file, and reference frontmatter images with
relative paths such as `./screenshot.png`.
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

Start the local Vite dev server with:

```sh
npm run dev
```

The dev server is configured in `vite.config.ts` to use
`http://localhost:5465` with `strictPort` enabled.

The main checks during development are the static build, focused tests, and lint
pass:

```sh
npm run build
npm run test:unit
npm run lint
```

`npm run build` runs TypeScript checks and the static-site build. This is the
most important pre-publish check because it verifies both Vue compilation and
the static export.

Vitest has focused coverage for Markdown rendering, content asset resolution,
SEO metadata, and deployment-skew recovery. Playwright is configured for future
end-to-end coverage once more browser behavior deserves automated checks.

## Repository Status

This is a personal-site repository. The code is public so the structure, writing
process, and implementation decisions can be inspected. The content, images,
biography, and project materials are specific to Jin.
