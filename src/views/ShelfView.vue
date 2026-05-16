<script setup lang="ts">
import { computed } from 'vue'
import { shelf } from '@/data/shelf'
import type { ShelfItem } from '@/data/types'

const order: ShelfItem['kind'][] = ['book', 'idea', 'person', 'place']
const labels: Record<ShelfItem['kind'], string> = {
  book: 'Books',
  idea: 'Ideas I keep using',
  person: 'People I read',
  place: 'Places',
}

const groups = computed(() =>
  order
    .map((kind) => ({
      kind,
      label: labels[kind],
      items: shelf.filter((s) => s.kind === kind),
    }))
    .filter((g) => g.items.length),
)
</script>

<template>
  <div class="shell shell--reading">
    <header class="page-head">
      <h1>What is shaping the thinking.</h1>
      <p class="lede">
        The most personal page here. Not a reading list to look smart, the
        few things the work actually leans on.
      </p>
    </header>

    <div class="shelf">
      <section v-for="g in groups" :key="g.kind">
        <h2>{{ g.label }}</h2>
        <ul>
          <li v-for="(item, i) in g.items" :key="i">
            <p class="title">
              {{ item.title }}
              <span v-if="item.by" class="by">— {{ item.by }}</span>
            </p>
            <p class="note note-serif">{{ item.note }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.shelf {
  display: grid;
  gap: clamp(2.5rem, 5vw, 4rem);
}
section h2 {
  font-size: var(--text-xl);
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-ink);
  margin-bottom: 1.5rem;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.6rem;
}
.title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 700;
}
.by {
  font-weight: 400;
  color: var(--color-ink-faint);
}
.note {
  margin: 0.35rem 0 0;
  font-size: var(--text-lg);
  line-height: 1.55;
  color: var(--color-clay);
  max-width: 64ch;
}
</style>
