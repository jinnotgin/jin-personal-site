<script setup lang="ts">
import { computed, ref } from 'vue'
import { threads } from '@/data/threads'
import { projectBySlug } from '@/data/workbench'
import { postsBySlugs } from '@/lib/markdown'
import { journey } from '@/data/journey'
import type { ThreadId } from '@/data/types'

const CX = 50
const CY = 50
const RX = 34
const RY = 31

const selected = ref<ThreadId>(threads[0]!.id)
const touched = ref(false)

function pick(id: ThreadId) {
  selected.value = id
  touched.value = true
}

const nodes = computed(() =>
  threads.map((t) => {
    const rad = (t.angle * Math.PI) / 180
    return {
      ...t,
      x: CX + RX * Math.cos(rad),
      y: CY + RY * Math.sin(rad),
      placement: labelPlacement(CX + RX * Math.cos(rad), CY + RY * Math.sin(rad)),
    }
  }),
)

const active = computed(() => threads.find((t) => t.id === selected.value)!)

const trail = computed(() => {
  const t = active.value
  const projects = t.projects
    .map((s) => projectBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return {
    activeProjects: projects.filter((p) => p.status === 'active'),
    archivedProjects: projects.filter((p) => p.status === 'archived'),
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

function labelPlacement(x: number, y: number): 'top' | 'right' | 'bottom' | 'left' {
  if (y < CY - 18) return 'top'
  if (y > CY + 18) return 'bottom'
  return x > CX ? 'right' : 'left'
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
          :class="[
            `node--${n.placement}`,
            { active: n.id === selected, inviting: !touched && n.id !== selected },
          ]"
          :style="{ left: n.x + '%', top: n.y + '%' }"
          :aria-pressed="n.id === selected"
          @click="pick(n.id)"
          @focus="pick(n.id)"
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
        @click="pick(t.id)"
      >
        <span class="stack-text">
          <span class="stack-label">{{ t.label }}</span>
          <span class="stack-line">{{ t.line }}</span>
        </span>
        <span class="stack-mark" aria-hidden="true">
          {{ t.id === selected ? 'Tracing below' : 'Trace' }}
        </span>
      </button>
    </div>

    <!-- The trail: evidence for the selected thread -->
    <div
      :key="selected"
      class="trail"
      role="region"
      aria-live="polite"
      :aria-label="`Trail for ${active.label}`"
    >
      <header class="trail-head">
        <p class="trail-cue">
          <span class="trail-cue-mark" aria-hidden="true"></span>
          Tracing this thread
        </p>
        <h3>{{ active.label }}</h3>
        <p class="trail-blurb measure">{{ active.blurb }}</p>
      </header>

      <div class="trail-grid" :key="selected">
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

        <div
          v-if="trail.activeProjects.length || trail.archivedProjects.length"
          class="trail-col"
        >
          <p class="col-title">Projects and tools</p>
          <ul v-if="trail.activeProjects.length">
            <li v-for="p in trail.activeProjects" :key="p.slug">
              <RouterLink :to="`/tools/${p.slug}`" class="trail-link">
                {{ p.name }}
              </RouterLink>
              <span class="trail-note">{{ p.intent }}</span>
            </li>
          </ul>

          <details
            v-if="trail.archivedProjects.length"
            class="archive-drawer"
            :class="{ 'archive-drawer--with-active': trail.activeProjects.length }"
          >
            <summary>
              {{ trail.archivedProjects.length }} archived
              {{ trail.archivedProjects.length === 1 ? 'project' : 'projects' }}
            </summary>
            <ul>
              <li v-for="p in trail.archivedProjects" :key="p.slug">
                <RouterLink :to="`/tools/${p.slug}`" class="trail-link">
                  {{ p.name }}
                </RouterLink>
                <span class="trail-note">{{ p.intent }}</span>
              </li>
            </ul>
          </details>
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
  margin-top: clamp(1.25rem, 3vw, 2.25rem);
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
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
  padding: 1.05rem 0.4rem 1.05rem 0.9rem;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--color-hairline);
  cursor: pointer;
  font: inherit;
  color: var(--color-ink);
  transition: background 0.18s var(--ease-out-quint);
}
.stack-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}
.stack-item:hover {
  background: oklch(0.922 0.022 135 / 0.5);
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
.stack-mark {
  flex: none;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-ink-faint);
}
.stack-mark::after {
  content: ' \203A';
}
.stack-item[aria-pressed='true'] .stack-mark {
  color: var(--color-moss-deep);
}
.stack-item[aria-pressed='true'] .stack-mark::after {
  content: ' \2193';
}

/* ---------- trail (all sizes) ---------- */
.trail {
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
  padding-top: clamp(2.2rem, 4vw, 2.8rem);
  border-top: 2px solid var(--color-moss);
  position: relative;
}
.trail::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  width: min(18rem, 48vw);
  height: 2px;
  background: var(--color-moss-deep);
  transform-origin: left center;
  animation: trail-rule-in 0.72s var(--ease-out-expo) both;
}
.trail-cue {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-moss-deep);
}
.trail-cue-mark {
  width: 0.95rem;
  height: 0.95rem;
  border: 2px solid var(--color-moss);
  border-radius: 99px;
  background: var(--color-moss);
}
.trail-head h3 {
  font-size: var(--text-2xl);
  margin: 0.7rem 0 0;
}
.trail-blurb {
  margin: 1.1rem 0 0;
  color: var(--color-ink-soft);
  font-size: var(--text-lg);
}
.trail-grid {
  margin-top: clamp(2.75rem, 5vw, 3.6rem);
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
  display: inline;
  font-weight: 600;
  color: var(--color-river-deep);
  text-decoration-line: underline;
  text-decoration-color: oklch(0.52 0.078 222 / 0.38);
  text-decoration-thickness: 1.5px;
  text-underline-offset: 0.24em;
  transition: text-decoration-color 0.18s var(--ease-out-quint);
}
.trail-link:hover {
  text-decoration-color: currentColor;
}
.trail-note {
  font-size: var(--text-sm);
  color: var(--color-ink-faint);
  line-height: 1.5;
}
.archive-drawer {
  margin-top: 0;
}
.archive-drawer--with-active {
  margin-top: 1.15rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-hairline);
}
.archive-drawer summary {
  width: fit-content;
  cursor: pointer;
  color: var(--color-ink-faint);
  font-size: var(--text-sm);
  font-weight: 600;
}
.archive-drawer summary:hover {
  color: var(--color-moss-deep);
}
.archive-drawer ul {
  margin-top: 1rem;
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
    aspect-ratio: 2.5 / 1;
    max-height: 24rem;
    margin: 0.5rem 0 0;
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
    padding: 0.45rem 2.6rem 0.55rem;
    background: radial-gradient(
      ellipse at center,
      var(--color-paper) 0%,
      var(--color-paper) 68%,
      oklch(0.968 0.013 95 / 0) 100%
    );
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
    display: grid;
    place-items: center;
    width: min(22rem, 32vw);
    height: 5.5rem;
    background: none;
    border: 0;
    border-radius: var(--radius-md);
    cursor: pointer;
    font: inherit;
    color: var(--color-ink-soft);
    touch-action: manipulation;
  }
  .node--right {
    width: min(35rem, 42vw);
    transform: translate(-28%, -50%);
  }
  .node--left {
    width: min(35rem, 42vw);
    transform: translate(-72%, -50%);
  }
  .node--top,
  .node--bottom {
    height: 7.6rem;
  }
  .node-dot {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
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
    position: absolute;
    max-width: 13rem;
    white-space: nowrap;
    background: var(--color-paper);
    box-shadow: 0 0 0 0.35rem var(--color-paper);
    font-size: var(--text-sm);
    font-weight: 600;
    line-height: 1.3;
    transition: color 0.2s var(--ease-out-quint);
  }
  .node--top .node-label {
    bottom: calc(50% + 1.55rem);
    left: 50%;
    transform: translateX(-50%);
  }
  .node--right .node-label {
    top: 50%;
    left: calc(28% + 2rem);
    transform: translateY(-50%);
    text-align: left;
  }
  .node--bottom .node-label {
    top: calc(50% + 1.55rem);
    left: 50%;
    transform: translateX(-50%);
  }
  .node--left .node-label {
    top: 50%;
    right: calc(28% + 2rem);
    transform: translateY(-50%);
    text-align: right;
  }
  .node--right .node-dot {
    left: 28%;
  }
  .node--left .node-dot {
    left: 72%;
  }
  .node:hover .node-dot,
  .node:focus-visible .node-dot {
    border-color: var(--color-moss);
    transform: translate(-50%, -50%) scale(1.22);
  }
  .node:hover .node-label,
  .node:focus-visible .node-label {
    color: var(--color-ink);
  }
  .node.active .node-dot {
    background: var(--color-moss);
    border-color: var(--color-moss);
    transform: translate(-50%, -50%) scale(1.18);
  }
  .node.active .node-label {
    color: var(--color-ink);
    font-weight: 700;
  }

  /* Resting invitation: unpicked dots breathe so the map reads as touchable
     without an imperative. Stops once the visitor has engaged. */
  .node.inviting .node-dot::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 99px;
    border: 1px solid var(--color-moss);
    pointer-events: none;
    animation: node-invite 3s var(--ease-out-quint) infinite;
  }
  @keyframes node-invite {
    0% {
      opacity: 0.5;
      transform: scale(0.6);
    }
    70%,
    100% {
      opacity: 0;
      transform: scale(1.3);
    }
  }
  .node:hover .node-dot::after,
  .node:focus-visible .node-dot::after {
    animation: none;
    opacity: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .node.inviting .node-dot::after {
      animation: none;
      opacity: 0.35;
      transform: scale(1);
    }
  }
}

/* Receipts re-animate on each thread change so the cause is felt */
.trail-head {
  animation: trail-head-in 0.56s var(--ease-out-expo) both;
}
.trail-grid {
  animation: trail-in 0.64s 0.08s var(--ease-out-expo) both;
}
@keyframes trail-rule-in {
  from {
    opacity: 0.45;
    transform: scaleX(0.08);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}
@keyframes trail-head-in {
  from {
    opacity: 0;
    transform: translateY(0.9rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes trail-in {
  from {
    opacity: 0;
    transform: translateY(1.2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
