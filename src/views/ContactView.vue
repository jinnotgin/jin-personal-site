<script setup lang="ts">
import { site } from '@/data/site'

const channels = [
  {
    label: 'Email',
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    note: 'Best for anything real. I read it.',
  },
  {
    label: 'LinkedIn',
    value: 'in/linjin',
    href: site.contact.links.find((l) => l.label === 'LinkedIn')!.href,
    note: 'Formal identity, slower replies.',
  },
  {
    label: 'GitHub',
    value: 'github.com/jin',
    href: site.contact.links.find((l) => l.label === 'GitHub')!.href,
    note: 'The maker work, in progress and in the open.',
  },
]
</script>

<template>
  <div class="shell shell--reading">
    <header class="page-head">
      <h1>Three plain ways through.</h1>
      <p class="lede">
        If you are weighing whether to work together, email is the honest
        channel. Tell me the friction you are looking at.
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

    <p class="sign note-serif">
      — {{ site.formalName }}, where formal identity needs it. Jin everywhere
      else.
    </p>
  </div>
</template>

<style scoped>
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
