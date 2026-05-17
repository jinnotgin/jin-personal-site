---
slug: before-adopting-ai-agree-what-you-mean
title: Before adopting AI, agree on what you mean by AI
date: 2026-04-02
excerpt: Adopting AI is too broad to be useful as a directive. Teams need sharper language before they can make sensible decisions about tools, risks, workflows, and ownership.
tags: [ai, linkedin, software, product]
status: published
category: AI in practice
source: https://www.linkedin.com/pulse/before-adopting-ai-agree-what-you-mean-jin-lin-evq6c
---
![Illustrated cover about defining what AI adoption means before moving](/img/writing/before-adopting-ai-agree-what-you-mean/cover.jpg)

Somewhere in the last eighteen months, "adopt AI" became a standing item on leadership agendas. The message travels downward through every layer: integrate AI into our workflows, stay competitive, don't get left behind.

The intent is usually sound. Most organisations probably should be exploring AI right now. But the directive often never comes with a clear definition.

I was catching up recently with a few friends who work across different parts of the tech industry. The conversation turned to AI (as every conversation seems to these days), and a few people started talking about it as though it were entirely new, something that arrived with ChatGPT. But AI has been running quietly in the background for years: TikTok's recommendation algorithm deciding what you see next, and FaceID unlocking your phone. None of that felt like "AI" to most people, because it was invisible.

Then the conversation went deeper. I asked what people meant by "agentic AI". The answers diverged immediately. One person described it as a chatbot that does more than answer questions. Another described it as a fully autonomous system that operates without human input. Same word, completely different definitions, among people who work with technology for a living.


## "AI" is carrying too many meanings

Karen Hao made an analogy in her [Diary of a CEO interview](https://youtu.be/Cn8HBj8QAbk?si=dLfyk5YDXTCteGib&t=6885) that stuck with me. She compared "AI" to "transportation". We naturally apply nuance when we talk about transportation: public vs. private, bicycles vs. rockets. These are wildly different things with different costs, purposes, infrastructure, and risk profiles. Nobody would plan a logistics operation by saying "let's use transportation" and considering it done.

Yet, that's essentially what happens when someone says "let's adopt AI".

The technology arrived faster than most people's exposure to its internal distinctions. If you're not building or researching AI directly, there's been little reason to learn where the boundaries are. Frontier AI labs compound this by keeping "AI" as broad and impressive-sounding as possible, because that serves headlines and pitch decks better than nuance does.

This would matter less if the stakes were low. But AI systems are already screening job resumes, generating synthetic media that's getting harder to distinguish from reality, and even giving people health advice they treat as credible. Lumping all of that under one word doesn't simplify the conversation. It hides the risks.


## Two distinctions that can sharpen the conversation

There are many ways to categorise AI. But for AI adoption conversations (where leaders are deciding what to invest in and teams are deciding what to build), here are two distinctions that I lean on when the conversation gets muddy:

**1. Predictive AI vs. Generative AI (what kind of technology)**

Predictive AI identifies patterns in data and makes forecasts or classifications. TikTok's recommendation feed and Apple's FaceID are both predictive AI. These systems have been part of products for years, often so seamlessly that nobody thinks of them as AI at all. They're narrow and task-specific, and their outputs are bounded: a recommendation or a score. When they fail, the failure tends to be measurable (accuracy drops, false positive rates climb) and generally contained.

Generative AI is a fundamentally different beast. Both ChatGPT and Claude are generative: systems that produce new content (text, images, code) from prompts. Unlike predictive AI, the range of possible outputs is essentially unbounded. The same prompt can yield different results on different days, so there is no fixed output space.

This unbounded quality is what makes generative AI both powerful and dangerous. A predictive model that misclassifies a transaction gives you a wrong number you can catch. A generative model that fabricates a statistic or misrepresents a policy gives you something that reads as polished and confident: the failure is invisible because the output looks like a correct answer.

And when that invisible failure reaches a customer or a government body, the damage is reputational in a way that a misclassified data point rarely is. A chatbot that confidently cites a policy that doesn't exist, or a generated report with erroneous figures forwarded to a client: these are failures that surface publicly and erode trust in ways that are hard to recover from.

Teams that treat predictive and generative AI as interchangeable will underestimate how much validation and human oversight generative systems require before they're safe to put in front of anyone.

**2. Automation workflows vs. Agentic workflows (how much autonomy)**

An automation workflow follows a path you define. If a form is submitted, route it to the approver. If a value exceeds a threshold, flag it. The logic is fixed. The kind of "AI" operates within boundaries you set. When something goes wrong, the diagnosis is straightforward: you trace the rules, find where the logic didn't account for a case, and fix it.

An agentic workflow is different. The AI receives a goal and decides how to pursue it: which tools to use and which steps to take. A customer-facing chatbot that searches your knowledge base, decides which articles are relevant, and synthesises an answer is operating agentically. So are coding agents that draft working features from a description. In both cases, the system is creating its own path rather than following one you laid out.

This autonomy introduces a compounding risk that automations don't carry. Each decision an agentic system makes shapes the context for its next decision. A wrong judgment early in the chain (choosing the wrong data source, misinterpreting an ambiguous instruction) doesn't just produce one bad output. And because the system creating its own path, debugging becomes harder: there's no predefined workflow to trace back through, only a sequence of autonomous decisions that may not be fully logged or explainable.

While automation fails within known boundaries, agentic systems can fail in ways you didn't anticipate, because the boundaries are not so clearly defined. Calling both "AI" makes it easy to adopt an agentic system while assuming it carries the predictable, containable risk profile of an automation. That assumption tends to surface only when something breaks in a way nobody planned for.


## "But won't clarity just come from doing?"

There's a reasonable counterargument: stop overthinking the labels and just start building. Let teams experiment, learn what works, and the vocabulary will emerge naturally from practice.

This is true, but incomplete. Experimentation is essential ([after all, AI features need proving through POCs and POVs before they ship](/writing/why-ai-features-need-proving-before-ship-demos-arent-enough)). But undirected experimentation under a vague mandate produces waste: parallel efforts solving different interpretations of the same directive, and tools adopted under assumptions that don't match their operating risk profiles.

Experimentation sharpens understanding. But it sharpens faster when teams start with enough shared vocabulary to compare what they're learning.


## What precision of language unlocks

The intervention here isn't a new framework, a new process, or a new committee. It's vocabulary.

When teams develop shared, precise language for the kind of AI they're discussing, the AI adoption conversation transforms. Compare these two statements:

"We want to adopt AI".

"We want to test whether a generative model can draft first-pass customer responses accurately enough to reduce manual reply time, with a human reviewer before anything gets sent".

The first generates more meetings. The second can be budgeted, scoped, evaluated, and shut down if it doesn't deliver. Precise language provides the vision clarity for charting future actions and decisions.

Of course, getting specific doesn't eliminate every obstacle. You can name the technology precisely and still struggle with implementation or organisational readiness. But those are problems you can work on. A team debating "AI" without shared definitions is stuck on something more fundamental: the words they're using can't support the decisions they need to make. Everything downstream of that ambiguity inherits it.


## Precision before motion

The pull right now is toward speed, and there's real cost to moving too slowly. But adopting AI without agreeing on what you mean by AI produces motion without direction.

The most productive thing a leader can do before saying "adopt AI" might be finishing the sentence: adopt which kind, and for what problem. That specificity changes what happens next. A clear directive activates a team; a vague one just generates confusion.

So, rather than asking is "how do we adopt AI fast enough?", a better question might be: have we first agreed on what we mean when we say AI?
