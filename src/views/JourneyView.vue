<script setup lang="ts">
import { journey } from '@/data/journey'
import { threadById } from '@/data/threads'
</script>

<template>
  <div class="shell shell--reading">
    <header class="page-head">
      <h1>Less a ladder. More the terrain worked in.</h1>
      <p class="lede">
        The dates matter less than the through-line: noticing friction in
        systems, technical and human, and building or facilitating the thing
        that removes it.
      </p>
    </header>

    <ol class="timeline">
      <li v-for="j in journey" :key="j.id" :id="j.id">
        <div class="when">
          <span class="period">{{ j.period }}</span>
        </div>
        <div class="what">
          <h2>{{ j.role }}</h2>
          <p class="org">{{ j.org }}</p>
          <p class="summary">{{ j.summary }}</p>
          <ul class="threads">
            <li v-for="tid in j.threads" :key="tid">
              {{ threadById(tid)?.label }}
            </li>
          </ul>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
}
.timeline li {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 2rem;
  padding: 2.25rem 0;
  border-top: 1px solid var(--color-hairline);
}
.timeline li:last-child {
  border-bottom: 1px solid var(--color-hairline);
}
.period {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-moss-deep);
  display: inline-block;
  padding-top: 0.4rem;
}
.what h2 {
  font-size: var(--text-2xl);
  margin: 0;
}
.org {
  margin: 0.25rem 0 1rem;
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
}
.summary {
  margin: 0;
  font-size: var(--text-lg);
  color: var(--color-ink-soft);
  line-height: 1.6;
  max-width: 60ch;
}
.threads {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.threads li {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-ink-soft);
  background: var(--color-sage);
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-md);
}
@media (max-width: 640px) {
  .timeline li {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  .period {
    padding-top: 0;
  }
}
</style>
