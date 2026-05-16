---
slug: maker-notes-downtime
title: Lessons paid for in downtime
date: 2025-09-19
excerpt: Running Alastair, a local-first house assistant, for long enough to learn the unglamorous parts.
tags: [maker notes, self-hosted, reliability]
status: published
category: Maker notes
---

Alastair has been running in the house for years now. Long enough that the interesting lessons are not about what it can do. They are about the mornings it did not.

Things self-hosting teaches you that a cloud dashboard never will:

- **The failure you did not design for is the one that wakes you up.** Mine was a power blip that left the assistant convinced it was 1970. Everything downstream trusted the clock.
- **Local-first is a maintenance choice, not a privacy slogan.** You own the privacy and you own the 7am debugging. Both are real.
- **Reliability is mostly restraint.** Every feature I added that I did not strictly need became a thing that could break at an inconvenient time. The system got better as it got smaller.

I keep Alastair partly because it is useful and partly because it is the most honest teacher I have. A house assistant that fails takes its lesson out of your morning, not a sprint retro. You remember it.
