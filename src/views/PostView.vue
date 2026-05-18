<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPost, listPosts, formatDate } from '@/lib/markdown'

const route = useRoute()
const all = listPosts()
const post = computed(() => getPost(String(route.params.slug)))

const idx = computed(() =>
  all.findIndex((p) => p.slug === route.params.slug),
)
const prev = computed(() => (idx.value > 0 ? all[idx.value - 1] : null))
const next = computed(() =>
  idx.value >= 0 && idx.value < all.length - 1 ? all[idx.value + 1] : null,
)

onMounted(() => {
  if (post.value) document.title = `${post.value.title} — Jin`
})
watch(post, (p) => {
  if (p) document.title = `${p.title} — Jin`
})
</script>

<template>
  <article class="shell shell--reading post" v-if="post">
    <RouterLink to="/writing" class="back">← Writing</RouterLink>

    <header class="head">
      <p class="meta">
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        <span aria-hidden="true">·</span>
        <span class="cat">{{ post.category }}</span>
        <span aria-hidden="true">·</span>
        <span>{{ post.readingMinutes }} min read</span>
      </p>
      <h1>{{ post.title }}</h1>
      <p class="excerpt note-serif">{{ post.excerpt }}</p>
    </header>

    <!-- Rendered from local Markdown via marked -->
    <div class="prose" v-html="post.html"></div>

    <footer class="post-foot">
      <ul class="tags">
        <li v-for="t in post.tags" :key="t">#{{ t }}</li>
      </ul>

      <nav class="pager" aria-label="More writing">
        <RouterLink
          v-if="prev"
          :to="`/writing/${prev.slug}`"
          class="pager-link"
        >
          <span class="pager-dir">Newer</span>
          <span class="pager-title">{{ prev.title }}</span>
        </RouterLink>
        <RouterLink
          v-if="next"
          :to="`/writing/${next.slug}`"
          class="pager-link next"
        >
          <span class="pager-dir">Older</span>
          <span class="pager-title">{{ next.title }}</span>
        </RouterLink>
      </nav>
    </footer>
  </article>

  <div class="shell shell--reading" v-else>
    <h1>No such note</h1>
    <p class="lede">
      That piece is not here.
      <RouterLink to="/writing" class="link">All writing</RouterLink>.
    </p>
  </div>
</template>

<style scoped>
.back {
  display: inline-block;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink-soft);
  text-decoration: none;
  margin-bottom: 2.5rem;
}
.back:hover {
  color: var(--color-moss-deep);
}
.head {
  margin-bottom: 2.75rem;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
  margin: 0 0 1rem;
}
.meta .cat {
  color: var(--color-moss-deep);
  font-weight: 700;
}
.head h1 {
  font-size: var(--text-3xl);
  margin: 0;
}
.excerpt {
  margin: 1.2rem 0 0;
  font-size: var(--text-xl);
  line-height: 1.45;
}
.post-foot {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-hairline);
}
.tags {
  list-style: none;
  margin: 0 0 3rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: var(--text-sm);
  color: var(--color-ink-faint);
}
.pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.pager-link {
  display: grid;
  gap: 0.3rem;
  text-decoration: none;
  color: var(--color-ink);
}
.pager-link.next {
  text-align: right;
}
.pager-dir {
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
}
.pager-title {
  font-weight: 700;
  color: var(--color-river-deep);
}
.pager-link:hover .pager-title {
  text-decoration: underline;
}
@media (max-width: 620px) {
  .pager {
    grid-template-columns: 1fr;
  }
  .pager-link.next {
    text-align: left;
  }
}

.prose :deep(img) {
  display: block;
  width: min(50rem, calc(100vw - 5rem));
  height: auto;
  margin: 2rem 50%;
  transform: translateX(-50%);
  border: 1px solid var(--color-hairline);
  background: var(--color-paper-raised);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

@media (max-width: 760px) {
  .prose :deep(img) {
    width: 100%;
    margin: 1.5rem 0;
    transform: none;
  }
}
</style>
