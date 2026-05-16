---
slug: retrieval-over-vibes
title: Retrieval over vibes
date: 2026-02-18
excerpt: Notes from PromptPal on making model answers trace back to a source instead of a mood.
tags: [AI in practice, retrieval, evals]
status: published
category: AI in practice
---

PromptPal started as a complaint. The same prompt, the same week, two people, two different answers, and no way to say which one was right or why.

The fix was not a better prompt. It was making every answer carry its receipts.

## What "traceable" meant in practice

- Every answer cites the chunks it used, and the chunks are inspectable, not hashes.
- A wrong answer is a retrieval bug or a reasoning bug, and you can tell which by reading the citations. Before, every wrong answer looked the same: bad vibes.
- The eval set is small, real, and version-controlled next to the prompts. It is not comprehensive. It is honest.

## The unglamorous part

Most of the work was not the retrieval. It was deciding what counted as a source, keeping the index from rotting, and resisting the urge to make the system answer questions it had no business answering.

The cheap default turned out to matter most: cache the stable context, cite by default, refuse confidently when the retrieval is thin. A model that says "I do not have a good source for this" is more useful at work than one that is fluent and unfooted.

> Show the workings, not just the conclusion. It is the same rule I learned the hard way building CoinGossip, applied to a different kind of signal.

Vibes are fine for a first draft. They are a poor foundation for a workflow other people depend on.
