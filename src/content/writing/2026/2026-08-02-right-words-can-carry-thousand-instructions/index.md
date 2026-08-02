---
slug: right-words-can-carry-thousand-instructions
title: The right words can carry a thousand instructions
date: 2026-08-02
excerpt: A short reference can sometimes steer an AI better than pages of instructions. The difficult part is knowing which words carry the context you need.
tags: [ai, prompting, communication, context-engineering, applied-ai, signals]
status: published
category: AI in practice
---

![Illustrated cover showing a small, precise marker opening a vast archive of instructions](./cover.png)

I gave an AI model two almost identical prompts.

The first was straightforward:

> Write 3 paragraphs for a blog post about AI.

The response was exactly what you might expect from AI writing. It opened with artificial intelligence moving “from the realm of science fiction into the fabric of everyday life”. Its style carried many of the familiar signals of AI writing: flowery language, frequent em dashes, and lists of three.

For the second attempt, I decided to add one short phrase:

> Using ASD-STE100, write 3 paragraphs for a blog post about AI.

The difference was immediate.

![Comparison of a general AI writing prompt and one referencing ASD-STE100](./response-comparison.png "One small change shifted the voice of the entire response.")

The grand opening and wide sweep across society disappeared. Instead, the response used short, direct statements:

> Artificial intelligence is a type of computer technology.

> Many industries use AI today.

> AI technology continues to develop quickly.

It was the same model and the same task, but a completely different voice.


## The instruction hidden inside one term

[ASD-STE100](https://www.asd-ste100.org/) is a controlled-language specification of English writing, developed for **aircraft maintenance documentation**.

It was designed for a practical problem: aircraft technicians came from different countries and had different levels of English proficiency. The maintenance instructions therefore needed to be understood consistently.

This English standard controls vocabulary and grammar. It asks writers to use short sentences, keep each paragraph to one topic, avoid unnecessary synonyms, and use words only with their approved meanings. [The latest issue](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) contains more than 400 pages of guidance.

Notice that I didn't need to explain any of those rules in the prompt. I only wrote `ASD-STE100`.

To be clear, I cannot prove that this exact aircraft-writing standard appeared in the model's training data. After all, model providers generally don't disclose which documents they use to train their AI models (*\*cough\** copyright *\*cough\**).

Yet, in my example above, it's clear that the model did move towards that particular body of writing practice.

## This is what context anchors do

I have started thinking of terms like `ASD-STE100` as **context anchors**. A context anchor is a reference point to a much larger body of established practices and norms.

Consider a simple use case: asking AI to edit an email response. Without a clear boundary, the AI might rewrite the whole message. The grammar improves, but your phrasing disappears. A quick correction comes back sounding like a corporate announcement written by someone else.

Instead, you can ask the AI model to make `Atomic Edits`, and those two words carry a useful constraint: make small, self-contained changes only where necessary. The model then understands that it should preserve the original intent, including the writer's structure and voice.

Here are some other examples of context anchors that I use:

- `BLUF` asks a writer to put the conclusion first.
- `Given–When–Then` tells a software team how to structure an acceptance test.
- `Red/Green/Refactor TDD` carries an entire coding loop: write a failing test, make the smallest change needed to pass it, then improve the implementation while keeping the test green.
- `WCAG 2.2 AA` gives a designer a clearer accessibility target than "make this accessible".

With context anchors, you can easily connect your intent to larger patterns encountered by the AI model during its training. **A good context anchor shortens the explanation required, resulting in better [token efficiency](https://knwn.app/glossary/what-is-token-efficiency).**

![Illustration of compact references unlocking larger bodies of established practice](./inline-context-anchors.png "A few recognised terms can carry the structure of an entire method.")


## The model brings its own defaults

One useful way to think about a Large Language Model is as a [lossy compression of patterns](https://deepmind.google/research/publications/39768/) found across its training.

During training, the model encodes patterns across the material it encounters. Our prompts then steer how those patterns are reconstructed. As I [wrote previously](/writing/why-ai-features-need-proving-before-ship-demos-arent-enough), with different training data and methods, AI models also develop different strengths, personalities, and blind spots.

So, if you leave the prompt broad, the model's default "mannerisms" will take over: words like "delve", "load-bearing", and "blast radius". Often, when these defaults are reproduced without much judgment or originality, the writing starts to feel generic (or as some call it, **AI slop**).

Worryingly, I've been seeing more and more of these AI patterns. For example, I hear the familiar "it's not just X, it's Y"  pattern in many reports, presentations, and YouTube videos. [Research analysing hundreds of thousands of academic talks](https://arxiv.org/abs/2409.01754) also found that words strongly associated with ChatGPT became more common in spoken language after its release.

The influence can therefore run in both directions: our prompts draw on the model's patterns, while repeated exposure to its outputs may shape our own. Without deliberate prompting and human judgement, communication begins converging towards the AI model's defaults.


## Finding these words requires broad knowledge

You can only prompt with `ASD-STE100` if you know ASD-STE100 exists. You can only ask for `Atomic Edits` if you are familiar with this concept in the first place.

I know many people mock the term "prompt engineering", but here's my hot take: prompt writing remains an important first step towards clear, consistent output.

The work is shifting away from blind incantations like “You are a world-class expert” and towards something more precise: knowing enough across domains to recognise a useful concept, then borrowing it for another task. That is how an aircraft manual writing standard can improve general writing tasks.

In many cases, the model already possesses a wide range of capabilities, but it can be difficult to reach it. So the practical question becomes: **what is the smallest amount of writing that can reliably produce the outcome I need?**


## Prompting is communication

Good communication has never been about saying everything in your head.

It requires some understanding of the person receiving the message: what they already know, which terms they use, what context they are missing, and what they are likely to misunderstand.

![Illustration of a sender choosing a few precise signals that connect with the recipient's existing context](./inline-communication.png "The useful message depends on what the recipient already knows.")

We all know someone who talks and talks without noticing that the audience disconnected five minutes ago. More words continue to leave their mouth, but no additional meaning arrives.

Prompting can fail in the same way.

We keep adding instructions because the AI did not understand us the first time. Then we add exceptions, explanations for those exceptions, and reminders not to forget the earlier instructions. Eventually, [the prompt becomes bloated and difficult to maintain](https://github.com/anthropics/claude-code/issues/46339).

Good prompting should work like good human communication: understand what the recipient already knows, then choose the few words that will take them to the right place.

The real skill is knowing what can safely be left unsaid. When the right words can carry a thousand instructions, knowing which words to choose becomes the real intelligence.
