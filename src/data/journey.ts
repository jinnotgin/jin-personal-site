import type { JourneyEntry } from './types'

/**
 * Career timeline and older context. These are evidence for the thread map,
 * including work that cannot be shown as a public tool.
 */
export const journey: JourneyEntry[] = [
  {
    id: 'applied-innovation-lead',
    period: 'Jun 2023 — now',
    role: 'Applied Innovation Lead, Corporate Strategy & AI',
    org: 'Ufinity, Singapore',
    summary:
      'Work sits inside Corporate Strategy, spanning three areas: enabling the organisation, tracking the external environment, and validating what is worth adopting. On the enabling aspect, I built and operate PromptPal, an internal Generative AI product giving staff access to LLMs while preserving data confidentiality and residency. On the external aspect, I map emerging capabilities (RAG, agents, voice interfaces, AI-assisted research) against business viability and proof of value before recommending adoption. On the organisational aspect, it involves AI readiness, change management, and anticipating the second and third-order effects that teams will face.',
    threads: ['applied-ai'],
  },
  {
    id: 'signals-and-research',
    period: 'Jan 2012 — now',
    role: 'Side projects in signals and research',
    org: 'Independent',
    summary:
      'Maintain a small practice of learning new technology through shipped experiments: Now In Singapore for AI-assisted event discovery, and Skills Framework Explorer for navigating a complex national skills taxonomy with clearer search, synthesis, and exploration paths.',
    threads: ['signals'],
  },
  {
    id: 'training-allowance-system',
    period: 'Mar 2024 — Oct 2025',
    role: 'Product Co-Lead, SkillsFuture Training Allowance System',
    org: 'SSG, WSG, GovTech',
    summary:
      'Co-led product development of the SkillsFuture Training Allowance System, a national platform serving mid-career Singaporeans. Owned upstream discovery, authored the Scope of Work, facilitated the MVP workshop, established gating criteria, and carried that understanding into delivery with designers, developers, QA, and agency stakeholders. The hardest work was aligning policy requirements that pulled features in different directions, then reframing decisions around citizen outcomes and reusable platform architecture.',
    threads: ['public-platforms'],
  },
  {
    id: 'student-learning-space',
    period: 'Mar 2020 — May 2023',
    role: 'Product Co-Lead, MOE Student Learning Space',
    org: 'MOE, GovTech',
    summary:
      'Shaped features for Singapore’s national online learning platform during a period when it became critical infrastructure for continuity of learning. Progressed from senior contributor to team lead, built shared practices in behaviour-driven specification, partnered closely with UX/UI and technical leads, and used structured scenarios to reduce ambiguity between policy intent, design behaviour, development, and QA.',
    threads: ['public-platforms'],
  },
  {
    id: 'digital-village-developer',
    period: 'Oct 2019 — Mar 2020',
    role: 'Full Stack Developer',
    org: 'KPMG Singapore - Digital Village',
    summary:
      'Built iOS and Android mobile applications for BMW Vantage, a blockchain-based rewards programme by BMW South Korea, using React Native, Ethereum, and Node.js microservices. Also prototyped an Expo mobile app that could dynamically update its visual system from InVision Design System Manager tokens, an early exploration into reusable design consistency across products.',
    threads: ['human'],
  },
  {
    id: 'audit-modernisation',
    period: 'Jul 2018 — Dec 2019',
    role: 'Associate Product Manager',
    org: 'KPMG Singapore - Digital Village',
    summary:
      'Worked on modernising KPMG Audit’s legacy enterprise software, replacing end-of-life systems with bespoke tools for budgeting, resourcing, and performance tracking across the audit engagement lifecycle. The work joined product intent, stakeholder needs, design thinking, and agile delivery in a complex enterprise environment.',
    threads: ['human'],
  },
  {
    id: 'forensic-analytics',
    period: 'May 2017 — Jul 2017',
    role: 'Summer Internship, Forensic Services and Digital Village',
    org: 'KPMG Singapore',
    summary:
      'Analysed employee working environments to estimate true working hours and identify potential lost revenue. Built ETL and automation scripts over SQL data sources including Oracle and SAP, designed Tableau visualisations, and supported anomaly detection work for clients.',
    threads: ['signals'],
  },
  {
    id: 'mindef-procurement',
    period: 'May 2013 — Apr 2014',
    role: 'Procurement Controller',
    org: 'Ministry of Defence Singapore',
    summary:
      'Built an Excel VBA purchase-order tracking system for ammunition transfers, vehicle purchases, and military camp maintenance work. Automated report generation around those business processes, an early version of the pattern that would keep returning: remove manual coordination work with a small, legible system.',
    threads: ['human'],
  },
  {
    id: 'ncs-deployment',
    period: 'Dec 2011 — Mar 2012',
    role: 'Deployment Engineer',
    org: 'NCS Singapore',
    summary:
      'Performed software and hardware upgrades for MOE schools and used robotic process automation to reduce manual intervention in upgrade workflows. The work was short, but it formed an early instinct for deployment repeatability and operational tooling.',
    threads: ['human'],
  },
]
