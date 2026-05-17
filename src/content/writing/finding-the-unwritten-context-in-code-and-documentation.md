---
slug: finding-the-unwritten-context-in-code-and-documentation
title: Finding the Unwritten Context in Code and Documentation
date: 2026-02-24
excerpt: Your AI agent can read your entire codebase — but can it read what your team never wrote down? Here's what that blind spot actually costs you.
tags: [ai, llm, agents, context, coding, applied-ai]
status: published
category: AI in practice
---

> *Your AI agent can read your entire codebase. It can query your documentation. But it can't read what your team never wrote down.*

In my previous post, I wrote about [orchestrating different AI models for coding tasks](/writing/building-tools-with-agentic-coding), focusing on *which* model to use and when. This post is about something upstream of that: the information you feed into those models, and how AI agents go about finding it.

At the time of writing, over 60,000 public repositories include some form of context file for AI agents.[¹](#sources) Many agentic tools even ship with a built-in command to generate one. And yet, the evidence for whether they actually help is far less clear than the adoption rate would suggest.

Here's the thing about LLM technology that's easy to forget: they're **stateless**. No memory between interactions. Every time you start a new conversation, the model knows nothing about your project, your team, or your decisions. Every time you continue a conversation, you are sending back the entire conversation history to a new & different instance of the model.

Think of your own short-term memory. You can juggle a phone number, a shopping list, a few instructions from your manager. Add a fourth thing and something drops. A LLM's **context window** is the same constraint, measured in **tokens** instead of mental effort. While bigger models have bigger windows, the budget is always still finite.

So context is a budget decision. You can't give the model everything. What goes in, and how does it get there?

> *"But doesn't the agent figure out what context it needs on its own?"*

Sort of. Modern AI agents can decide *when* to retrieve information. But they're still limited by *how* they search. And that determines what they can actually find.


## Two ways agents find information

When an AI agent needs context, it has two retrieval strategies.

**File search (exact match).** The agent searches your project files directly, the same way you'd use Ctrl+F but across entire folders and repositories. Technically, this means tools like `grep`, regular expressions, and shell commands over the file system. Deterministic and precise. If you know the exact term (a function name, a config key, a ticket number), file search will find it given that the file exists.

**Semantic search (search by meaning).** The agent searches your documents by meaning, not keywords, so it can surface relevant information even when the wording doesn't match. This is called <u>retrieval-augmented generation</u> (RAG), which works by embedding documents into a vector database and querying it with semantic similarity. This is great when the answer exists somewhere in your docs but the exact phrasing is anyone's guess.

| Query | Best approach |
|---|---|
| "Find ticket `PROJ-1234`" | File search |
| "What is OAuth implementation in `AuthService`" | File search |
| "What's our refund policy?" | Semantic search |
| "What were the acceptance criteria for the dashboard feature?" | Semantic search |

**The type of content determines the retrieval method.** Exact terms → file search. Fuzzy writing → semantic search.

Straightforward enough. But here's where things get tricky.


## Available doesn't mean findable

I've seen developers download entire Confluence spaces, Jira tickets, and user story backlogs into their local file systems so their agent can access them. It's a good idea. Sometimes the agent can't reach Confluence natively, so you bring the content to the agent. Problem solved.

Except it only solves half the problem. The **access** half. Not the **retrieval** half.

Jira tickets and Confluence pages are written in natural language, inconsistently worded, with the same concept phrased ten different ways by ten different people. It's like searching a group chat with Ctrl+F. You'll find exact keyword matches, but you might miss the answer you actually needed, because the person who wrote it used different words.

That is why it's better to consider using **both** retrieval methods, matched to the nature of the content.

- Codebase, config files, structured data → file search
- Confluence, Jira, user stories → semantic search

So between file search and semantic search, agents have decent coverage of written information. But there's a whole category of knowledge that neither method can touch.


## How do we find something that never existed?

File search finds what's written in your project files. Semantic search finds what's written in your docs and tickets. Neither can retrieve what was never written down.

Every team has this knowledge. It lives in people's heads, in Slack / Teams threads that scrolled off-screen months ago, in meetings that never produced action items:

- Why a particular library was abandoned after a security incident
- Which module is fragile and requires coordination before changes
- What is the new team workflow for code review
- Conventions that exist by habit, never formalised in any linter or doc
- Why an architectural decision was made the way it was
- Which parts of the codebase have implicit ownership

This is the context agents consistently miss, and the most damaging kind to miss, because the agent will confidently make decisions that violate unwritten rules it had no way of knowing about.

*"The code compiled and the tests passed, so it must be fine."* Except nobody told the agent that the `payments` module requires a sign-off from another team before changes go live.


## Filling the gap with AGENTS.md

This is where steering documents come in. **AGENTS.md** (and similar files like CLAUDE.md) are designed to give agents the context they can't retrieve from code or docs alone.

**<u>Provide "missing" instructions</u>**

The study[¹](#sources) evaluated four coding agents across two benchmarks, testing three settings: no context file, an LLM-generated one, and a developer-written one.

LLM-generated files *reduced* success rates by about 3% while increasing inference costs by over 20%. Developer-written ones improved success by about 4%, but also increased costs. Codebase overviews didn't help agents navigate repositories any faster.

The conclusion: context files help when they contain *minimal, non-redundant requirements* the agent genuinely cannot find elsewhere.

**<u>Unnecessary instructions add friction</u>**

Before you think the fix is simple — just write it all down — it's worth knowing that *unnecessary or redundant* instructions slows things down, wastes context window and increases cost.

**Try this**: Don't think of a pink elephant.

You just did. You couldn't help it. The instruction to *avoid* something made you think about it.

LLMs work the same way. Every token in the context window influences the model's reasoning, whether useful or not. A context file that says "Don't use the legacy API in `/api/v1/`" has just introduced the legacy API into the agent's working memory. A file that spends 500 words describing directory structure hasn't just burned 500 tokens — it's primed the agent to think about structure rather than the task.

So, a steering doc isn't a knowledge dump. It's a set of guard rails, and every guard rail changes the agent's trajectory. And it's not enough to write things down, you have to write the ***<u>right</u>*** things down.

**<u>The phenomenon of context rot</u>**

LLMs pay less attention to information that sits further back in the context window, a phenomenon called [context rot](https://research.trychroma.com/context-rot). So a bloated steering doc doesn't just waste tokens. It pushes your *actually useful* instructions into the zone where the model is least likely to follow them. The more you add, the less the important parts stick.

**<u>What effective instructions might look like</u>**

The agent can already read your code. It can already search your docs. So, don't restate what it can find. Write what it ***<u>cannot</u>*** know without you telling it.

What belongs:

- ✅ "Start by creating an implementation plan. Do not start coding before the implementation plan is approved."
- ✅ "All customer-facing copywriting changes need legal review, even minor copy edits."
- ✅ "Error handling uses the Result pattern, not Exceptions pattern. This isn't enforced by the linter yet."
- ✅ "We stopped using Library X after a data incident in 2023. Don't recommend it."
- ✅ "The `payments` module is owned by team Z. Always flag changes for review."
- ✅ "Log your ongoing progress into a progress-log.md file."

What doesn't:

- ❌ Restating your project wiki
- ❌ Pasting in your API schema
- ❌ Listing your directory structure

**<u>Keeping it alive</u>**

Steering docs decay fast. If something could become stale within a sprint, it probably belongs in the codebase / knowledgebase instead, where it gets updated as part of the normal workflow. The best steering instructions are **durably true**: team norms, ways of working, historical context, philosophical decisions.


## What I'm still thinking about

The argument is clean enough: agents can search your code, query your docs, and steering documents fill the gap. In theory, full coverage.

But I keep coming back to a messier question. Who maintains this?

Tribal knowledge is called "tribal" for a reason. Distributed, informal, often contradictory between team members. Asking someone to write it all down is asking them to formalise something that resists formalisation. And the unwritten rules from six months ago might not be the unwritten rules today. If nobody updates the steering doc, the agent is following *outdated* tribal knowledge. That might be worse than no context at all.

There's a tempting shortcut: have the AI generate its own context file. But the hard part isn't writing fluent prose about a repository. The hard part is knowing which information is *missing*. That requires understanding the gap, and right now, only humans reliably understand what's unwritten.

Understanding the blind spots tells you *what* to write down, but the subsequent question of *who* writes it and *when* they update it is cultural question, not a technical one.

To me, those are always the hardest questions to tackle.

---

<a name="sources"></a>
1: *Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?* [https://arxiv.org/html/2602.11988v1](https://arxiv.org/html/2602.11988v1)
