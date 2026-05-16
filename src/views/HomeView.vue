<script setup lang="ts">
import { site } from '@/data/site'
import ConstellationMap from '@/components/ConstellationMap.vue'
import { listPosts, formatDate } from '@/lib/markdown'

const latest = listPosts().slice(0, 3)
</script>

<template>
  <div class="shell home">
    <section class="intro">
      <p class="eyebrow">Now · {{ site.nowUpdated }}</p>
      <p class="positioning measure">{{ site.positioning }}</p>
      <ol class="now">
        <li v-for="(item, i) in site.now" :key="i">
          <span class="now-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <span>{{ item }}</span>
        </li>
      </ol>
    </section>

    <section class="map-intro">
      <p class="eyebrow">The map</p>
      <h2>
        Not a resume. The threads I keep returning to, and the receipts for
        each.
      </h2>
      <p class="measure hint">
        Pick a thread to follow it into the work, the writing, and the roles
        where it shows up.
      </p>
    </section>

    <ConstellationMap />

    <section class="latest">
      <div class="latest-head">
        <h2>From the writing</h2>
        <RouterLink to="/writing" class="link">All writing →</RouterLink>
      </div>
      <ul>
        <li v-for="p in latest" :key="p.slug">
          <RouterLink :to="`/writing/${p.slug}`" class="latest-link">
            <span class="latest-meta"
              >{{ formatDate(p.date) }} · {{ p.category }}</span
            >
            <span class="latest-title">{{ p.title }}</span>
            <span class="latest-excerpt">{{ p.excerpt }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.intro {
  max-width: 60rem;
}
.positioning {
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.32;
  margin: 1.1rem 0 0;
  color: var(--color-ink);
}
.now {
  list-style: none;
  margin: 2.5rem 0 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  max-width: 54rem;
}
.now li {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1rem;
  font-size: var(--text-lg);
  color: var(--color-ink-soft);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-hairline);
}
.now li:last-child {
  border-bottom: 0;
}
.now-index {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-moss);
  padding-top: 0.35rem;
}

.map-intro {
  margin-top: clamp(4rem, 9vw, 7rem);
}
.map-intro h2 {
  font-size: var(--text-3xl);
  max-width: 20ch;
  margin: 0.6rem 0 0;
}
.hint {
  margin: 1rem 0 0;
  color: var(--color-ink-faint);
}

.latest {
  margin-top: clamp(4rem, 9vw, 7rem);
}
.latest-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-hairline);
}
.latest-head h2 {
  font-size: var(--text-xl);
}
.latest ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.latest li {
  border-bottom: 1px solid var(--color-hairline);
}
.latest-link {
  display: grid;
  gap: 0.35rem;
  padding: 1.5rem 0;
  text-decoration: none;
  color: var(--color-ink);
}
.latest-link:hover .latest-title {
  color: var(--color-moss-deep);
}
.latest-meta {
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
}
.latest-title {
  font-size: var(--text-xl);
  font-weight: 700;
  transition: color 0.18s var(--ease-out-quint);
}
.latest-excerpt {
  color: var(--color-ink-soft);
  max-width: 62ch;
}
</style>
