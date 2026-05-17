---
slug: timemoo
name: TimeMoo
thread: homegrown
year: 2013
status: archived
intent: A natural-language timezone converter without rigid input syntax.
stack: [NLP, timezone conversion]
images: [/img/projects/timezone-conversion.png::TimeMoo timezone conversion interface showing natural-language time conversion.]
---

## Why it existed

Timezone conversion is simple in theory, but annoying in practice. Most tools expected users to follow a specific format, select cities manually, or translate copied event text into the tool's syntax.

## The friction it answered

The friction was syntax. I wanted to type naturally, or paste a timing copied from another site, and have the tool infer the source time, target time, and conversion without making me clean everything up first.

## What was built

A natural-language timezone converter that processed free-form text and returned the converted time without a rigid command format.

## What it left behind

Looking back from a world where ChatGPT made natural-language interfaces feel normal, this seems obvious. At the time, NLP was the exciting new layer I wanted to apply: a way for software to understand loose human input instead of forcing the human to learn the software's syntax.
