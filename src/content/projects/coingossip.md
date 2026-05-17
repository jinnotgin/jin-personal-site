---
slug: coingossip
name: CoinGossip
thread: signals
year: 2018
status: archived
intent: A read on what crypto communities were talking about, not just price action.
stack: [React, Django REST Framework, Redux, Python, NLP]
links: [Archive::https://coingossip.net]
images: [/img/projects/coingossip-main.png::CoinGossip homepage showing cryptocurrency discussion tracking., /img/projects/coingossip-popularity.png::CoinGossip popularity view comparing cryptocurrencies by online attention., /img/projects/coingossip-details.png::CoinGossip detail view with headlines and sentiment signals., /img/projects/coingossip-historical.png::CoinGossip historical trend view for cryptocurrency attention.]
---

## Why it existed

Price charts were everywhere, but crypto chat was diverse and moved quickly. I wanted to see what communities were paying attention to, and whether that attention had any relationship with price action.

## The friction it answered

Most sentiment tools were either too shallow or too expensive, and they often hid the raw signals behind a single score.

## What was built

A Python scraping and aggregation pipeline with trend detection over social chatter, charted against price action.

## What it left behind

CoinGossip was where I learned to program with Python for continuous web scraping at scale. It also pushed me into newer frontend patterns: React, Redux, and API-driven interfaces made it easier to build a richer analytics view than the older server-rendered patterns I had used before.
