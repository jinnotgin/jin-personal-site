---
slug: thinking-you-cant-get-back-hidden-cost-ai
title: The thinking you can't get back (and the hidden cost of AI)
date: 2026-03-19
excerpt: Every level of AI assistance removes work from humans. The hidden question is which parts of that work were also building judgment, memory, and understanding.
tags: [ai, linkedin, software, product, applied-ai]
status: published
category: AI in practice
source: https://www.linkedin.com/pulse/thinking-you-cant-get-back-hidden-cost-ai-jin-lin-fkm0c
---
![Illustrated cover about the thinking that can be lost when AI removes work](./cover.jpg)

I recently wrote about my interpretation of the [five levels of AI-first software development](/writing/five-levels-ai-first-software-team), each one defined by what humans *stop* doing. The framing was rather optimistic: less grunt work, faster prototyping, delegated building.

But anyone who has built software for long enough knows that there are no fair trades. Every abstraction, every shortcut, every choice buys you something and costs you something. The key is in seeing the tradeoffs before you commit to a choice.

AI-assisted software engineering follows the same rule. Each level buys speed, but what gets lost is the **understanding** that used to come bundled with the effort (e.g. the mental models of a system’s architecture, the instincts of how things connect). And it's an easy loss to miss, because nothing looks broken until the moment you need the understanding that's no longer there.


## Doing less means understanding less

A [2025 study from Microsoft Research and Carnegie Mellon](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/) surveyed 319 knowledge workers using generative AI for their actual work tasks. The core finding: when people used AI, their critical thinking shifted from generating and analysing ideas to merely checking AI output. Higher confidence in AI was associated with less critical-thinking effort.

The more people trusted the tool, the less they thought.

This maps onto the levels directly. At Level 1, nobody really loses judgment by letting autocomplete finish a code comment. But at Level 2, the system handles impact analysis that used to require a senior developer tracing dependencies manually. By Level 4, agents draft entire features while humans review. Each step up compresses more cognition. And with each compression, understanding can vanish without anyone noticing it's gone.

Other research efforts point at this phenomenon as well. When a tool handles the remembering, structuring, or reasoning on your behalf, you retain less of the material yourself (*[Societies](https://www.mdpi.com/2075-4698/15/1/6)*[, 2025](https://www.mdpi.com/2075-4698/15/1/6)). Authoritative-looking output reduces vigilance; people stop looking for reasons the answer might be wrong ([PMC systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC7651899/)). This happens outside of software development as well, with AI-assisted writers showing worse memory recall than those who wrote unaided ([MIT Media Lab](https://www.media.mit.edu/publications/your-brain-on-chatgpt/)).

So yes, the work still gets done, but we are starting to see the understanding doesn't stick.


## "Does it matter?"

There's a natural counterargument here. Take a look at the automotive world, where cars went from manual transmission to automatic. Many drivers don't know how to do manual gear shifting anymore, and nobody considers that a crisis. Technology regularly absorbs skills that humans used to need, and life just goes on. (You can say the same thing about GPS navigation as well.)

If AI reliably handles the thinking, maybe teams don't need to understand what's underneath. Maybe "understanding erosion" is just what better tools have always cost us, and the trade has always been worth it.

This argument works well for deterministic systems. An automatic gearbox behaves the same way every time. You can trust it without understanding it because its behaviour is predictable and bounded. If something goes wrong, there's a warning light to alert you. In other words, you can safely forget what's inside it.

However, generative AI is not like an automatic gearbox.

That is because large language models are non-deterministic. The same prompt can produce different outputs. Those outputs shift with model updates, context windows, and the subtle interactions between your prompts and files. Catching these failures requires *exactly* the kind of judgment and domain understanding that the tools might gradually erode.

This distinction matters, and it's easy to miss because the surface experience feels similar: the tool handles the complexity, you get a easier result. But under the surface, the reliability profiles are completely different.


## The ground might shift

Even setting aside the non-determinism nature, there's another reason to be cautious about offloading understanding: the current accessibility of AI tooling relies on economics that haven't been stress-tested.

LLM inference is heavily cost-subsidised right now. Major providers are [burning through capital](https://www.bloomberg.com/news/articles/2026-02-19/openai-funding-on-track-to-top-100-billion-with-latest-round) to establish market position, offering capabilities at prices that don't reflect the [actual cost of compute, energy, and infrastructure](https://www.reuters.com/commentary/breakingviews/ai-boom-is-infrastructure-masquerading-software-2025-07-23/?utm_source=chatgpt.com). This is a familiar playbook (cough, Netflix, looking at you), and the familiar ending is that prices rise substantially once the subsidy period ends and investors expect returns.

The infrastructure behind these models carries unresolved questions of its own. The [energy demands of large-scale data centres](https://www.iea.org/news/ai-is-set-to-drive-surging-electricity-demand-from-data-centres-while-offering-the-potential-to-transform-how-the-energy-sector-works) are significant and growing. The land use, water consumption, and second-order impacts of building at the current scale have not been clearly validated. Meanwhile, some of the [financing structures in the space have a circular quality](https://www.bloomberg.com/graphics/2026-ai-circular-deals/): companies investing in AI infrastructure are also the primary customers of that infrastructure, creating valuations that reference each other rather than independent demand. When the music stops, the house of cards might come tumbling down.

None of this means the technology disappears. But it does mean the current terms of access (cheap, abundant, improving on a steep curve) are not guaranteed to hold.

A team that has built its practices around Level 4, where AI handles upstream thinking and humans steer and review, is making an implicit bet that the tooling will remain available and affordable. However, if costs quadraples or availability evaporates, that team needs to fall back on their own understanding of the systems they have built. Understanding you've delegated away is not understanding you can reclaim on demand. That gap then becomes the **cognitive debt**.


## The healthy tension to balance

None of this is an argument against using AI tools. The speed is real. The reduction in tedious work is real. But so is the tradeoff: each level quietly trades understanding for velocity. And that trade is worth making only when you see it clearly, compensate deliberately, and acknowledge that the ground beneath it is less solid than it looks.

Right now, that ground is artificially cheap, fundamentally unpredictable and unexamined at scale. The research also seems to imply that indiscriminate AI use reduces understanding and critical engagement, especially for routine knowledge work.

And yet, most of the work in a software team is routine knowledge work. So the question "is the team ready to let things be different?" needs a companion question: is the team ready to protect what matters, even when the tools make it easy not to?

I don't believe there's a version of this where you get all the speed and keep all the understanding. Something is always lost. The only question is whether you chose what to lose, or let the AI choose it for you.
