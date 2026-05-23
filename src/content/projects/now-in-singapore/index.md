---
slug: now-in-singapore
name: Now In Singapore
thread: [applied-ai, signals]
year: 2024–now
status: active
intent: A curated pulse-check on what is happening across Singapore right now.
stack: [Vue 3, Tailwind CSS, Gemini, GPT, Cloudflare R2]
links: [Live site::https://nowinsg.com]
images: [./nowinsg-desktop.png::Now In Singapore desktop interface showing curated event listings., ./nowinsg-mobile.png::Now In Singapore mobile interface for browsing events on the go.]
---

## Why it existed

People often say there is nothing to do in Singapore, but the real problem is that events, exhibitions, and pop-ups are scattered across too many sites.

## The friction it answered

Finding events meant too much searching, too many tabs, and too many raw listings that did not explain why an event was worth attention.

## What was built

A responsive web app that gathers event information, uses AI to summarise and categorise it, then lets people filter by time period, location, and event type.

## What it left behind

Now In Singapore taught me how LLMs change data scraping. Fetching pages is only the first step. The harder part is cleaning messy web content, keeping token use low, and deciding which parts should be handled by normal code versus LLM judgement. In 2024, structured outputs were still uneven, so the system needed checks, cleanup, and retries. The useful pattern was using LLMs to turn scattered, inconsistent web material into structured data that was easier to browse.
