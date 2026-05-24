---
name: content-import
description: Use this skill whenever the user wants to import existing content — exported docs, LinkedIn articles, notes, drafts — into the jin-personal-site repo as a writing post or project entry. Triggers on requests like "import this into my site", "add this to my site", "convert this to a post", "create a project entry for X", or any time the user points at a folder or file and wants it published as content. The skill handles format conversion to Markdown, frontmatter generation, thread tagging, and file placement — without touching the original writing.
---

# Content Import

You are helping import existing content into Jin's personal site. Content lives as Markdown files with YAML frontmatter in one of two folder shapes:

- **Writing posts** → `src/content/writing/{year}/{date}-{slug}/index.md`
- **Projects** → `src/content/projects/{slug}/index.md`

The repo root is `/Users/ufinity/Documents/GitHub/jin-personal-site`.

**The goal is faithful conversion, not editing.** Preserve the source text exactly — wording, structure, tone, sentence length, everything. Your job is to produce correct Markdown and frontmatter, not to improve the writing.

---

## Step 1 — Read the source material

The user will give you a folder path (or individual files). Read everything in it: exported docs, raw text, HTML, links, image filenames, whatever is there.

If the folder doesn't exist or is empty, tell the user and stop.

---

## Step 2 — Clarify content type and thread(s)

Ask the user two things (you can ask both at once):

1. **Type**: Is this a **writing post** (an essay, article, reflection) or a **project** (a built thing — tool, product, system)?

2. **Thread(s)**: Which of the five threads does it belong to?
   - `applied-ai` — AI tools and workflows, real constraints, agentic coding
   - `signals` — Sensemaking, research, surfacing patterns from messy data
   - `public-platforms` — Large public-sector or civic systems
   - `human` — Commercial and enterprise workflows
   - `homegrown` — Personal builds, side projects, experiments

   Both writing posts and projects can belong to **multiple threads**.

If the answer is obvious from the source material, make a suggestion — don't ask for things you already know.

---

## Step 3 — Convert and assemble the file

### For a WRITING POST

Frontmatter template:

```yaml
---
slug: { slug }
title: { title — taken verbatim from source }
date: { publication date from source, or today in YYYY-MM-DD if unknown }
excerpt: { 1–2 sentence excerpt — taken verbatim from source if possible }
tags: [{ descriptive tags }, { thread-id(s) }]
status: published
category: { category }
source: { URL if originally published elsewhere, e.g. a LinkedIn article }
---
```

**Slug**: kebab-case from the title, concise (drop filler words like "the", "a").

**Title**: Use the title exactly as it appears in the source. Don't rephrase it.

**Excerpt**: Pull directly from the source — an opening line, standfirst, or summary that was already written. Only write one yourself if there is genuinely nothing to pull from.

**Tags**: 3–6 descriptive tags reflecting the subject (e.g. `ai`, `llm`, `product`, `engineering`), then the thread ID(s) appended at the end. The thread IDs are what wire the post to homepage threads — don't skip them.

**Category**: Use an existing category if appropriate. Current categories: `AI in practice`. Use `Notes` as the fallback.

**Source**: Include if originally published elsewhere (LinkedIn, a blog, etc.). Omit the field entirely if it's original to this site.

**Body**: Convert the source content to clean Markdown. Preserve the text verbatim — same words, same structure, same paragraph breaks. Convert formatting (bold, italics, headings, lists, blockquotes) to their Markdown equivalents. Do not rewrite, restructure, condense, or add anything.

Handle embedded media as follows:

- **Images in writing posts**: colocate local image files beside the post `index.md` and use standard Markdown image syntax with relative paths.
  - The optional Markdown title field is rendered as a visible caption: `![alt text](./image.png "Caption text")`.
  - Images with title captions appear wider than the text column and show the caption below the image. Images without title captions use the simpler image treatment.
  - Use descriptive alt text for the image itself.
  - If the source has a caption, preserve the caption text in the quoted title field exactly, except for Markdown escaping needed to keep the syntax valid.
  - If the source has no caption, omit the title field: `![alt text](./image.png)`.
  - Cover images usually omit captions. Inline explanatory screenshots and illustrations usually include captions when the source provides one.
  - Use straight double quotes around Markdown title captions unless the source text forces escaping.
  - If the image is inside a comparison table, keep the existing table pattern and do not invent captions unless the source clearly supplies them.
  - When the source clearly presents exactly two images as a side-by-side comparison or paired visual sequence, wrap the normal Markdown image entries in the custom two-column directive:
    ```md
    :::cols
    ![First image alt](./first.png "Optional caption")

    ![Second image alt](./second.png "Optional caption")
    :::
    ```
    The site renders this as two side-by-side columns on desktop and stacked images on small screens. Do not use it for unrelated images, ordinary single-image flow, or groups of three or more images.
  - If the image is a local file in the source folder, copy it into the same folder as `index.md` and use a relative `./filename.ext` path. If it's a remote URL, keep the URL for now and flag it to the user so they can decide whether to host it locally.
- **URLs / hyperlinks**: preserve all links exactly as `[text](url)`. Do not remove or shorten them.
- **Videos**: YouTube (and similar) can be embedded directly using an iframe in the Markdown body:
  ```html
  <iframe
  	src="https://www.youtube-nocookie.com/embed/{VIDEO_ID}"
  	title="{title}"
  	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  	allowfullscreen
  ></iframe>
  ```
  Extract the video ID from the URL (e.g. `watch?v=ABC123` → `ABC123`) and use the `youtube-nocookie.com/embed/` form. For non-YouTube videos that can't be iframed, fall back to a plain link and flag it to the user.

---

### For a PROJECT

Frontmatter template:

```yaml
---
slug: {slug}
name: {display name}
thread: [{thread-id}, ...]
year: {e.g. 2024 or 2023–now}
status: {active or archived}
intent: {one sentence — taken from source if possible}
stack: [{technology, approach, or domain tags}]
links: [{Label::https://url}, ...]
images: [./{image-filename}.png::{descriptive alt text}]
---
```

**Slug**: Short, lowercase, hyphenated. Usually the project name.

**Intent**: Pull from the source if there's a one-line description. Only write one if there's nothing suitable.

**Stack**: The meaningful technical or domain elements from the source.

**Links**: `label::URL` format. Omit if no public links.

**Images**: `./{image-filename}.png::{alt text}` format, with the image file colocated beside the project `index.md`. Omit if no images and note it to the user. Project image metadata does not use Markdown title captions; put only a descriptive alt text after `::`.

**Body**: Convert the source content to clean Markdown, preserving the text verbatim. Same words, same structure. Convert formatting to Markdown equivalents. Apply the same media handling rules as for writing posts (images, links, videos).

---

## Step 4 — Write the file

Write the completed Markdown file to:

- Writing: `src/content/writing/{year}/{date}-{slug}/index.md`
- Project: `src/content/projects/{slug}/index.md`

Show the user the frontmatter (not the full body, unless they ask) and confirm it looks right before finishing.

---

## Step 5 — Remind about images

If the post or project references images:

- Writing post images go beside the writing `index.md`
- Project images go beside the project `index.md`

Note the exact paths the frontmatter expects so the user knows where to drop the files.
