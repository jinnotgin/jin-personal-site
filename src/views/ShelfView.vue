<script setup lang="ts">
import { computed } from 'vue'
import posthog from 'posthog-js'
import { shelf } from '@/data/shelf'
import type { ShelfItem } from '@/data/types'

function trackShelfClick(title: string, kind: ShelfItem['kind']) {
	posthog.capture('shelf_item_clicked', { item_title: title, item_kind: kind })
}

const order: ShelfItem['kind'][] = ['book', 'person', 'idea', 'place']
const labels: Record<ShelfItem['kind'], string> = {
	book: 'Books',
	idea: 'Ideas I keep using',
	person: 'People I learn from',
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
	<div class="shell shell--reading shelf-shell">
		<div class="banner" aria-hidden="true"></div>

		<header class="page-head">
			<h1>What has given me new perspectives.</h1>
			<p class="lede">A list of things that have shaped how I think, feel, and see the world.</p>
		</header>

		<div class="shelf">
			<section v-for="g in groups" :key="g.kind">
				<h2>{{ g.label }}</h2>
				<ul>
					<li v-for="(item, i) in g.items" :key="i">
						<a
							class="shelf-link"
							:href="item.href"
							target="_blank"
							rel="noreferrer"
							@click="trackShelfClick(item.title, g.kind)"
						>
							<span class="title">
								{{ item.title }}
								<span v-if="item.by" class="by">— {{ item.by }}</span>
							</span>
							<span class="note note-serif">{{ item.note }}</span>
						</a>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<style scoped>
.shelf-shell {
	max-width: 54rem;
}
.banner {
	height: clamp(7rem, 16vw, 12rem);
	margin-bottom: 2.5rem;
	border-radius: var(--radius-lg);
	background-image:
		url('/img/shelf-vignette.webp'),
		linear-gradient(
			175deg,
			var(--color-paper-raised) 0%,
			var(--color-sage) 55%,
			var(--color-sage-deep) 100%
		);
	background-size: cover, cover;
	background-position: center;
	border: 1px solid var(--color-hairline);
}
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
	gap: 0.35rem;
}
.shelf-link {
	display: grid;
	gap: 0.35rem;
	padding: 1.05rem 0.5rem;
	color: inherit;
	text-decoration: none;
	border-radius: var(--radius-sm);
	transition:
		background-color 180ms var(--ease-out-quint),
		color 180ms var(--ease-out-quint);
}
.shelf-link:hover {
	background: var(--color-sage);
}
.shelf-link:focus-visible {
	outline: 2px solid var(--color-moss);
	outline-offset: 3px;
}
.title {
	margin: 0;
	font-size: var(--text-lg);
	font-weight: 700;
	color: var(--color-ink);
}
.shelf-link:hover .title {
	color: var(--color-moss-deep);
}
.by {
	font-weight: 400;
	color: var(--color-ink-faint);
}
.note {
	margin: 0;
	font-size: var(--text-lg);
	line-height: 1.55;
	color: var(--color-clay);
	max-width: 64ch;
}
</style>
