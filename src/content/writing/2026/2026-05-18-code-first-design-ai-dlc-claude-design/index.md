---
slug: code-first-design-ai-dlc-claude-design
title: What I learnt about Code-First Design, from using Claude Design
date: 2026-05-18
excerpt: I've been using Claude Design to understand where code-first design fits into modern software development.
tags: [ai, design, prototyping, engineering, ai-dlc, applied-ai]
status: published
category: AI in practice
---

[Claude Design](https://www.anthropic.com/news/claude-design-anthropic-labs) made me realise code-first design is not just about faster prototypes, but about where the hidden design judgment lives.


## The prompts behind the prompts

After using it for a bit, I notice that Claude Design can consistently ship polished functional prototypes from the *very first* generation. This kind of consistent polish is *very suspicious*, and it’s not what you would expect from a single-shot user prompt.

![Claude Design company intranet prototype](./claude-design-company-intranet.png "You can try the live prototype that was built with Claude Design here: [Acme Intranet Prototype](https://jinnotgin.github.io/code-first-design/claude-design_company-intranet-home.html)")

The more I used it, the more I could see the prompt engineering underneath. For example, the [tweaks panel](https://www.anthropic.com/news/claude-design-anthropic-labs) (those sliders that let you adjust spacing, colour, and layout) was likely a preset component, steered by internal prompts that shape how the model structures its output.

![Claude Design tweaks panel with red accent settings](./image-20260518-030223.png "For example, switching the color accent to red, and hiding certain widgets")

When I moused over certain UI elements of Claude Design, I caught fragments of the prompting. Claude Design controls how the model outputs file content in a particular structure. Not just *what* to generate, but *how to organise the generation itself*.

![Claude Design prompt fragment tooltip](./image-20260518-030412.png)

![Claude Design generated prototype and prompt panel](./image-20260518-030452.png)

When experimenting with Claude Design, I mainly relied on [Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7), one of the strongest models for frontend visual generation right now. But Claude Design's quality isn't just Opus 4.7 being good at design. It's the *harness* around the model: the hidden prompts, the preset components, the rules about what to generate and how to format it. Everything the user doesn't see that sits between their request and the model's response.

In other words, the harness is doing a lot of the work as well.


## But here’s when the dance stops

There's a practical problem, though. Claude Design is in research preview, and the usage limits are very harsh.

![Claude Design usage limit message](./image-20260518-031059.png "I can feel your pain 😥")

That was my experience too. Within 2 hours, I’ve used up all my usage for the entire week. Yes, I only had a $20 USD Claude plan. Sure, I was using Claude Opus 4.7, the most powerful model. But that doesn’t change how painful these limits feel.

If this were a client project with a deadline approaching, we can’t be having people being blocked by usage limits, right? Even if we use the $200 plan, what happens if the users get stuck after, say, 2 days?

So, that pushed me to look at alternatives.


## Open source to the rescue… or not?

[Open Design](https://opendesigner.io/) is an open-source competitor to Claude Design. It's a local-first, bring-your-own-AI alternative that runs on whatever coding agent you already use: [Claude Code](https://www.anthropic.com/claude-code), [Codex](https://openai.com/index/codex/), [Gemini CLI](https://geminicli.com/), and others. It ships with its own design systems, and prompt engineering (e.g. anti-AI-slop checklist).

![Open Design interface](./image-20260518-031304.png "Open Design looks awfully similar to Claude Design 🤫")

So, I tried it with the same starting prompt I'd used with Claude Design, but with other models (Chinese model GLM 4.6, and OpenAI’s GPT 5.5).

![Open Design output with GLM 4.6](./image-20260518-031431.png "Open Design + GLM 4.6")

![Open Design output with GPT 5.5](./image-20260518-031524.png "Open Design + GPT 5.5")

As you can see, the results were poor, compared to Claude Design.


## Come on, that’s not a fair test

Yes I know, I changed two variables at once: the harness and the model. A proper experiment would only isolate one.

But yet, the designer or developer sitting with a deadline isn't going to run controlled experiments. Most won't want to swap models or compare outputs across model providers. They just want to describe what they need and get something usable back.

That made me wonder: if the difference is not just the model, but the surrounding guidance, then maybe the thing to look for is not another Claude Design clone. Maybe it is the reusable design judgment sitting around the model.


## And hence, my search for “skills”

In the context of AI coding agents, a [skill](https://agentskills.io/home) is a set of structured, pre-written prompts that load into the model's context before you say anything. Think of it as a briefing packet: instead of explaining what you want from scratch every time, the skill hands the model a playbook the AI model can reference. Skills can be scoped to a single task or cover an entire discipline.

If the AI model is the engine, and the harness is the car frame, then skills are the driver's manual taped to the dashboard. The engine has the power. The frame holds it together. But the manual is what tells the engine *where to go* and *what to avoid*.

That search led me to [Impeccable](https://impeccable.style/), a design skill for AI coding agents created by [Paul Bakaus](https://github.com/pbakaus/impeccable). It ships with a library of design reference files covering areas like typography, colour, motion, spatial design, interaction patterns, responsive behaviour, and UX writing. By invoking this skill when using AI agents, the agent will be able to pick design references to load based on the task at hand.

![Impeccable skill writing example](./image-20260518-032734.png "A small snippet into their very extensive skill writing")

I looked into the prompt writing behind Impeccable, and it was *impeccably thorough*. Besides being really opinionated about many aspects of UI/UX design, its additional value is in what it *forbids*. It catalogues 27 anti-patterns, the lazy defaults many models fall into: purple gradients, nested cards, low-contrast labels, etc. It names them and steers the AI to avoid them.

![Impeccable website design example](./image-20260518-034815.png "An example from the Impeccable website")

I would imagine that most laypeople will prompt with simple language like "make it look good and modern", because they don't have terms like *tinted neutrals*, *vertical rhythm*, or *fluid type scale with optical sizing*. Impeccable closes that vocabulary gap. The design capability was already in the model. The prompts were just too vague to reach it.

I tested this by pointing Claude Code and Codex at [my personal site](https://itsjin.com/) with Impeccable loaded as a skill. After several rounds of direction and iteration, the results were strong. Definitely not a single-prompt kind of magic, but still amazing after several back-and-forth.

![Personal site before redesign](./image-20260518-033136.png "Before")

![Personal site after redesign](./image-20260518-033103.png "After")

This unlocks a new path forward, by pairing AI coding tools (Claude Code or Codex) with agent skills like Impeccable for design work. That's code-based design without the lock-in to Claude Design. Of course, you won’t get some of the niceties of Claude Design (e.g. being able to draw & annotate on the website), but at least there’s a way forward.


## Claude Design's prompts are still gold though

I still think Claude Design produces the best output I've seen. So, I tried to find out why from the inside.

When I attempted to "distill" their prompts (to get the model to reveal the system instructions steering its output), I was blocked. The system refused to show the raw prompts, but it offered to *paraphrase* them, which I gladly accepted.

![Claude Design prompt files list](./image-20260518-033352.png "Oh my gosh the number of files")

Look at the amount of prompt / skill files there are! Different prompts for typography, component hierarchies, colour palettes, file formatting. And this is just a small portion, because it stopped halfway due to, you guessed it, usage limits. 🤦

That's Anthropic's real advantage with Claude Design. The accumulated prompt engineering sitting between user and model, invisible to most users, doing most of the work. While the Opus 4.7 model matters (a lot), the very capable output I saw was also due to all these harness-related prompts and pre-made components. The harness is what separates Claude Design from say, Claude Code.

The model determines what is possible. The harness shapes what the model attempts.


## Is code-first design really it though?

Code-first design is one piece of the emerging [AI Development Life Cycle (AI-DLC)](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/). Because LLMs make code cheap, you can design by generating real, functional interfaces instead of static mockups. Claude Design embodies this. Open Design tries to democratise it. Impeccable provides the vocabulary that makes output professional instead of generic.

But is code-first design really that much better than Figma? In raw speed, probably not. A skilled designer can mock up screens and wire a clickable prototype in an afternoon too.

The difference is in what the prototype *can do*. A Figma prototype is a series of connected screenshots. It can show layout and flow, but it can't easily show what happens when a form submits, a spinner appears for 1.2 seconds, and real data that populates a table. It can't simulate a dashboard handling 3 items versus 3,000. It can't save your input and load it back. A code-first prototype can.

So, the real value of code-first design isn't speed. It's that the prototype is *more real.*


## Speed and stability

But "more real" brings its own problems. [Tuhin Nair describes two loops](https://www.nair.sh/guides-and-opinions/communicating-your-expertise/why-senior-developers-fail-to-communicate-their-expertise) in any business: one for speed and uncertainty reduction (ship, learn, iterate) and one for stability and complexity management (keep things working, keep them understandable, so payment keeps coming in). Code-first design tools accelerate the first loop dramatically. They do nothing for the second. A working prototype generated in an afternoon still needs to be understood, maintained, and evolved by real people for service stability.

![Two feedback loops diagram by Tuhin Nair](./image-20260518-081259.png "The two feedback loops as illustrated by Tuhin Nair")

The goal isn't to pick one loop. We need to amplify both. Experience-focused people (designers, product managers, founders) should move fast and test ideas with real, working prototypes. Foundation-focused people (senior engineers, architects) should slow down and make deliberate decisions about what to keep, refactor, or discard.

And there's a parallel worth noticing. In Claude Design, carefully written prompts and pre-made components provide the foundation for great output. The user moves fast on top of a foundation that was built with care.

Perhaps a vibe-coded prototype can serve the same role for a stable system: not the final product, but a real, interactive spec that engineers (and their AI agents) can inspect, pull apart, and rebuild properly. The prototype captures intent in a way a static mockup never could. The stability work that follows is better for having started from something real.

The tools will keep improving. The speed ceiling will keep rising. But the need for stability hasn't changed, and that's the gap where the real work of AI-DLC lives.
