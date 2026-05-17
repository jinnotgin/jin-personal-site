---
name: content-import
description: >
  Use this skill whenever the user wants to turn raw material — notes, drafts,
  links, exported docs — into a finished writing post or project entry for the
  jin-personal-site repo. Triggers on requests like "add this to my site",
  "turn this folder into a post", "create a project entry for X", "import this
  draft", or any time the user points at a folder or file and wants it published
  as content. The skill handles frontmatter, slug generation, thread tagging,
  and file placement so nothing gets missed.
---

# Content Import

You are helping add new content to Jin's personal site. Content lives as Markdown
files with YAML frontmatter in one of two directories:

- **Writing posts** → `src/content/writing/{slug}.md`
- **Projects** → `src/content/projects/{slug}.md`

The repo root is `/Users/ufinity/Documents/GitHub/jin-personal-site`.

---

## Step 1 — Read the source material

The user will give you a folder path (or individual files). Read everything in it:
notes, drafts, links, exported text, image filenames, whatever is there. Build a
mental picture of the subject, the key points, and any existing structure.

If the folder doesn't exist or is empty, tell the user and stop.

---

## Step 2 — Clarify content type and thread(s)

Ask the user two things (you can ask both at once):

1. **Type**: Is this a **writing post** (an essay, reflection, or article) or a
   **project** (a built thing — tool, product, system)?

2. **Thread(s)**: Which of the five threads does it belong to?
   - `applied-ai` — AI tools and workflows, real constraints, agentic coding
   - `signals` — Sensemaking, research, surfacing patterns from messy data
   - `public-platforms` — Large public-sector or civic systems
   - `human` — Commercial and enterprise workflows
   - `homegrown` — Personal builds, side projects, experiments

   Both writing posts and projects can belong to **multiple threads**.

If the answer is obvious from the source material, make a suggestion — don't ask
for things you already know.

---

## Step 3 — Draft the content

### For a WRITING POST

Frontmatter template:
```yaml
---
slug: {slug}
title: {title}
date: {today in YYYY-MM-DD}
excerpt: {1–2 sentence hook — what the reader will take away}
tags: [{descriptive tags}, {thread-id(s)}]
status: published
category: {category}
source: {URL if the content originated elsewhere, e.g. a LinkedIn article}
---
```

**Slug**: kebab-case from the title, concise (drop filler words like "the", "a").

**Tags**: Start with 3–6 descriptive tags that reflect the actual subject
(e.g. `ai`, `llm`, `product`, `engineering`). Then append the thread ID(s)
as the last tags. The thread IDs in the tags are what wire the post to threads
on the homepage — getting these right matters.

**Category**: Use an existing category if appropriate. Current categories are:
`AI in practice`. Use `Notes` as the fallback for anything that doesn't fit.

**Source**: Include only if the content was originally published elsewhere (e.g.
a LinkedIn post). Omit the field entirely if it's original to this site.

**Body**: Write the full post body in Markdown, starting right after the closing
`---`. Preserve the author's voice from the source material. Use the source
content as the substance — don't invent claims or details that aren't there, but
do restructure, sharpen, and fill in transitions where the raw notes are
fragmentary.

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
intent: {one sentence — what it is and why it exists}
stack: [{technology, approach, or domain tags}]
links: [{Label::https://url}, ...]
images: [/img/projects/{slug}.png::{descriptive alt text}]
---
```

**Slug**: Short, lowercase, hyphenated. Usually the project name.

**Intent**: Should be a crisp single sentence that answers "what is this and why
did it exist?" — not a marketing line, but a plain factual statement.

**Stack**: List the meaningful technical or domain elements. Not a full dep list —
just what's distinctive (e.g. `[RAG, LLMs, multimodal files, data residency]`).

**Links**: Use `label::URL` format. Omit the field entirely if there are no
public links.

**Images**: Use `/img/projects/{slug}.png::{alt text}` format. If no images are
available yet, omit the field and note it to the user.

**Body**: The body starts with a `## Why it existed` section, then covers what
was built, what was hard, and what it proved. Keep it factual and concrete —
this is a case study, not a pitch. Use the source material as the basis.

---

## Step 4 — Write the file

Write the completed Markdown file to:
- Writing: `src/content/writing/{slug}.md`
- Project: `src/content/projects/{slug}.md`

Then show the user the frontmatter (not the full body, unless they ask) and
confirm it looks right.

---

## Step 5 — Remind about images

If the project or post references images (or should have a cover image):

- Writing post cover images go in `/public/img/writing/{slug}/cover.jpg`
- Project images go in `/public/img/projects/{slug}.png` (or `.jpg`)

Remind the user to drop their images there if they haven't already, and note
the exact path(s) the frontmatter expects.

---

## Tone and quality bar

The content on this site is direct and considered — no hype, no filler. When
drafting from raw notes, keep the voice grounded. Favour short paragraphs and
concrete sentences over broad claims. If the source material is thin for a full
post, say so and ask whether to fill it out or keep it short.
