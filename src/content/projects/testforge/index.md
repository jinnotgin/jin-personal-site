---
slug: testforge
name: TestForge AI
thread: applied-ai
year: 2023
status: archived
intent: A Google AI Trailblazers prototype for generating software test scenarios from requirements.
stack: [Google AI Trailblazers, Vertex AI, LLMs, software testing]
links: [AI Trailblazers::https://www.edb.gov.sg/en/about-edb/media-releases-publications/mci-disg-sndgo-and-google-cloud-launch-ai-trailblazers-initiative-to-accelerate-the-development-of-impactful-generative-ai-solution-singapore.html]
images: [./testforge-ai.png::TestForge AI interface for inspecting software testing signals.]
---

## Why it existed

In 2023, Google AI Trailblazers created an opportunity to test real generative AI use cases with Google Cloud and the early Gemini 1.5 models. For us, one question was whether LLMs could help generate useful test scenarios from software requirements.

## The friction it answered

Writing test scenarios takes a lot of context. A tester has to understand the requirement, the product behaviour, the edge cases, and what has broken before. We wanted to see how much of that first draft could be assisted by an LLM.

## What was built

A prototype that used LLMs to turn requirements into draft test scenarios for review. It was built as part of the AI Trailblazers programme, which gave participating teams access to Google Cloud tools and support for building generative AI prototypes.

## What it left behind

TestForge AI made the limits of manual context gathering more obvious to me. Test generation only becomes useful when the right surrounding information is pulled in: requirements, recent changes, past failures, related tickets, and the product area being tested. That pointed to a lesson I kept returning to later: AI tools need a way to gather the right context on their own, and the knowledge pipeline is often as important as the AI on top of it.
