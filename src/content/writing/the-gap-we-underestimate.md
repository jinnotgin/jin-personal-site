---
slug: the-gap-we-underestimate
title: The gap we keep underestimating
date: 2026-03-30
excerpt: The distance between a model that can do the task and an organisation that can keep doing it.
tags: [AI in practice, adoption, organisations]
status: published
category: AI in practice
---

The model can do the task. That part is, increasingly, not the hard part.

The hard part is the gap between a model that can do the task in a demo and an organisation that can keep doing the task on a normal week, with the usual people, under the usual constraints, without quietly accumulating a debt nobody priced.

We keep underestimating that gap because the demo collapses it. In the demo, the person running it is the person who built it, the input is the input it was tuned on, and the failure mode is "let me try that again". None of those hold in production.

## Where the gap actually is

It is rarely in the model. It is in:

- **Judgement.** Someone has to know when the output is wrong. If the tool removes the people who could tell, it has not saved work, it has hidden risk.
- **Memory.** Organisations remember things in people and habits, not just systems. A tool that routes around that memory looks faster and is, until the memory was load-bearing.
- **Recourse.** When it is wrong, what happens next? A workflow without a clean correction path does not fail gracefully. It fails silently.

## The honest version of "AI adoption"

Adoption that costs people their judgement, their standing, or the institution's memory is not adoption. It is attrition with a launch date.

The work I find actually moves the needle is unglamorous: deciding what the tool is *not* allowed to decide, building the correction path before the happy path, and keeping a human accountable for the output rather than the tool. That is mostly facilitation, not engineering, which is why it gets skipped.

The model can do the task. Whether the organisation can keep doing it is a different question, and it is the one worth most of the attention.
