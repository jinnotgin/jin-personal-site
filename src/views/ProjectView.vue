<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { projects, projectBySlug } from '@/data/workbench'
import { threadById } from '@/data/threads'

const route = useRoute()
const project = computed(() => projectBySlug(String(route.params.slug)))
const thread = computed(() =>
  project.value ? threadById(project.value.thread) : undefined,
)
const siblings = computed(() =>
  project.value
    ? projects.filter(
        (p) =>
          p.thread === project.value!.thread &&
          p.slug !== project.value!.slug,
      )
    : [],
)
</script>

<template>
  <div class="shell shell--reading" v-if="project">
    <RouterLink to="/tools" class="back">← Tools</RouterLink>

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

    <div class="archaeology">
      <section>
        <h2>Why it existed</h2>
        <p>{{ project.why }}</p>
      </section>
      <section>
        <h2>The friction it answered</h2>
        <p>{{ project.friction }}</p>
      </section>
      <section>
        <h2>What was built</h2>
        <p>{{ project.built }}</p>
      </section>
      <section v-if="project.trace">
        <h2>What it left behind</h2>
        <p class="note-serif">{{ project.trace }}</p>
      </section>
    </div>

    <div class="meta">
      <div>
        <p class="meta-label">Made with</p>
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
          <RouterLink :to="`/tools/${s.slug}`" class="sib">
            <span>{{ s.name }}</span>
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
      <RouterLink to="/tools" class="link">Back to all tools</RouterLink>.
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
  font-size: var(--text-4xl);
  margin: 0.5rem 0 0;
}
.intent {
  margin: 1.1rem 0 1.4rem;
  font-size: var(--text-xl);
  font-weight: 500;
  color: var(--color-ink-soft);
  line-height: 1.4;
}
.archaeology {
  margin-top: 3rem;
  display: grid;
  gap: 2.75rem;
}
.archaeology h2 {
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-moss-deep);
  margin-bottom: 0.75rem;
}
.archaeology p {
  font-size: var(--text-lg);
  line-height: 1.6;
  margin: 0;
}
.archaeology .note-serif {
  font-size: var(--text-lg);
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
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: baseline;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--color-hairline);
  text-decoration: none;
  color: var(--color-ink);
  font-weight: 600;
}
.sib:hover {
  color: var(--color-moss-deep);
}
.sib-intent {
  font-weight: 400;
  font-size: var(--text-sm);
  color: var(--color-ink-faint);
}
</style>
