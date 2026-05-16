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
              I track emerging shifts, then build to understand them.
              <span class="hero-turn"
                >Right now, that means <span class="hero-anchor">AI.</span></span
              >
            </h1>

            <ol class="hero-spine">
              <li class="spine-move" tabindex="0">
                <span class="spine-index" aria-hidden="true">01</span>
                <p class="spine-line">
                  <span class="spine-verb">Track</span> emerging shifts early,
                  while they are still ambiguous.
                </p>
                <p class="spine-more">
                  <span
                    >Right now: where AI is actually changing how products get
                    made.</span
                  >
                </p>
              </li>
              <li class="spine-move" tabindex="0">
                <span class="spine-index" aria-hidden="true">02</span>
                <p class="spine-line">
                  <span class="spine-verb">Build</span> tools and prototypes
                  with them, to learn what they really change.
                </p>
                <p class="spine-more">
                  <span
                    >Working models in the open that test an idea
                    cheaply.</span
                  >
                </p>
              </li>
              <li class="spine-move" tabindex="0">
                <span class="spine-index" aria-hidden="true">03</span>
                <p class="spine-line">
                  <span class="spine-verb">Understand</span> their second and
                  third order effects on teams and organisations.
                </p>
                <p class="spine-more">
                  <span
                    >Adopting change without losing judgement, dignity, or
                    institutional memory.</span
                  >
                </p>
              </li>
            </ol>
          </div>

          <figure class="hero-portrait">
            <img
              src="/img/jin-portrait-800.jpg"
              srcset="
                /img/jin-portrait-800.jpg   800w,
                /img/jin-portrait-1400.jpg 1400w
              "
              sizes="(min-width: 760px) 20.5rem, calc(100vw - 2.5rem)"
              alt="Jin outdoors, smiling in a denim shirt."
            />
          </figure>
        </div>
      </div>
    </section>

    <div class="shell home-rest">
      <section class="map-lead">
        <h2>The threads I keep returning to</h2>
        <p class="map-instruction">
          <span class="map-instruction-mark" aria-hidden="true"></span>
          Pick a thread below to see the writing and experiments behind it.
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
  font-size: clamp(2.15rem, 1.35rem + 3.05vw, 3.85rem);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.026em;
  color: var(--color-forest-ink);
  max-width: 24ch;
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

.hero-spine {
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 62ch;
  display: flex;
  flex-direction: column;
}
.spine-move {
  display: grid;
  grid-template-columns: 2.8rem 1fr;
  column-gap: clamp(0.9rem, 2vw, 1.4rem);
  padding: clamp(0.85rem, 2vw, 1.15rem) 0;
  border-top: 1px solid oklch(0.93 0.016 100 / 0.13);
  outline: none;
  cursor: default;
}
.spine-move:first-child {
  border-top: 0;
  padding-top: 0;
}
.spine-index {
  grid-column: 1;
  justify-self: start;
  padding-top: 0.42rem;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1;
  color: oklch(0.74 0.03 130 / 0.55);
  transition: color 0.4s var(--ease-out-quint);
}
.spine-line {
  grid-column: 2;
  margin: 0;
  font-size: var(--text-lg);
  line-height: 1.5;
  color: oklch(0.93 0.016 100 / 0.82);
  text-wrap: pretty;
}
.spine-verb {
  font-family: var(--font-display);
  font-size: 1.18em;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-signal);
}
.spine-more {
  grid-column: 2;
  margin: 0;
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 0.5s var(--ease-out-expo),
    opacity 0.4s var(--ease-out-quint);
}
.spine-more > span {
  display: block;
  position: relative;
  overflow: hidden;
  min-height: 0;
  padding-left: 1.3rem;
  font-size: var(--text-base);
  line-height: 1.5;
  color: var(--color-forest-soft);
}
.spine-more > span::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-signal);
}
.spine-move:hover .spine-more,
.spine-move:focus-visible .spine-more {
  grid-template-rows: 1fr;
  opacity: 1;
  margin-top: 0.55rem;
}
.spine-move:hover .spine-index,
.spine-move:focus-visible .spine-index {
  color: var(--color-signal);
}
.spine-move:focus-visible {
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 2px oklch(0.7 0.088 122 / 0.55);
}

.hero-portrait {
  margin: 0;
  background: var(--color-moss-deep);
  border-radius: var(--radius-md);
  overflow: hidden;
  width: min(100%, 20.5rem);
  align-self: start;
}
.hero-portrait::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    205deg,
    oklch(0.302 0.038 158 / 0.12),
    oklch(0.424 0.078 152 / 0.32)
  );
  opacity: 1;
  transition: opacity 0.55s var(--ease-out-quint);
  pointer-events: none;
}
.hero-portrait {
  position: relative;
}
.hero-portrait img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: 54% 46%;
  filter: saturate(0.72) brightness(1.04) contrast(0.99);
  transition: filter 0.55s var(--ease-out-quint);
}
.hero-portrait:hover img,
.hero-portrait:focus-within img {
  filter: saturate(1) brightness(1) contrast(1);
}
.hero-portrait:hover::after,
.hero-portrait:focus-within::after {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce), (hover: none) {
  .spine-more {
    grid-template-rows: 1fr;
    opacity: 1;
    margin-top: 0.55rem;
  }
}
@media (hover: none) {
  .hero-portrait img {
    filter: none;
  }
  .hero-portrait::after {
    opacity: 0;
  }
}

@media (min-width: 760px) {
  .hero-body {
    grid-template-columns: minmax(0, 1fr) minmax(15rem, 20.5rem);
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
