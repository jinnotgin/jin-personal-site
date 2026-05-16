---
slug: platforms-that-carry-policy
title: Platforms that carry policy
date: 2026-02-10
excerpt: Some product work is less about inventing features and more about making policy executable.
tags: [public platforms, product, policy]
status: published
category: Product systems
---

Some platforms carry policy.

That sounds obvious until the build starts. A policy can be clear in intent and still become ambiguous at the product edge: who qualifies, what counts, what happens when two agencies define the same case differently, what the citizen sees when internal rules are still being reconciled.

The product work is not just translation. It is negotiation with consequences.

## Where the product lives

Public platforms sit between policy, operations, technology, and people who are often trying to get something important done. The interface is only the visible part. Under it are eligibility rules, agency responsibilities, service recovery paths, audit needs, timelines, and a dozen small decisions that can either make the system coherent or make users carry the confusion.

On TAS, the useful product work started upstream: Scope of Work, MVP workshop, gating criteria, and scenario mapping before the build hardened too early. On SLS, the useful practice was behaviour-driven specification: writing scenarios clear enough that design, development, and QA could reason about the same behaviour before it became code.

Different project, same pattern: make the implicit system explicit before it becomes expensive.

## What good alignment does

Alignment is often treated as agreement. I think that is too weak.

Good alignment gives people a way to make tradeoffs when agreement is not available yet. It changes the conversation from "this is important to my side" to "which outcome matters most for the person relying on the service?"

That shift does not remove tension. It makes the tension usable.

The best platform decisions I have seen were rarely the flashiest ones. They were decisions that made future policy changes cheaper, reduced duplicated builds, clarified edge cases, or prevented users from becoming messengers between institutions.

That is the public-platform thread for me: not a demo I can always show, but a way of working that makes policy executable without making people absorb the complexity.
