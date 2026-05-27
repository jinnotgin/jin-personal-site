<script setup lang="ts">
import { journey } from '@/data/journey'
import { threadById } from '@/data/threads'
</script>

<template>
  <div class="shell shell--reading journey-shell">
    <div class="banner" aria-hidden="true"></div>

    <header class="page-head">
      <h1>My journey so far.</h1>
      <p class="lede">
        I started by building small tools around problems I could see in front
        of me. Over time, the work grew into larger products, public platforms,
        AI adoption, and the human side of getting change to actually stick.
      </p>
    </header>

    <ol class="timeline">
      <li v-for="j in journey" :key="j.id" class="timeline-item">
        <span :id="j.id" class="anchor"></span>
        <div class="when">
          <span class="period">{{ j.period }}</span>
        </div>
        <div class="what">
          <h2>{{ j.role }}</h2>
          <p class="org">{{ j.org }}</p>
          <div v-if="Array.isArray(j.summary)" class="summary">
            <p v-for="paragraph in j.summary" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
          <p v-else class="summary">{{ j.summary }}</p>
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
.journey-shell {
  max-width: 54rem;
}
.banner {
  height: clamp(7rem, 16vw, 12rem);
  margin-bottom: 2.5rem;
  border-radius: var(--radius-lg);
  background-image: url('/img/journey-vignette.webp'),
    linear-gradient(
      195deg,
      var(--color-sage-deep) 0%,
      var(--color-sage) 50%,
      var(--color-paper-raised) 100%
    );
  background-size: cover, cover;
  background-position: center;
  border: 1px solid var(--color-hairline);
}
.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
}
.timeline > li {
  position: relative;
  display: grid;
  grid-template-columns: 10.75rem minmax(0, 1fr);
  gap: 2rem;
  padding: 2.25rem 0;
  border-top: 1px solid var(--color-hairline);
}
.anchor {
  position: absolute;
  top: -80px;
  visibility: hidden;
  pointer-events: none;
}
.timeline > li:last-child {
  border-bottom: 1px solid var(--color-hairline);
}
.period {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-moss-deep);
  display: inline-block;
  padding-top: 0.4rem;
  white-space: nowrap;
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
.summary p {
  margin: 0;
}
.summary p + p {
  margin-top: 0.85rem;
}
.threads {
  list-style: none;
  margin: 1.15rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 0.75rem;
}
.threads li {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-ink-soft);
  background: transparent;
  padding: 0;
}
.threads li::before {
  content: '';
  width: 0.44rem;
  height: 0.44rem;
  border-radius: 99px;
  background: var(--color-signal);
  box-shadow: inset 0 0 0 1px oklch(0.424 0.078 152 / 0.2);
}
@media (max-width: 640px) {
  .timeline > li {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  .period {
    padding-top: 0;
  }
}
</style>
