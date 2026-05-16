<script setup lang="ts">
import { computed, ref } from 'vue'
import { listPosts, categories, formatDate } from '@/lib/markdown'

const posts = listPosts()
const filter = ref<string>('All')
const filters = ['All', ...categories]

const shown = computed(() =>
  filter.value === 'All'
    ? posts
    : posts.filter((p) => p.category === filter.value),
)
</script>

<template>
  <div class="shell">
    <div class="banner" aria-hidden="true"></div>

    <header class="page-head">
      <h1>Notes, mostly about systems that have to keep working.</h1>
      <p class="lede">
        Closer to a working notebook than a blog. Show the workings, link the
        receipts, no polish tax.
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
      <li v-for="p in shown" :key="p.slug">
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
</style>
