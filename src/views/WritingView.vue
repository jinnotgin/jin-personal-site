<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listPosts, categories, formatDate, deslugifyCategory, slugifyCategory } from '@/lib/markdown'

const route = useRoute()
const router = useRouter()
const posts = listPosts()
const filters = ['All', ...categories]
const PAGE_SIZE = 8

/* ── Derive state from URL query params ── */

const filter = computed(() => {
  const q = route.query.category
  const qStr = Array.isArray(q) ? q[0] : q
  if (!qStr) return 'All'
  return deslugifyCategory(qStr) ?? (categories.includes(qStr) ? qStr : 'All')
})

const currentPage = computed(() => {
  const p = route.query.page
  const n = Number(Array.isArray(p) ? p[0] : p)
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
})

const shown = computed(() =>
  filter.value === 'All'
    ? posts
    : posts.filter((p) => p.category === filter.value),
)

const totalPages = computed(() => Math.max(1, Math.ceil(shown.value.length / PAGE_SIZE)))

// Clamp page to valid range (handles stale URLs)
const safePage = computed(() => Math.min(currentPage.value, totalPages.value))

const visible = computed(() => {
  const start = (safePage.value - 1) * PAGE_SIZE
  return shown.value.slice(start, start + PAGE_SIZE)
})

const hasPrev = computed(() => safePage.value > 1)
const hasNext = computed(() => safePage.value < totalPages.value)

/* ── Navigation helpers ── */

function buildQuery(page: number, category?: string) {
  const cat = category ?? filter.value
  const q: Record<string, string> = {}
  if (cat !== 'All') q.category = slugifyCategory(cat)
  if (page > 1) q.page = String(page)
  return q
}

function setFilter(cat: string) {
  router.push({ path: '/writing', query: buildQuery(1, cat) })
}

function goToPage(page: number) {
  router.push({ path: '/writing', query: buildQuery(page) })
}

// If URL has a page beyond the valid range, silently correct it
watch([safePage, currentPage], ([safe, current]) => {
  if (current !== safe) {
    router.replace({ path: '/writing', query: buildQuery(safe) })
  }
})
</script>

<template>
  <div class="shell">
    <div class="banner" aria-hidden="true"></div>

    <header class="page-head">
      <h1>Notes on building systems that have to keep working.</h1>
      <p class="lede">
        Working notes, not polished essays. I show how things were built, and
        why.
      </p>
    </header>

    <div class="filters" role="group" aria-label="Filter by category">
      <button
        v-for="c in filters"
        :key="c"
        class="chip"
        :aria-pressed="filter === c"
        @click="setFilter(c)"
      >
        {{ c }}
      </button>
    </div>

    <ul class="posts">
      <li v-for="p in visible" :key="p.slug">
        <RouterLink :to="`/writing/${p.slug}`" class="post">
          <span class="post-meta">
            <time :datetime="p.date">{{ formatDate(p.date) }}</time>
            <span class="dot">·</span>
            <span class="cat">{{ p.category }}</span>
          </span>
          <h2 class="post-title">{{ p.title }}</h2>
          <p class="post-excerpt measure">{{ p.excerpt }}</p>
          <span class="post-tags">{{ p.tags.join(' · ') }}</span>
        </RouterLink>
      </li>
    </ul>

    <nav v-if="totalPages > 1" class="pagination" aria-label="Writing pages">
      <RouterLink
        v-if="hasPrev"
        :to="{ path: '/writing', query: buildQuery(safePage - 1) }"
        class="page-link prev"
      >
        <span class="page-arrow" aria-hidden="true">←</span>
        Newer
      </RouterLink>
      <span v-else class="page-link prev disabled" aria-hidden="true">
        <span class="page-arrow">←</span>
        Newer
      </span>

      <span class="page-pos">{{ safePage }}<span class="page-sep">/</span>{{ totalPages }}</span>

      <RouterLink
        v-if="hasNext"
        :to="{ path: '/writing', query: buildQuery(safePage + 1) }"
        class="page-link next"
      >
        Older
        <span class="page-arrow" aria-hidden="true">→</span>
      </RouterLink>
      <span v-else class="page-link next disabled" aria-hidden="true">
        Older
        <span class="page-arrow">→</span>
      </span>
    </nav>
  </div>
</template>

<style scoped>
.banner {
  height: clamp(8rem, 18vw, 14rem);
  margin-bottom: 2.5rem;
  border-radius: var(--radius-lg);
  background-image: url('/img/writing-vignette-v2.webp'),
    linear-gradient(
      170deg,
      var(--color-sage) 0%,
      var(--color-paper-raised) 55%,
      var(--color-sage-deep) 100%
    );
  background-size: cover, cover;
  background-position: center;
  border: 1px solid var(--color-hairline);
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}
.chip {
  font: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  padding: 0.4rem 0.95rem;
  border-radius: 99px;
  border: 1px solid var(--color-hairline);
  background: none;
  color: var(--color-ink-soft);
  cursor: pointer;
  transition:
    background 0.16s var(--ease-out-quint),
    color 0.16s var(--ease-out-quint);
}
.chip:hover {
  color: var(--color-ink);
}
.chip[aria-pressed='true'] {
  background: var(--color-forest);
  border-color: var(--color-forest);
  color: var(--color-forest-ink);
}
.posts {
  list-style: none;
  margin: 0;
  padding: 0;
}
.posts li {
  border-top: 1px solid var(--color-hairline);
}
.posts li:last-child {
  border-bottom: 1px solid var(--color-hairline);
}
.post {
  display: grid;
  gap: 0.5rem;
  padding: 2rem 0.25rem;
  text-decoration: none;
  color: var(--color-ink);
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
}
.post-meta .cat {
  color: var(--color-moss-deep);
  font-weight: 700;
}
.post-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  transition: color 0.18s var(--ease-out-quint);
}
.post:hover .post-title {
  color: var(--color-moss-deep);
}
.post-excerpt {
  color: var(--color-ink-soft);
  font-size: var(--text-lg);
  margin: 0;
}
.post-tags {
  font-size: var(--text-sm);
  color: var(--color-ink-faint);
  margin-top: 0.35rem;
}
/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(2rem, 5vw, 3rem) 0;
  gap: 1rem;
}
.page-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink-soft);
  text-decoration: none;
  padding: 0.55rem 1.1rem;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-md);
  transition:
    color 0.16s var(--ease-out-quint),
    border-color 0.16s var(--ease-out-quint),
    background 0.16s var(--ease-out-quint);
  min-width: 6.5rem;
}
.page-link.prev { justify-content: flex-start; }
.page-link.next { justify-content: flex-end; }
.page-link:not(.disabled):hover {
  color: var(--color-ink);
  border-color: var(--color-moss);
  background: var(--color-sage);
}
.page-link.disabled {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}
.page-arrow {
  font-weight: 400;
  font-size: 1.05em;
}
.page-pos {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink-faint);
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.page-sep {
  margin: 0 0.15rem;
  opacity: 0.5;
}
</style>
