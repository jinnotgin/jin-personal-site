<script setup lang="ts">
import { computed, ref } from 'vue'
import { threads } from '@/data/threads'
import { projectBySlug } from '@/data/workbench'
import { postsBySlugs } from '@/lib/markdown'
import { journey } from '@/data/journey'
import type { ThreadId } from '@/data/types'

const CX = 50
const CY = 50
const RX = 38
const RY = 30

const selected = ref<ThreadId>(threads[0]!.id)

const nodes = computed(() =>
  threads.map((t) => {
    const rad = (t.angle * Math.PI) / 180
    return {
      ...t,
      x: CX + RX * Math.cos(rad),
      y: CY + RY * Math.sin(rad),
    }
  }),
)

const active = computed(() => threads.find((t) => t.id === selected.value)!)

const trail = computed(() => {
  const t = active.value
  return {
    projects: t.projects
      .map((s) => projectBySlug(s))
      .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    writing: postsBySlugs(t.writing),
    journey: journey.filter((j) => t.journey.includes(j.id)),
    external: t.external ?? [],
  }
})

function curve(x: number, y: number): string {
  const mx = (CX + x) / 2
  const my = (CY + y) / 2 - 7
  return `M ${CX} ${CY} Q ${mx} ${my} ${x} ${y}`
}
</script>

<template>
  <section class="map" aria-labelledby="map-heading">
    <h2 id="map-heading" class="sr-only">Recurring threads</h2>

    <!-- Constellation: decorative wires + identity, real buttons over it -->
    <div class="field">
      <svg
        class="wires"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          v-for="n in nodes"
          :key="n.id"
          :d="curve(n.x, n.y)"
          class="wire"
          :class="{ lit: n.id === selected }"
        />
      </svg>

      <div class="centre" aria-hidden="true">
        <span class="centre-name">Jin</span>
        <span class="centre-sub">Applied innovation</span>
      </div>

      <div class="node-layer">
        <button
          v-for="n in nodes"
          :key="n.id"
          class="node"
          :class="{ active: n.id === selected }"
          :style="{ left: n.x + '%', top: n.y + '%' }"
          :aria-pressed="n.id === selected"
          @click="selected = n.id"
          @mouseenter="selected = n.id"
          @focus="selected = n.id"
        >
          <span class="node-dot" aria-hidden="true"></span>
          <span class="node-label">{{ n.label }}</span>
        </button>
      </div>
    </div>

    <!-- Stacked index: same threads, source of truth on narrow screens -->
    <div class="stacked">
      <button
        v-for="t in threads"
        :key="t.id"
        class="stack-item"
        :aria-pressed="t.id === selected"
        @click="selected = t.id"
      >
        <span class="stack-label">{{ t.label }}</span>
        <span class="stack-line">{{ t.line }}</span>
      </button>
    </div>

    <!-- The trail: evidence for the selected thread -->
    <div
      class="trail"
      role="region"
      aria-live="polite"
      :aria-label="`Trail for ${active.label}`"
    >
      <header class="trail-head">
        <p class="eyebrow">Thread</p>
        <h3>{{ active.label }}</h3>
        <p class="trail-blurb measure">{{ active.blurb }}</p>
      </header>

      <div class="trail-grid">
        <div v-if="trail.projects.length" class="trail-col">
          <p class="col-title">In the Workbench</p>
          <ul>
            <li v-for="p in trail.projects" :key="p.slug">
              <RouterLink :to="`/workbench/${p.slug}`" class="trail-link">
                {{ p.name }}
              </RouterLink>
              <span class="status" :class="`status--${p.status}`">{{
                p.status
              }}</span>
              <span class="trail-note">{{ p.intent }}</span>
            </li>
          </ul>
        </div>

        <div v-if="trail.writing.length" class="trail-col">
          <p class="col-title">Writing</p>
          <ul>
            <li v-for="w in trail.writing" :key="w.slug">
              <RouterLink :to="`/writing/${w.slug}`" class="trail-link">
                {{ w.title }}
              </RouterLink>
              <span class="trail-note">{{ w.excerpt }}</span>
            </li>
          </ul>
        </div>

        <div v-if="trail.journey.length" class="trail-col">
          <p class="col-title">In the Journey</p>
          <ul>
            <li v-for="j in trail.journey" :key="j.id">
              <RouterLink to="/journey" class="trail-link">{{
                j.role
              }}</RouterLink>
              <span class="trail-note">{{ j.period }} · {{ j.org }}</span>
            </li>
          </ul>
        </div>

        <div v-if="trail.external.length" class="trail-col">
          <p class="col-title">Elsewhere</p>
          <ul>
            <li v-for="e in trail.external" :key="e.href">
              <a
                :href="e.href"
                class="trail-link"
                target="_blank"
                rel="noopener"
                >{{ e.label }} ↗</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.map {
  margin-top: clamp(2rem, 5vw, 4rem);
}

/* ---------- base / narrow: stacked index is the truth ---------- */
.field {
  display: none;
}

.stacked {
  display: grid;
  border-top: 1px solid var(--color-hairline);
}
.stack-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
  padding: 1.15rem 0.25rem;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--color-hairline);
  cursor: pointer;
  font: inherit;
  color: var(--color-ink);
  transition: background 0.16s var(--ease-out-quint);
}
.stack-item[aria-pressed='true'] {
  background: var(--color-sage);
}
.stack-item[aria-pressed='true'] .stack-label {
  color: var(--color-moss-deep);
}
.stack-label {
  font-size: var(--text-lg);
  font-weight: 700;
}
.stack-line {
  font-size: var(--text-sm);
  color: var(--color-ink-soft);
}

/* ---------- trail (all sizes) ---------- */
.trail {
  margin-top: clamp(2rem, 5vw, 4rem);
  padding-top: 2rem;
  border-top: 1px solid var(--color-hairline);
}
.trail-head h3 {
  font-size: var(--text-2xl);
  margin: 0.3rem 0 0;
}
.trail-blurb {
  margin: 0.9rem 0 0;
  color: var(--color-ink-soft);
  font-size: var(--text-lg);
}
.trail-grid {
  margin-top: 2.25rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 2rem 2.5rem;
}
.col-title {
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-moss-deep);
  margin: 0 0 0.9rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-hairline);
}
.trail-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.15rem;
}
.trail-col li {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.trail-link {
  font-weight: 600;
  color: var(--color-river-deep);
  text-decoration: none;
  width: fit-content;
  border-bottom: 1.5px solid oklch(0.52 0.078 222 / 0.35);
}
.trail-link:hover {
  border-bottom-color: currentColor;
}
.trail-note {
  font-size: var(--text-sm);
  color: var(--color-ink-faint);
  line-height: 1.5;
}
.trail-col .status {
  font-size: 0.72rem;
}

/* ---------- wide: the constellation appears ---------- */
@media (min-width: 880px) {
  .stacked {
    display: none;
  }
  .field {
    display: block;
    position: relative;
    width: 100%;
    aspect-ratio: 1.7 / 1;
    margin: 1rem 0 0;
  }

  .wires {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .wire {
    fill: none;
    stroke: var(--color-sage-deep);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    transition:
      stroke 0.4s var(--ease-out-quint),
      stroke-width 0.4s var(--ease-out-quint);
  }
  .wire.lit {
    stroke: var(--color-moss);
    stroke-width: 2;
  }

  .centre {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .centre-name {
    font-size: clamp(2.6rem, 4vw, 3.8rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--color-ink);
    line-height: 1;
  }
  .centre-sub {
    margin-top: 0.4rem;
    font-size: var(--text-xs);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-ink-faint);
  }

  .node-layer {
    position: absolute;
    inset: 0;
  }
  .node {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.55rem;
    width: 10rem;
    background: none;
    border: 0;
    cursor: pointer;
    font: inherit;
    color: var(--color-ink-soft);
  }
  .node-dot {
    width: 14px;
    height: 14px;
    border-radius: 99px;
    background: var(--color-paper);
    border: 2px solid var(--color-sage-deep);
    box-shadow: 0 0 0 7px var(--color-paper);
    transition:
      border-color 0.3s var(--ease-out-quint),
      background 0.3s var(--ease-out-quint),
      transform 0.3s var(--ease-out-quint);
  }
  .node-label {
    font-size: var(--text-sm);
    font-weight: 600;
    line-height: 1.3;
    transition: color 0.2s var(--ease-out-quint);
  }
  .node:hover .node-dot,
  .node:focus-visible .node-dot {
    border-color: var(--color-moss);
  }
  .node.active .node-dot {
    background: var(--color-moss);
    border-color: var(--color-moss);
    transform: scale(1.18);
  }
  .node.active .node-label {
    color: var(--color-ink);
  }
}
</style>
