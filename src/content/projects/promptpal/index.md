---
slug: promptpal
name: PromptPal
thread: applied-ai
year: 2023–now
status: active
intent: An internal Generative AI product for confidential, organisation-wide LLM access.
stack: [LLMs, RAG, multimodal files, product operations, data residency]
images: [./promptpal.png::PromptPal interface showing internal AI work with files and prompt workflows.]
---

## Why it existed

Back in 2023, some Ufinity staff wanted to use large language models on real work, including customer and project material. The blocker was not interest. The blocker was whether we could do it without leaking confidential data or violating data residency obligations.

## The friction it answered

AI adoption was happening unevenly. Some people were already experimenting with public tools. Others were unsure what was allowed. The organisation needed a safe default so people did not have to rely on shadow tools.

## What was built

A production internal tool that gives staff access to LLMs within the organisation's confidentiality and residency constraints. PromptPal supports PDFs, images, audio, video, code, and text, with purpose-specific prompts for common work tasks. Conversation history stays local in the browser. Uploaded data is encrypted, isolated in private cloud infrastructure, not used for model training, and purged after use.

## What it left behind

PromptPal became a common place for employees to experiment with LLMs on real work. Each team no longer had to solve the same access and data questions on its own. It also taught me that enterprise LLM work is very different from consumer LLM usage. The product problem is not just "which model is smartest"; it is token cost, context management, file handling, data residency, auditability, and making the safe path easy enough for everyday use.
