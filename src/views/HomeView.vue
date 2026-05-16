<script setup lang="ts">
import { site } from '@/data/site'
import ConstellationMap from '@/components/ConstellationMap.vue'
import { listPosts, formatDate } from '@/lib/markdown'

const latest = listPosts().slice(0, 3)
</script>

<template>
  <div class="shell home">
    <section class="intro">
      <div class="intro-copy">
        <p class="eyebrow">Now · {{ site.nowUpdated }}</p>
        <p class="positioning measure">
          I track emerging shifts, then build with them to understand what they
          change. Right now, that means AI.
        </p>
      </div>

      <figure class="portrait">
        <img
          src="/img/jin-portrait-800.jpg"
          srcset="
            /img/jin-portrait-800.jpg   800w,
            /img/jin-portrait-1400.jpg 1400w
          "
          sizes="(min-width: 760px) 24rem, calc(100vw - 2.5rem)"
          alt="Jin outdoors, smiling in a denim shirt."
        />
      </figure>

      <ol class="now">
        <li>
          <span class="now-index">01</span>
          <span>
            Examining how AI changes the way software products are delivered,
            from discovery to shipping and iteration.
          </span>
        </li>
        <li>
          <span class="now-index">02</span>
          <span>
            Prototyping AI-enabled product features to see where they help
            users, where they confuse them, and what trust requires.
          </span>
        </li>
        <li>
          <span class="now-index">03</span>
          <span>
            Sharing what I’m learning through notes, prototypes, and working
            models.
          </span>
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
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1.75rem, 5vw, 3rem);
  align-items: end;
  max-width: 72rem;
}
.intro-copy {
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
.portrait {
  margin: 0;
  width: min(100%, 32rem);
}
.portrait img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: 50% 48%;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-hairline);
  filter: saturate(0.9) contrast(0.96);
}
.now {
  list-style: none;
  margin: 0;
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

@media (min-width: 760px) {
  .intro {
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 24rem);
    gap: clamp(2rem, 5vw, 4.5rem);
  }
  .intro-copy,
  .now {
    grid-column: 1;
  }
  .portrait {
    grid-column: 2;
    grid-row: 1 / span 2;
    width: 100%;
    align-self: stretch;
  }
  .portrait img {
    height: 100%;
    min-height: 26rem;
    aspect-ratio: auto;
    object-position: 54% 50%;
  }
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
