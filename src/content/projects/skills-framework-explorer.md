---
slug: skills-framework-explorer
name: Skills Framework Explorer
thread: signals
year: 2026
status: active
intent: A tool for comparing job-role skills and exploring Singapore's Skills Framework as a navigable skills map.
stack: [Web app, search, taxonomy, skills data]
links: [Live app::https://job-skills-explorer.web.app/, GitHub::https://github.com/jinnotgin/skills-framework-explorer]
images: [/img/projects/skills-framework-explorer-pic2.png::Skills Framework Explorer interface comparing occupations and skill relationships.]
---

## Why it existed

The Skills Framework data is useful, but hard to explore when it is presented as dense source material.

## The friction it answered

People need to compare occupations, skills, and nearby pathways. Static documents make those relationships hard to see, especially when the question is not one job role in isolation but how two roles differ, or what the full skills universe looks like for a job family or industry.

## What was built

A web app that lets users search and explore the Skills Framework interactively. It supports comparing the skills required by two job roles, and browsing the wider universe of skills linked to a selected occupation, job family, or industry. That makes it useful not only for individual career exploration, but also for HR planning and workforce capability mapping.

## What it left behind

This project showed how LLMs can help with data visualisation when the source material is too large to hold in your head. The challenge was working around context-window limits while using AI coding tools to inspect the data, understand relationships, and build faster. It became a concrete example of AI-assisted development: using AI not just to write code, but to move from dataset, to model, to interface, to usable tool in a shorter loop.
