# Jin Personal Site

This is the source for Jin's personal site: a public archive of writing, projects, experiments, and working ideas around emerging trends and technology, including AI, and how they affect people, organisations, and the systems they work in.

The 2026 revision is not only a portfolio site. It is also a small publishing system and a memory structure for work that is still evolving.

## Notes For AI Agents

Use this README for context that is hard to infer from file inspection alone. For framework details, scripts, dependencies, routes, and component structure, read the source files directly.

This project is developed with AI assistance, including Codex, Claude Code, and the [Impeccable](https://impeccable.style) skill for interface critique and frontend refinement. Human review remains important for content voice, factual claims, visual taste, privacy, and whether something should be published at all.

When working as an agent, prefer the repo's existing content model and design documents over generic web defaults. Start with the source material, preserve the author's wording where content is being imported, and keep unrelated refactors out of content changes.

## Editorial Shape

Older projects and essays belong to the archive, even when they no longer represent current priorities exactly.

The site should feel editorial, personal, and deliberate. Avoid turning it into a generic portfolio, SaaS landing page, or AI tooling showcase unless the source material genuinely calls for that tone.

Before changing product framing, visual direction, or content voice, check the context documents:

- [PRODUCT.md](PRODUCT.md) for audience, purpose, tone, and strategic principles
- [DESIGN.md](DESIGN.md) for the current visual system and interaction direction
- [DESIGN_BRIEF.md](DESIGN_BRIEF.md), [BRAND_TOOLKIT.md](BRAND_TOOLKIT.md), and the [brand toolkit reference sheet](docs/design-references/brand-toolkit-reference-sheet.png) for supporting design rationale and brand guidance

These files are active workflow inputs for both humans and coding agents.

## Content Conventions

Most meaningful updates begin as content, not component work.

Writing posts live at:

```txt
src/content/writing/{year}/{date}-{slug}/index.md
```

Projects live at:

```txt
src/content/projects/{slug}/index.md
```

Folder names keep the archive organized, but public identity comes from frontmatter. In particular, published writing and project URLs use each file's frontmatter `slug`, not the folder name.

Place supporting images next to the relevant `index.md` and reference them with relative paths such as `./cover.jpg` or `./screenshot.png`.

For profile, navigation, and site-level facts, start with `src/data/site.ts`. Only change Vue components when the content model cannot express the intended result.

For SSG route hydration and lazy content loading, see [docs/ssg-hydration.md](docs/ssg-hydration.md).

## Markdown Images

Writing images should stay simple in source Markdown:

```md
![Descriptive alt text](./cover.jpg)
![Descriptive alt text](./inline-1.png "Optional visible caption")
```

The optional Markdown title field is treated as a visible caption. Use it when the source material has a real caption or when the image needs one to be understood. Omit it for cover images or purely illustrative images that do not need caption text.

Local `jpg`, `jpeg`, and `png` images under `src/content` are optimized during the normal dev, test, and build flows. The generated files are derived build input and are intentionally ignored by git.

### Two-Column Images

Use the custom `:::cols` directive when exactly two Markdown images should sit beside each other on wider screens:

```md
:::cols
![First image alt](./first.png "Optional caption")

![Second image alt](./second.png "Optional caption")
:::
```

Treat `:::cols` as a two-column directive. On smaller screens, the images stack. For three or more related images, use separate `:::cols` pairs or keep the images in the normal article flow.
