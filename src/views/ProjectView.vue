<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { projects } from '@/data/workbench'
import { getProject } from '@/lib/projects'
import { threadById } from '@/data/threads'

const route = useRoute()
const project = computed(() => getProject(String(route.params.slug)))
const thread = computed(() =>
  project.value ? threadById(project.value.threads[0]!) : undefined,
)
const siblings = computed(() =>
  project.value
    ? projects.filter(
        (p) =>
          p.threads.some((t) => project.value!.threads.includes(t)) &&
          p.slug !== project.value!.slug,
      )
    : [],
)
</script>

<template>
  <div class="shell shell--reading" v-if="project">
    <RouterLink to="/projects" class="back">← Projects</RouterLink>

    <header class="head">
      <p class="eyebrow">
        <RouterLink v-if="thread" to="/" class="thread-tag">{{
          thread.label
        }}</RouterLink>
        · {{ project.year }}
      </p>
      <h1>{{ project.name }}</h1>
      <p class="intent">{{ project.intent }}</p>
      <p class="status" :class="`status--${project.status}`">
        {{ project.status }}
      </p>
    </header>

    <div v-if="project.images?.length" class="project-images">
      <figure v-for="image in project.images" :key="image.src">
        <img :src="image.src" :alt="image.alt" loading="lazy" />
      </figure>
    </div>

    <div class="prose" v-html="project.html"></div>

    <div class="meta">
      <div>
        <p class="meta-label">Date</p>
        <p class="meta-value">{{ project.year }}</p>
      </div>
      <div>
        <p class="meta-label">Built around</p>
        <ul class="tags">
          <li v-for="s in project.stack" :key="s">{{ s }}</li>
        </ul>
      </div>
      <div v-if="project.links?.length">
        <p class="meta-label">Receipts</p>
        <ul class="links">
          <li v-for="l in project.links" :key="l.href">
            <a :href="l.href" target="_blank" rel="noopener" class="link"
              >{{ l.label }} ↗</a
            >
          </li>
        </ul>
      </div>
    </div>

    <nav v-if="siblings.length" class="siblings" aria-label="Same thread">
      <p class="meta-label">
        More in {{ thread?.label ?? 'this thread' }}
      </p>
      <ul>
        <li v-for="s in siblings" :key="s.slug">
          <RouterLink :to="`/projects/${s.slug}`" class="sib">
            <span class="sib-title">{{ s.name }}</span>
            <span class="sib-intent">{{ s.intent }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>

  <div class="shell shell--reading" v-else>
    <h1>No such project</h1>
    <p class="lede">
      That project does not exist.
      <RouterLink to="/projects" class="link">Back to all projects</RouterLink>.
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
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--color-hairline);
}
.thread-tag {
  color: var(--color-moss-deep);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}
.head h1 {
  font-size: var(--text-3xl);
  margin: 0.5rem 0 0;
}
.intent {
  margin: 1.1rem 0 1.4rem;
  font-size: var(--text-xl);
  font-weight: 500;
  color: var(--color-ink-soft);
  line-height: 1.4;
}
.project-images {
  margin-top: 2.4rem;
  display: grid;
  gap: 1.25rem;
  width: min(50rem, calc(100vw - 5rem));
  margin-left: 50%;
  transform: translateX(-50%);
}
.project-images figure {
  margin: 0;
  border: 1px solid var(--color-hairline);
  background: var(--color-paper-raised);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.project-images img {
  display: block;
  width: 100%;
  height: auto;
}

@media (max-width: 760px) {
  .project-images {
    width: 100%;
    margin-left: 0;
    transform: none;
  }
}
.prose {
  margin-top: 3rem;
}
.prose :deep(h2) {
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-moss-deep);
  margin-top: 2.75rem;
  margin-bottom: 0.75rem;
}
.prose :deep(p) {
  font-size: var(--text-lg);
  line-height: 1.6;
  margin: 0;
}
.prose :deep(p + p) {
  margin-top: 1em;
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
.prose :deep(iframe) {
  display: block;
  width: min(50rem, calc(100vw - 5rem));
  aspect-ratio: 16 / 9;
  height: auto;
  margin: 2rem 50%;
  transform: translateX(-50%);
  border: 1px solid var(--color-hairline);
  background: var(--color-paper-raised);
  border-radius: var(--radius-lg);
}
@media (max-width: 760px) {
  .prose :deep(img),
  .prose :deep(iframe) {
    width: 100%;
    margin: 1.5rem 0;
    transform: none;
  }
}
.meta {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-hairline);
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem 4rem;
}
.meta-label {
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-faint);
  margin: 0 0 0.85rem;
}
.meta-value {
  color: var(--color-ink-soft);
  font-size: var(--text-sm);
  font-weight: 600;
  margin: 0;
}
.tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tags li {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-ink-soft);
  background: var(--color-sage);
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-md);
}
.links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
.siblings {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-hairline);
}
.siblings ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.25rem;
}
.sib {
  display: grid;
  grid-template-columns: minmax(10rem, 0.34fr) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid var(--color-hairline);
  text-decoration: none;
  color: var(--color-ink);
  transition:
    background-color 0.18s var(--ease-out-quint),
    color 0.18s var(--ease-out-quint);
}
.sib:hover {
  background: var(--color-sage);
  color: var(--color-moss-deep);
}
.sib-title {
  font-weight: 700;
  line-height: 1.25;
}
.sib-intent {
  font-weight: 400;
  font-size: var(--text-sm);
  color: var(--color-ink-faint);
  line-height: 1.45;
}

@media (max-width: 640px) {
  .sib {
    grid-template-columns: 1fr;
    gap: 0.35rem;
    padding: 1rem 0;
  }
}
</style>
