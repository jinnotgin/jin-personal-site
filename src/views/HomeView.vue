<script setup lang="ts">
import { site } from '@/data/site'
import ConstellationMap from '@/components/ConstellationMap.vue'
import { listPosts, formatDate } from '@/lib/markdown'

const latest = listPosts().slice(0, 3)
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-inner shell">
        <p class="hero-kicker">Now, {{ site.nowUpdated }}</p>

        <div class="hero-body">
          <div class="hero-copy">
            <h1 class="hero-statement">
              I track emerging shifts, then build with them.
              <span class="hero-turn"
                >Right now, that means <span class="hero-anchor">AI.</span></span
              >
            </h1>
            <p class="hero-threads">
              Examining how AI changes the way products get delivered,
              prototyping where it helps users and where it loses their trust,
              and sharing what I learn as notes and working models.
            </p>
          </div>

          <figure class="hero-portrait">
            <img
              src="/img/jin-portrait-800.jpg"
              srcset="
                /img/jin-portrait-800.jpg   800w,
                /img/jin-portrait-1400.jpg 1400w
              "
              sizes="(min-width: 760px) 20rem, calc(100vw - 2.5rem)"
              alt="Jin outdoors, smiling in a denim shirt."
            />
          </figure>
        </div>
      </div>
    </section>

    <div class="shell home-rest">
      <section class="map-lead">
        <h2>The threads I keep returning to, and where each one led.</h2>
        <p class="map-instruction">
          <span class="map-instruction-mark" aria-hidden="true"></span>
          Pick a thread below. The work, writing, and roles behind it appear
          right after it.
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
  </div>
</template>

<style scoped>
/* ---- Hero: forest-drenched first viewport ---- */
.hero {
  background: var(--color-forest);
  color: var(--color-forest-ink);
  border-bottom: 1px solid oklch(0.302 0.038 158 / 0.5);
  overflow: clip;
}
.hero-inner {
  padding-top: clamp(3.5rem, 8vw, 6.5rem);
  padding-bottom: clamp(3.5rem, 8vw, 6rem);
}

.hero-kicker {
  font-family: var(--font-sans);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-forest-soft);
  margin: 0;
  animation: hero-rise 0.8s var(--ease-out-expo) both;
}

.hero-body {
  margin-top: clamp(1.6rem, 4vw, 2.6rem);
  display: grid;
  gap: clamp(2rem, 5vw, 3rem);
  align-items: stretch;
  animation: hero-rise 0.9s var(--ease-out-expo) 0.08s both;
}
.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(1.4rem, 3vw, 2rem);
  min-width: 0;
}

.hero-statement {
  font-family: var(--font-display);
  font-size: clamp(2.3rem, 1.4rem + 3.4vw, 4.2rem);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.026em;
  color: var(--color-forest-ink);
  max-width: 18ch;
  margin: 0;
  text-wrap: balance;
}
.hero-turn {
  display: block;
  margin-top: 0.1em;
  color: var(--color-forest-soft);
  font-weight: 500;
}
.hero-anchor {
  font-weight: 800;
  font-size: 1.28em;
  letter-spacing: -0.04em;
  color: var(--color-signal);
}

.hero-threads {
  margin: 0;
  max-width: 52ch;
  font-size: var(--text-lg);
  line-height: 1.55;
  color: oklch(0.93 0.016 100 / 0.78);
}

.hero-portrait {
  margin: 0;
  background: var(--color-moss-deep);
  border-radius: var(--radius-md);
  overflow: hidden;
  width: min(100%, 18rem);
  align-self: start;
}
.hero-portrait img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: 54% 46%;
  mix-blend-mode: multiply;
  filter: grayscale(1) brightness(1.18) contrast(1.05);
}

@media (min-width: 760px) {
  .hero-body {
    grid-template-columns: minmax(0, 1fr) minmax(14rem, 18rem);
    gap: clamp(2.5rem, 6vw, 4.5rem);
  }
  .hero-portrait {
    width: 100%;
    align-self: stretch;
  }
  .hero-portrait img {
    height: 100%;
    aspect-ratio: auto;
    min-height: 19rem;
  }
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(1.4rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.map-lead {
  margin-top: 0;
  max-width: 40rem;
}
.map-lead h2 {
  font-size: var(--text-2xl);
  max-width: 22ch;
  margin: 0;
}
.map-instruction {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin: 1rem 0 0;
  font-size: var(--text-base);
  color: var(--color-ink-soft);
}
.map-instruction-mark {
  flex: none;
  align-self: center;
  width: 1.4rem;
  height: 1px;
  background: var(--color-moss);
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
