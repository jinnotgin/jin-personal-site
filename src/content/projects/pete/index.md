---
slug: pete
name: Pete
thread: applied-ai
year: 2024
status: archived
intent: An internal RAG knowledge guide for finding answers across company and project documentation.
stack: [RAG, LLMs, Confluence, Jira, internal knowledge search]
images: [./pete.png::Pete web app for searching internal company knowledge., ./pete-for-sls.png::Pete for SLS embedded in a project work chat.]
---

## Why it existed

Useful knowledge existed across HR policies, transition notes, renovation updates, project documentation, Jira stories, and Confluence articles. The problem was not that the information was missing. It was spread across too many places.

## The friction it answered

Search works when you already know what to search for. In practice, staff and project teams often had messy questions: what changed, where is the relevant policy, which old requirement explains this behaviour, or what did the team decide years ago?

## What was built

Pete started as an AI knowledge guide for Ufinity employees, using retrieval augmented generation to answer questions from internal documents. Pete for SLS then applied the same idea to a much denser project space: more than 6,500 Jira and Confluence items from over seven years of Student Learning Space work. The data also had client contractual obligations, so the design had to be more careful.

## What it left behind

Built in 2024, Pete was where I learned RAG in practice. Retrieval is hard: chunking, source grounding, stale documents, permissions, answer traceability, and outdated data all matter. Old documents can distort the answer as much as missing documents can, because the system has to decide what still counts as true. That turned knowledge management into part of the product problem, not just an input to it.

It also showed me the importance of being where users already are. HR knowledge was useful but occasional; project knowledge inside the team's working chat became much more useful. This became a concrete version of the context problem: retrieve the right documents, show where the answer came from, and fit into the moment where the question appears.
