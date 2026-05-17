---
slug: ai-universal-translator-still-amplifies-your-intent
title: AI is a universal translator, but it still amplifies your intent
date: 2026-05-02
excerpt: AI compresses the distance between intent and working software. That makes small tools worth building, but it also makes unclear intent show up faster and louder.
tags: [ai, linkedin, software, product, applied-ai]
status: published
category: AI in practice
source: https://www.linkedin.com/pulse/ai-universal-translator-still-amplifies-your-intent-jin-lin-l9b9c
---
![Illustrated cover about AI translating intent into working software](/img/writing/ai-universal-translator-still-amplifies-your-intent/cover.jpg)

Over the past two weeks, I have been building and updating more software than I used to in months. These were not projects from a dedicated engineering sprint. Rather, these tools were built in the gaps between meetings, reviews, and other responsibilities.

This is not my first time building software with AI. But the pace of these past two weeks has further reinforced my beliefs that AI has started to collapse the layers between recognising a problem and having working software for it, even when you only have fragments of time to give.

It has also made two general principles clearer to me than before: how AI acts as a universal translator between levels of work, and how its an amplifier of whatever intent you bring to it.

## AI is a universal translator

When people hear "translation", they usually think about language: English to Chinese, Korean to German. In software, they might think about code migration: Python to Go, Angular to React, one framework to another. Both are part of it, but the more useful meaning is broader.

A rough idea becomes a prototype. A prototype becomes a real app. A bug report becomes a diagnosis. I have found AI most useful in compressing these transitions, which used to require a lot of manual stitching and often stalled simply because the next step required a different mode of thinking.

One example is [Skills Framework Explorer,](https://job-skills-explorer.web.app/) a tool I started building in 2026 and recently updated. The official SSG Skills Framework dataset exists, but its raw format is hard to use: spread across multiple spreadsheets, with no clean way to search roles, compare them, or inspect skills at different proficiency levels.

![Skills Framework Explorer - Comparing between 2 job roles](/img/writing/ai-universal-translator-still-amplifies-your-intent/inline-1.jpg)

That gap is translation work that I do with AI tools. It starts with a public dataset and a user problem, becomes a data model, then a product flow, then a working tool for both the public and internal staff. AI helped across those layers: understanding the workbook structure, shaping the data model, building the interface, checking edge cases, and turning rough product intent into working software. The value was less in AI writing code and more in how it compressed the movement between idea, spec, prototype, and real app.

## AI amplifies existing intent

Translation still needs direction. AI can write code quickly, explain APIs, suggest structures, generate tests, and point out likely bugs, but it does not know, on its own, what is worth building or where the boundary should sit. Clear intent gives it something useful to work against. Vague intent creates output that has to be untangled later.

I saw this clearly when building a no-server, fully client-side transcription tool based on [NVIDIA Parakeet v3](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3). Managers in my company needed a private way to transcribe client-sensitive discussions, but the tool also had to be widely accessible. That created a hard boundary: browser-only, no cloud servers involved.

![Screenshot of PromptPal Transcribe, with timestamped, speaker-labeled text](/img/writing/ai-universal-translator-still-amplifies-your-intent/inline-2.jpg)

Once that boundary was set, many decisions became easier. Audio handling, model loading, UI states, privacy expectations, and failure cases all had to fit around it. The prompt was never as loose as "build a transcription app". It was closer to a list of specifications provided through multiple prompts, describing a private, browser-only transcription tool for sensitive discussions, using a targeted speech model, and other supporting considerations that ensured no server in the loop.

AI performs much better when intent has shape. It can fill in implementation details, test assumptions, suggest edge cases, and propose cleaner paths. But the direction has to come from the person using it, and so does the choice of how much to define upfront versus how much to discover through iterative prompting.

## Small software becomes worth building

The bigger shift is that more small, specific software now clears the bar for being built. Many useful tools are too specific to become major product bets, but too painful to leave unresolved. They sit as backlog items, manual workarounds, scripts, or repeated explanations. Some of the internal tools from the past two weeks fit this category.

For example, I built a [reusable Atlassian to Firebase Auth bridge](https://github.com/jinnotgin/atlassian-firebase-auth-bridge), so internal company tools could use Atlassian login and still end up with Firebase Authentication sessions. I also built a [Bifrost plugin for an internal LLM gateway](https://github.com/jinnotgin/bifrost-claude-default-caching-plugin), to support Bring-Your-Own-Key (BYOK) setups across different AI coding tools while making sure they could all benefit from automatic prompt caching when routed to Claude-compatible providers.

Before AI-assisted development, these small tools might have been postponed because even if the value was real, the build cost was non-trivial. AI changes that math: not by making every idea worth building, but by making these narrow practical tools feasible when the intent is clear enough.

## The costs move upstream

There is still a cost to this new pace. AI-assisted development creates what I think of as [cognitive debt](/writing/thinking-you-cant-get-back-hidden-cost-ai): the growing gap between code that exists and code you truly understand. I have seen this firsthand. Earlier software work shipped quickly but left behind large files and duplicated logic that made the code harder to reason about over time. I now treat tests, reviews, and cleanup as part of the working loop, because the agent needs fast signals about whether its changes are correct, and I still need to understand the shape of the system before I can trust it.

Cognitive debt is manageable, though. The more consequential question is about intent: how much do you define before you start building, and how much do you discover along the way? You can define a tight specification before the first prompt, or start loose and sharpen direction through iterative prompts. Both are valid approaches, and they produce different failure modes. One risks over-committing to assumptions. The other risks drifting without noticing. Where you land between them changes what AI builds, what gets caught early, and what only becomes visible after the system is already in use.

The tools I built over these past two weeks each landed differently on that spectrum, depending on how well the problem was already understood. But whether they turn out well has nothing to do with the speed of AI-assisted coding. It comes down to whether I actually understood the problem before I started, or only thought I did. I am still learning to tell the difference. That gap is where most of the waste happens, and AI makes it more expensive, not less. When building was slow, a weak idea had time to die on its own. Now you finish before you think to question it, and the existence of working software makes it harder to walk away.
