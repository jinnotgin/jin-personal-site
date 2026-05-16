import type { Project } from './types'

/**
 * Project archaeology, seeded from the old portfolio and GitHub.
 * Each entry is a receipt, not a brag. Replace copy with Jin's own
 * accounts; the shape (intent / why / friction / built / trace) stays.
 */
export const projects: Project[] = [
  {
    slug: 'promptpal',
    name: 'PromptPal',
    thread: 'applied-ai',
    year: '2023–now',
    status: 'active',
    intent: 'An internal Generative AI product for confidential, organisation-wide LLM access.',
    why: 'Staff needed a safe way to use large language models without leaking confidential data or violating contractual data residency obligations.',
    friction:
      'AI adoption was happening unevenly. Some people were already experimenting, others were blocked by uncertainty, and the organisation needed a sanctioned default that made responsible use easier than shadow use.',
    built:
      'A production internal tool that gives all staff access to LLMs within the organisation’s confidentiality and residency constraints, with workflows that support coding, research, drafting, analysis, and internal knowledge work.',
    trace:
      'Adopted by more than 75% of the organisation, with around 30% using it monthly. More importantly, it normalised AI as part of everyday work without relying on a large formal training push.',
    stack: ['LLMs', 'RAG', 'product operations', 'data residency'],
  },
  {
    slug: 'promptpal-transcribe',
    name: 'PromptPal Transcribe',
    thread: 'applied-ai',
    year: '2026',
    status: 'active',
    intent: 'A focused transcription tool that turns spoken work into usable written material.',
    why: 'Meetings, interviews, voice notes, and working discussions often contain useful detail that disappears because converting speech into structured text is still too much effort.',
    friction:
      'Generic transcription creates text, but not always material that is ready for the next step. The useful workflow is usually capture, clean up, summarise, extract, and route.',
    built:
      'A PromptPal-adjacent tool for capturing audio and shaping the transcript into more useful outputs. The fuller write-up is still being written, but it belongs in the applied-AI thread because it is about turning model capability into a working organisational utility.',
    trace:
      'This is the next small product surface in the PromptPal family: less about showing AI, more about reducing the cost of turning conversation into action.',
    stack: ['speech-to-text', 'LLMs', 'workflow design'],
  },
  {
    slug: 'training-allowance-system',
    name: 'SkillsFuture Mid-Career Training Allowance',
    thread: 'public-platforms',
    year: '2024–2025',
    status: 'active',
    intent:
      'A national platform supporting training allowance claims for mid-career Singaporeans.',
    why: 'The policy intent was clear: support mid-career workers through reskilling. The product challenge was turning that intent into a service that could work across SSG, WSG, GovTech, implementation teams, and real citizen journeys.',
    friction:
      'Different agencies held different policy needs, operational concerns, and definitions of urgency. Without a shared product frame, the platform risked becoming a bundle of competing requirements rather than a coherent service.',
    built:
      'Co-led product development from upstream discovery into delivery: Scope of Work, MVP workshop, gating criteria, scenario mapping, stakeholder alignment, and cross-functional build work with design, engineering, and QA.',
    trace:
      'The platform has served 36,000 mid-career Singaporeans since its 2025 launch. It also laid groundwork for a reusable platform architecture for future scheme updates rather than one-off builds per policy.',
    stack: ['Product discovery', 'policy translation', 'service delivery'],
  },
  {
    slug: 'student-learning-space',
    name: 'Student Learning Space',
    thread: 'public-platforms',
    year: '2020–2023',
    status: 'active',
    intent:
      'Singapore’s national online learning platform for students and teachers.',
    why: 'During COVID-19, online learning infrastructure became a continuity-of-learning requirement, not a nice-to-have product surface.',
    friction:
      'Feature decisions had to hold together policy intent, teacher and student needs, UX behaviour, technical constraints, and QA clarity across nationwide use.',
    built:
      'Shaped product features, contributed to design critiques, led backlog refinement practices, and established behaviour-driven specifications using structured Gherkin scenarios so scope became clear and testable before development.',
    trace:
      'The strongest artifact was not a public demo, but a working practice: clearer specification, tighter feedback loops between design and implementation, and a team that could reason about behaviour before building it.',
    stack: ['Product management', 'BDD', 'Gherkin', 'platform delivery'],
  },
  {
    slug: 'bifrost-caching-plugin',
    name: 'Bifrost default caching plugin',
    thread: 'applied-ai',
    year: '2025',
    status: 'active',
    intent: 'A drop-in plugin that turns on sensible prompt caching by default.',
    why: 'Most teams pay full token price for context they send on every call. The default should be the cheap one.',
    friction:
      'Caching existed but needed per-call wiring. The friction was small enough to ignore and expensive enough to matter at scale.',
    built:
      'A plugin that detects stable context windows and applies caching automatically, with an escape hatch when you need cold reads.',
    trace: 'Open source. The interesting part was the defaults, not the mechanism.',
    stack: ['TypeScript', 'LLM infra'],
    links: [{ label: 'GitHub', href: 'https://github.com/' }],
  },
  {
    slug: 'now-in-singapore',
    name: 'Now In Singapore',
    thread: 'signals',
    year: '2024–now',
    status: 'active',
    intent: 'A curated pulse-check on what is happening across Singapore right now.',
    why: 'People often say there is nothing to do in Singapore, but the real problem is that events, exhibitions, and pop-ups are scattered across too many sites.',
    friction:
      'Discovery required endless searching, duplicate tabs, and raw listings that did not explain what made each event worth attention.',
    built:
      'A responsive web app that gathers event information, uses AI to summarise and categorise it, then lets people filter by time period, location, and event type.',
    trace:
      'A personal civic utility, but better understood as sensemaking: collect scattered signals, reduce noise, and make the next decision easier.',
    stack: ['Vue 3', 'Tailwind CSS', 'Gemini', 'GPT', 'Cloudflare R2'],
    links: [{ label: 'Live site', href: 'https://nowinsg.com' }],
    images: [
      {
        src: '/img/projects/nowinsg-desktop.png',
        alt: 'Now In Singapore desktop interface showing curated event listings.',
      },
      {
        src: '/img/projects/nowinsg-mobile.png',
        alt: 'Now In Singapore mobile interface for browsing events on the go.',
      },
    ],
  },
  {
    slug: 'faveats',
    name: 'FavEats',
    thread: 'homegrown',
    year: '2021–2024',
    status: 'archived',
    intent:
      'A progressive web app that recommends favourite food places near the user’s current or selected location.',
    why: 'I kept discovering good food places around Singapore, then forgetting them when I was nearby again.',
    friction:
      'Food apps are good at search and ratings, but less good at answering: what are my own favourite places near here, and are they open?',
    built:
      'A progressive web app using Svelte, Firebase Authentication, Firestore, Tailwind CSS, and a background scraper that collected Burpple wishlist and venue data.',
    trace:
      'Archived in 2024, but it remains a good example of building a small personal system around repeated everyday friction.',
    stack: ['Svelte', 'Firebase', 'Tailwind CSS', 'Cloudflare Pages'],
    images: [
      {
        src: '/img/projects/faveats-main.png',
        alt: 'FavEats interface showing favourite food places.',
      },
      {
        src: '/img/projects/faveats-map-selector.png',
        alt: 'FavEats map selector for finding food near a chosen location.',
      },
    ],
  },
  {
    slug: 'jt-concierge',
    name: 'JT Concierge',
    thread: 'human',
    year: '2012',
    status: 'archived',
    intent:
      'An iOS app for obtaining quotes for automobile services from Insprop.',
    why: 'Automobile service enquiries, including insurance, rentals, limousine bookings, and maintenance, were easier to start when the request flow was structured.',
    friction:
      'Users had to know which service path they needed before asking for help, even when the real need was simply to get a quote.',
    built:
      'A mobile app that guided users through common automobile-service quote requests and routed the enquiry more clearly.',
    trace:
      'An early commercial client-facing mobile project, useful here as evidence of shaping service workflows into a small guided system.',
    stack: ['iOS', 'mobile app', 'service workflow'],
  },
  {
    slug: 'nearly',
    name: 'Nearly Weather Kiosk',
    thread: 'homegrown',
    year: '2016',
    status: 'archived',
    intent:
      'A minimalist kiosk app for hyper-local weather forecast alerts in Singapore.',
    why: 'Singapore’s weather can change sharply by region, and a general forecast is often less useful than a specific nowcast for the area someone is actually in.',
    friction:
      'Useful weather data existed through NEA’s 2 Hour Nowcast via Data.gov.sg, but it needed a clearer glance surface for region-specific alerts.',
    built:
      'A kiosk-style app that surfaced hyper-accurate forecast alerts for selected regions of Singapore using public weather data.',
    trace:
      'Archived personal project from 2016. It belongs with the older homegrown automation work rather than the national-platform thread.',
    stack: ['Data.gov.sg', 'NEA 2 Hour Nowcast', 'kiosk UI'],
  },
  {
    slug: 'coingossip',
    name: 'CoinGossip',
    thread: 'signals',
    year: '2018',
    status: 'archived',
    intent: 'A read on what crypto communities were actually talking about, not just price.',
    why: 'Price charts were everywhere; attention and sentiment were the leading signal and went unmeasured.',
    friction: 'Sentiment tools were either toy-grade or enterprise-priced, with nothing honest in between.',
    built: 'A scraping and aggregation pipeline with trend detection over social chatter, charted against price.',
    trace: 'Taught me to distrust a single metric and to show the workings, not just the conclusion.',
    stack: ['React', 'Django REST Framework', 'Redux', 'Python', 'NLP'],
    links: [{ label: 'Archive', href: 'https://coingossip.net' }],
    images: [
      {
        src: '/img/projects/coingossip-main.png',
        alt: 'CoinGossip homepage showing cryptocurrency discussion tracking.',
      },
      {
        src: '/img/projects/coingossip-popularity.png',
        alt: 'CoinGossip popularity view comparing cryptocurrencies by online attention.',
      },
      {
        src: '/img/projects/coingossip-details.png',
        alt: 'CoinGossip detail view with headlines and sentiment signals.',
      },
      {
        src: '/img/projects/coingossip-historical.png',
        alt: 'CoinGossip historical trend view for cryptocurrency attention.',
      },
    ],
  },
  {
    slug: 'testforge',
    name: 'TestForge',
    thread: 'signals',
    year: '2022',
    status: 'archived',
    intent:
      'A written case study on making software testing signals easier to inspect and act on.',
    why: 'Testing work often produces a lot of output but not always a clear picture of what changed, what failed, and what deserves attention first.',
    friction:
      'When test results are treated as raw pass/fail output, teams still have to do the sensemaking manually: patterns, severity, repetition, and confidence all sit outside the result itself.',
    built:
      'A case-study project exploring how testing artifacts could be shaped into a more useful review surface for product and engineering teams.',
    trace:
      'Kept as a written project rather than a live tool. It belongs in the sensemaking thread because the core problem is turning noisy technical output into judgement-ready signal.',
    stack: ['Testing', 'quality signals', 'case study'],
  },
  {
    slug: 'pete',
    name: 'Pete',
    thread: 'signals',
    year: '2023',
    status: 'archived',
    intent:
      'A written case study on using tooling to make complex information easier to work through.',
    why: 'Some useful tools are less about replacing judgement and more about helping people move through a messy body of information with less cognitive overhead.',
    friction:
      'When information is scattered or unevenly structured, people spend too much effort orienting themselves before they can make a useful decision.',
    built:
      'A case-study project exploring a focused tool surface for organising, inspecting, and acting on information.',
    trace:
      'Kept as a written case study until the fuller project notes are written.',
    stack: ['Case study', 'sensemaking', 'workflow tooling'],
  },
  {
    slug: 'skills-framework-explorer',
    name: 'Skills Framework Explorer',
    thread: 'signals',
    year: '2026',
    status: 'active',
    intent: 'A tool for exploring Singapore’s Skills Framework as a navigable skills map.',
    why: 'The skills taxonomy is valuable, but difficult to reason about when it is presented as dense source material rather than an exploratory surface.',
    friction:
      'People need to compare occupations, skills, and adjacent pathways, but static documents make those relationships hard to see.',
    built:
      'A web app that lets users search and explore the Skills Framework interactively, turning a complex national taxonomy into a more usable sensemaking interface.',
    trace:
      'This sits under sensemaking rather than public platforms: the platform is not the national service itself, but a tool for reading and navigating public domain knowledge.',
    stack: ['Web app', 'search', 'taxonomy', 'skills data'],
    links: [
      {
        label: 'Live app',
        href: 'https://job-skills-explorer.web.app/',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/jinnotgin/skills-framework-explorer',
      },
    ],
  },
  {
    slug: 'relatus',
    name: 'Relatus',
    thread: 'human',
    year: '2015',
    status: 'archived',
    intent:
      'A bespoke resource management system for vocational rehabilitation services.',
    why: 'SACS Employment Support Services needed tooling that fit its business operations rather than a generic tracking surface.',
    friction:
      'Resource management, reporting, and analysis are hard to sustain when operational data is scattered or shaped around tools that do not match the service model.',
    built:
      'A bespoke system for client business operations, with reporting and analysis capabilities for resource management.',
    trace:
      'This is less a public artifact than an early human-systems project: software shaped around an organisation’s operational reality.',
    stack: ['Resource management', 'reporting', 'analysis'],
  },
  {
    slug: 'alastair',
    name: 'Alastair',
    thread: 'homegrown',
    year: '2016',
    status: 'archived',
    intent:
      'A private, cloud-less home automation platform for IoT devices and sensors.',
    why: 'Most smart home systems depended on third-party cloud services, which made convenience feel tied to avoidable security and privacy tradeoffs.',
    friction:
      'I wanted a smart home implementation that could control lights, plugs, cooling, presence, occupancy, and camera streaming without handing the core control loop to an external provider.',
    built:
      'A full-stack system across Raspberry Pi, ESP8266 plugs, Yeelight bulbs, IR control, temperature and light sensors, PIR motion sensing, Python watchdog scripts, OpenWRT scripts, LIRC, EventGhost, ARP scans, Bluetooth detection, and a web interface.',
    trace:
      'Completed in March 2016 and archived, but it remains the clearest early marker of the homegrown systems thread: local control, readable source, and a willingness to wire hardware, scripts, and realtime sensor algorithms together.',
    stack: ['Python', 'Raspberry Pi', 'OpenWRT', 'IoT', 'sensor algorithms'],
    links: [{ label: 'GitHub', href: 'https://github.com/jinnotgin/alastair' }],
    images: [
      {
        src: '/img/projects/alastair-illustration.jpeg',
        alt: 'Alastair system illustration showing a private home automation setup.',
      },
      {
        src: '/img/projects/alastair-main.png',
        alt: 'Alastair interface for monitoring and controlling home devices.',
      },
    ],
  },
  {
    slug: 'smart-mirror',
    name: 'Smart Mirror',
    thread: 'homegrown',
    year: '2017',
    status: 'archived',
    intent:
      'An easily deployable web dashboard for smart mirror and kiosk installations.',
    why: 'The popularity of Raspberry Pi and IoT hardware made smart mirrors newly accessible, but most builds still needed a simple front-end surface for everyday information.',
    friction:
      'A useful glance display should show time, weather, headlines, and market prices without requiring a heavy application stack or device-specific implementation.',
    built:
      'A single-page web application that consumed JSON APIs for weather, news, stock prices, and cryptocurrency prices, designed to run on lightweight devices across different operating systems and CPU architectures.',
    trace: 'Completed in December 2017 and archived.',
    stack: ['HTML', 'JavaScript', 'SPA', 'JSON APIs'],
    images: [
      {
        src: '/img/projects/smartmirror-hardware.jpeg',
        alt: 'Smart Mirror hardware build with a display behind mirror glass.',
      },
      {
        src: '/img/projects/smartmirror-main.png',
        alt: 'Smart Mirror dashboard showing glanceable date, weather, news, and market information.',
      },
    ],
  },
  {
    slug: 'the-resistance',
    name: 'The Resistance',
    thread: 'homegrown',
    year: '2013',
    status: 'archived',
    intent:
      'A mobile web version of The Resistance that preserved the in-person board-game feel.',
    why: 'I loved playing The Resistance, but needing the physical cards made impromptu sessions harder than they needed to be.',
    friction:
      'The goal was not to replace the table experience. It was to remove the dependency on cards without compromising the original rules or social flow.',
    built:
      'A jQuery Mobile web app that let a single shared phone handle role assignment and game mechanics while players stayed physically together.',
    trace: 'Completed in December 2013 and no longer actively maintained.',
    stack: ['jQuery Mobile', 'mobile web'],
    images: [
      {
        src: '/img/projects/theresistance-cards.jpg',
        alt: 'Physical cards from The Resistance board game.',
      },
      {
        src: '/img/projects/theresistance-main.png',
        alt: 'Mobile web interface for playing The Resistance without physical cards.',
      },
    ],
  },
  {
    slug: 'timemoo',
    name: 'TimeMoo',
    thread: 'homegrown',
    year: '2013',
    status: 'archived',
    intent:
      'A chatbot for natural-language timezone conversion.',
    why: 'Timezone conversion is conceptually simple but annoying in practice, especially when people have to reason through offsets manually.',
    friction:
      'Most timezone tools required users to deal with the mechanics of timezones instead of asking in ordinary language.',
    built:
      'A chatbot that processed natural-language queries and returned timezone conversions without making users handle the underlying complexity.',
    trace:
      'An early NLP-flavoured personal project, archived as part of the older maker history.',
    stack: ['NLP', 'chatbot', 'timezone conversion'],
  },
]

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug)
