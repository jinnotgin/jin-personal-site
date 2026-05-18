<script setup lang="ts">
import { site } from '@/data/site'

const channels = [
  {
    label: 'Email',
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    note: 'Easiest way to reach me!',
  },
  {
    label: 'LinkedIn',
    value: 'in/jin-sg',
    href: site.contact.links.find((l) => l.label === 'LinkedIn')!.href,
    note: 'Not super active here, but happy to connect with anyone interested in my work or background.',
  },
  {
    label: 'GitHub',
    value: 'github/jinnotgin',
    href: site.contact.links.find((l) => l.label === 'GitHub')!.href,
    note: 'Where I post open source projects and experiments. Also the best way to see what I’m up to these days.',
  },
]
</script>

<template>
  <div class="shell shell--reading">
    <!-- <div class="banner" aria-hidden="true"></div> -->

    <header class="page-head">
      <h1>Get in touch.</h1>
      <p class="lede">
        If something here resonates, reach out. Always glad to start a
        conversation, no agenda needed.
      </p>
    </header>

    <ul class="channels">
      <li v-for="c in channels" :key="c.label">
        <a
          :href="c.href"
          class="channel"
          :target="c.href.startsWith('http') ? '_blank' : undefined"
          :rel="c.href.startsWith('http') ? 'noopener me' : undefined"
        >
          <span class="c-label">{{ c.label }}</span>
          <span class="c-value">{{ c.value }}</span>
          <span class="c-note">{{ c.note }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.banner {
  height: clamp(7rem, 16vw, 12rem);
  margin-bottom: 2.5rem;
  border-radius: var(--radius-lg);
  background-image: url('/img/contact-vignette-v2.webp'),
    linear-gradient(
      155deg,
      var(--color-paper-raised) 0%,
      var(--color-sage) 50%,
      var(--color-sage-deep) 100%
    );
  background-size: cover, cover;
  background-position: center;
  border: 1px solid var(--color-hairline);
}
.channels {
  list-style: none;
  margin: 0;
  padding: 0;
}
.channels li {
  border-top: 1px solid var(--color-hairline);
}
.channels li:last-child {
  border-bottom: 1px solid var(--color-hairline);
}
.channel {
  display: grid;
  grid-template-columns: 8rem 1fr;
  grid-template-areas:
    'label value'
    'label note';
  gap: 0.2rem 2rem;
  padding: 1.75rem 0.25rem;
  text-decoration: none;
  color: var(--color-ink);
  transition: background 0.16s var(--ease-out-quint);
}
.channel:hover {
  background: var(--color-sage);
}
.c-label {
  grid-area: label;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
  padding-top: 0.35rem;
}
.c-value {
  grid-area: value;
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-river-deep);
}
.c-note {
  grid-area: note;
  color: var(--color-ink-soft);
}
.sign {
  margin-top: 3rem;
  font-size: var(--text-lg);
}
@media (max-width: 560px) {
  .channel {
    grid-template-columns: 1fr;
    grid-template-areas:
      'label'
      'value'
      'note';
    gap: 0.3rem;
  }
}
</style>
