---
name: Jin Personal Site
description: A calm personal systems map with evidence trails, writing, and workbench archaeology.
colors:
  paper: "oklch(0.968 0.013 95)"
  paper-raised: "oklch(0.948 0.017 118)"
  sage: "oklch(0.922 0.022 135)"
  sage-deep: "oklch(0.886 0.026 138)"
  hairline: "oklch(0.852 0.02 132)"
  ink: "oklch(0.3 0.022 155)"
  ink-soft: "oklch(0.452 0.021 154)"
  ink-faint: "oklch(0.572 0.019 150)"
  moss: "oklch(0.52 0.087 150)"
  moss-deep: "oklch(0.424 0.078 152)"
  forest: "oklch(0.302 0.038 158)"
  forest-ink: "oklch(0.93 0.016 100)"
  forest-soft: "oklch(0.74 0.03 130)"
  river: "oklch(0.52 0.078 222)"
  river-deep: "oklch(0.438 0.072 224)"
  signal: "oklch(0.7 0.088 122)"
  clay: "oklch(0.582 0.082 52)"
typography:
  display:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.7rem, 1.9rem + 4vw, 4.9rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.018em"
  headline:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.7rem + 2.5vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.018em"
  title:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.72rem, 1.45rem + 1.3vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.018em"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.16em"
rounded:
  sm: "3px"
  md: "6px"
  lg: "10px"
spacing:
  shell-y: "clamp(2.5rem, 6vw, 5rem)"
  shell-x: "clamp(1.25rem, 4vw, 3.5rem)"
  section: "clamp(4rem, 9vw, 7rem)"
  row: "1.35rem 0.5rem"
components:
  nav-link:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    padding: "0 0 2px"
  menu-toggle:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.4rem 0.85rem"
  link:
    textColor: "{colors.river-deep}"
  status-active:
    textColor: "{colors.moss-deep}"
    typography: "{typography.label}"
  row-hover:
    backgroundColor: "{colors.sage}"
  code-block:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.md}"
    padding: "1.1rem 1.25rem"
---

# Design System: Jin Personal Site

## 1. Overview

**Creative North Star: "The Waterside Workshop Map"**

This site should feel like a well-kept workshop near water: calm, structured, useful, and personal. The interface is a map of recurring threads, not a resume page wearing nicer typography. Visitors should sense practical credibility first, then find evidence trails into writing, projects, roles, references, and experiments.

The system uses warm paper, muted living greens, river blues, precise sans-serif type, and mostly flat surfaces. Structure comes from rules, lines, typographic hierarchy, and row-based indexes rather than decorative cards. The craft reference is Braun and Nomos restraint translated into a personal systems map.

It explicitly rejects generic portfolio hero sections, inflated AI and innovation language, corporate resume templates, LinkedIn reformatted into cards, consultant gloss, shallow futurism, neon AI motifs, and decorative hacker styling.

**Key Characteristics:**
- Calm map-first structure with visible evidence trails.
- Committed green identity on warm, never-white paper.
- Dense but readable indexes, especially for Workbench and Writing.
- Quiet interaction: line drawing, reveal, routing, hover emphasis.
- Maker signal through structure and project archaeology, not tech decoration.

## 2. Colors

The palette is committed muted green on warm paper, with river blue for linkable trails and clay only as a restrained human note.

### Primary
- **Moss Marker**: The identity green for active navigation, selected thread nodes, row emphasis, list markers, focus outlines, and structural lines. It should appear deliberately, not as a decorative wash.
- **Deep Moss**: The stronger active-state green for selected labels, hover titles, and persistent route state.
- **Forest Ink Ground**: A dark green surface reserved for code blocks, skip links, and rare high-contrast utility surfaces.

### Secondary
- **River Trail Blue**: The link and evidence-trail color. Use it where the visitor can follow a path: prose links, trail links, contact values, and external references.
- **Deep River**: The default readable link color on paper.

### Tertiary
- **Soft Signal Green**: A restrained emphasis color for annotations, soft tags, or positive signal when moss would feel too structural.
- **Clay Note**: Occasional warmth for reflective notes, shelf items, experiments, or humane side details. Never let clay become the brand color.

### Neutral
- **Warm Paper**: The primary background. It is never pure white.
- **Raised Paper**: A subtle alternate surface for lifted or grouped regions.
- **Sage Wash**: Quiet hover and selected stacked-index backgrounds.
- **Deep Sage**: Wire, scrollbar, and secondary divider tone.
- **Hairline Green-Gray**: Borders and dividers.
- **Ink Green-Gray**: Primary text. It is never pure black.
- **Soft Ink**: Secondary copy.
- **Faint Ink**: Metadata, labels, dates, and supportive notes.

### Named Rules

**The Committed Green Rule.** Moss and sage carry the identity; do not replace them with generic blue, purple, or grayscale portfolio defaults.

**The Evidence Trail Rule.** River blue means followable path. Do not use it for passive decoration.

**The No Pure Extremes Rule.** Pure white and pure black are forbidden. Every neutral is tinted toward the green-paper world.

## 3. Typography

**Display Font:** Hanken Grotesk (with ui-sans-serif, system-ui, sans-serif fallback)  
**Body Font:** Hanken Grotesk (with ui-sans-serif, system-ui, sans-serif fallback)  
**Label/Mono Font:** Hanken Grotesk for labels; ui-monospace only for actual code.

**Character:** The typography is practical, humane, and precise. Hanken Grotesk carries both interface and long-form reading so the site feels authored but not magazine-styled; Source Serif 4 appears only for reflective human notes.

### Hierarchy
- **Display** (700, `clamp(2.7rem, 1.9rem + 4vw, 4.9rem)`, 1.1): Large page headlines and rare first-viewport statements.
- **Headline** (700, `clamp(2.2rem, 1.7rem + 2.5vw, 3.4rem)`, 1.1): Major section ideas such as the map introduction.
- **Title** (700, `clamp(1.72rem, 1.45rem + 1.3vw, 2.4rem)`, 1.1): Trail heads, group titles, and article section heads.
- **Body** (400, `1.02rem`, 1.62): Default interface copy and readable content. Long-form prose can rise slightly and should stay around 65-75ch.
- **Label** (600, `0.78rem`, `0.16em`, uppercase): Eyebrows and metadata. Use sparingly; labels are not a substitute for structure.

### Named Rules

**The Sans-Led Rule.** Do not use a display serif to make the site feel premium. The brand should feel precise and humane, not over-editorial.

**The Real Mono Rule.** Monospace is allowed only for code or terminal affordances. It is not shorthand for technical credibility.

## 4. Elevation

This system is flat by default. Depth is conveyed through tonal paper shifts, hairline dividers, row rhythm, and active line weight. A single soft lift shadow exists for hover or raised elements, but most surfaces should remain physically quiet.

### Shadow Vocabulary
- **Lift Shadow** (`0 1px 2px oklch(0.302 0.038 158 / 0.05), 0 8px 26px oklch(0.302 0.038 158 / 0.07)`): Use only for a genuinely raised surface or interactive emphasis that needs physical separation.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. If the design needs hierarchy, use spacing, typography, dividers, or tonal paper before adding shadow.

**The No Glass Rule.** Decorative blur, translucent glass cards, and frosted panels are prohibited.

## 5. Components

### Buttons

- **Shape:** Small, precise corners (6px for menu and utility buttons; circular dots only for map nodes and status indicators).
- **Primary:** There is no loud marketing CTA button in the current system. Actions are usually text links, route links, row links, or map nodes.
- **Hover / Focus:** Hover changes color or background quietly; focus uses a 2px moss outline with 3px offset.
- **Secondary / Ghost / Tertiary:** Ghost controls are plain paper with a hairline border, compact padding, and inherited type.

### Chips

- **Style:** Status chips are text plus a small dot, never color alone.
- **State:** Active and experiment statuses use moss or clay; archived and discontinued statuses use faint ink with a hollow dot.

### Cards / Containers

- **Corner Style:** Avoid cards as the default. If a framed container is necessary, keep corners tight (6px or 10px).
- **Background:** Use warm paper at rest and sage wash for selected or hover states.
- **Shadow Strategy:** Follow the Flat-By-Default Rule. The lift shadow is rare.
- **Border:** Prefer 1px hairlines and row dividers; group headings may use a stronger 2px ink rule.
- **Internal Padding:** Rows use compact vertical rhythm (`1.35rem 0.5rem`), while shell gutters use fluid clamps.

### Inputs / Fields

- **Style:** No standalone form field system is present yet. New fields should use paper backgrounds, hairline borders, 6px corners, and Hanken Grotesk body text.
- **Focus:** Use the global moss focus outline.
- **Error / Disabled:** Error states should add explicit text and a non-color cue. Do not rely on red-only signaling.

### Navigation

- **Style:** Sticky paper header with a hairline bottom border. The wordmark is heavy and compact, with a moss dot as the identity mark.
- **Default / Hover / Active:** Links default to soft ink, hover to ink, and active state to deep moss with a moss underline.
- **Mobile:** The menu button opens a stacked nav with full-width row links and hairline separators.

### Constellation Map

The map is the signature component. On wide screens it uses a central identity node, quiet sage wires, moss active wires, and absolute-positioned thread buttons. On narrow screens it becomes a stacked index so the same information remains accessible without relying on spatial layout or animation.

### Workbench Rows

Workbench lists are rows, not cards. Each row carries project name, intent, status, and year in a compact grid. Hover uses sage wash and deep moss on the project title.

### Long-Form Prose

Markdown articles use generous line height, 65-75ch measure, hairline-separated sections, moss list markers, river links, forest code blocks, and Source Serif 4 only for reflective blockquotes or notes.

## 6. Do's and Don'ts

### Do:

- **Do** lead with plain credibility and let the evidence trails carry depth.
- **Do** keep the site structured like a thoughtful map of Jin's work, learning, writing, and influences.
- **Do** use moss for active structure and river for followable links.
- **Do** preserve readable long-form writing with a 65-75ch measure.
- **Do** show maker signal through Workbench archaeology, GitHub references, experiments, and concrete project context.
- **Do** keep all status and category cues readable without color.
- **Do** respect reduced-motion users; animation may reveal structure but must never contain the only copy of information.

### Don't:

- **Don't** build generic portfolio hero sections.
- **Don't** turn the site into LinkedIn reformatted into cards.
- **Don't** use inflated AI or innovation language.
- **Don't** use corporate resume templates, consultant gloss, or shallow futurism.
- **Don't** use neon AI motifs, decorative hacker aesthetics, or decorative tech motifs that do not reveal how Jin thinks or works.
- **Don't** create repeated identical card grids that treat every project as the same kind of object.
- **Don't** use pure white, pure black, gradient text, glassmorphism, or side-stripe borders greater than 1px.
