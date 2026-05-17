<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { listPosts, categories, formatDate } from '@/lib/markdown'

const route = useRoute()
const posts = listPosts()
const filters = ['All', ...categories]

const initialCategory = (() => {
  const q = route.query.category
  const qStr = Array.isArray(q) ? q[0] : q
  return qStr && categories.includes(qStr) ? qStr : 'All'
})()

const filter = ref<string>(initialCategory)
const PAGE_SIZE = 8
const limit = ref(PAGE_SIZE)

const shown = computed(() =>
  filter.value === 'All'
    ? posts
    : posts.filter((p) => p.category === filter.value),
)

const visible = computed(() => shown.value.slice(0, limit.value))
const hasMore = computed(() => limit.value < shown.value.length)

watch(filter, () => { limit.value = PAGE_SIZE })

function loadMore() {
  limit.value += PAGE_SIZE
}
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
        @click="filter = c"
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

    <div v-if="hasMore" class="load-more">
      <button class="load-more-btn" @click="loadMore">
        Load {{ Math.min(PAGE_SIZE, shown.length - limit) }} more
        <span class="load-more-count">({{ shown.length - limit }} remaining)</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.banner {
  height: clamp(7rem, 16vw, 12rem);
  margin-bottom: 2.5rem;
  border-radius: var(--radius-lg);
  background-image: url('/img/writing-vignette.webp'),
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
.load-more {
  padding: clamp(2rem, 5vw, 3rem) 0;
  display: flex;
  justify-content: center;
}
.load-more-btn {
  font: inherit;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-ink-soft);
  background: none;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-md);
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  transition:
    color 0.16s var(--ease-out-quint),
    border-color 0.16s var(--ease-out-quint),
    background 0.16s var(--ease-out-quint);
}
.load-more-btn:hover {
  color: var(--color-ink);
  border-color: var(--color-moss);
  background: var(--color-sage);
}
.load-more-count {
  font-weight: 400;
  color: var(--color-ink-faint);
  margin-left: 0.4rem;
}
</style>
