<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute, useRouter } from 'vue-router'
import posthog from 'posthog-js'
import type { PostMeta } from '@/data/types'
import {
	categories,
	formatDate,
	deslugifyCategory,
	loadWritingPage,
	pageSize,
	slugifyCategory,
	totalsByFilter,
} from '@/lib/markdown'
import { writingIndexSeo } from '@/lib/seo'
import { isNavigating, hasNavigated } from '@/lib/navigation'

const route = useRoute()
const router = useRouter()
useHead(writingIndexSeo())

const filters = ['All', ...categories]

/* ── Derive state from URL query params ── */

const filter = computed(() => {
	const q = route.query.category
	const qStr = Array.isArray(q) ? q[0] : q
	if (!qStr) return 'All'
	return deslugifyCategory(qStr) ?? (categories.includes(qStr) ? qStr : 'All')
})

const filterSlug = computed(() => (filter.value === 'All' ? 'all' : slugifyCategory(filter.value)))

const currentPage = computed(() => {
	const p = route.query.page
	const n = Number(Array.isArray(p) ? p[0] : p)
	return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
})

const totalPages = computed(() =>
	Math.max(1, Math.ceil((totalsByFilter[filterSlug.value] ?? 0) / pageSize)),
)

// Clamp page to valid range (handles stale URLs)
const safePage = computed(() => Math.min(currentPage.value, totalPages.value))

const visible = ref<PostMeta[]>([])
const isLoading = ref(false)

async function loadCurrentPage() {
	isLoading.value = true
	if (hasNavigated.value) isNavigating.value = true
	try {
		visible.value = await loadWritingPage(filterSlug.value, safePage.value)
	} finally {
		isLoading.value = false
		isNavigating.value = false
	}
}

await loadCurrentPage()
watch([filterSlug, safePage], loadCurrentPage)

const listTransitionKey = computed(() => `${filter.value}:${safePage.value}`)

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
	posthog.capture('writing_category_filtered', { category: cat })
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
			<p class="lede">Working notes, not polished essays. I show how things were built, and why.</p>
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

		<Transition name="writing-list" mode="out-in">
			<ul v-if="isLoading" key="skeleton" class="posts" aria-hidden="true">
				<li v-for="n in pageSize" :key="n" class="sk-post">
					<div class="sk-post-inner">
						<div class="sk-bar sk-meta-bar" />
						<div class="sk-bar sk-title-bar" />
						<div class="sk-bar sk-title-bar sk-title-bar--short" />
						<div class="sk-bar sk-excerpt-bar" />
						<div class="sk-bar sk-excerpt-bar sk-excerpt-bar--short" />
						<div class="sk-bar sk-tags-bar" />
					</div>
				</li>
			</ul>
			<ul v-else :key="listTransitionKey" class="posts">
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
		</Transition>

		<nav v-if="totalPages > 1" class="pagination" aria-label="Writing pages">
			<RouterLink
				v-if="hasPrev"
				:to="{ path: '/writing', query: buildQuery(safePage - 1) }"
				class="page-link prev"
			>
				<span class="page-arrow" aria-hidden="true">←</span>
				Previous
			</RouterLink>
			<span v-else class="page-link prev hidden" aria-hidden="true"></span>

			<span class="page-pos">{{ safePage }}<span class="page-sep">/</span>{{ totalPages }}</span>

			<RouterLink
				v-if="hasNext"
				:to="{ path: '/writing', query: buildQuery(safePage + 1) }"
				class="page-link next"
			>
				Next
				<span class="page-arrow" aria-hidden="true">→</span>
			</RouterLink>
			<span v-else class="page-link next hidden" aria-hidden="true"></span>
		</nav>
	</div>
</template>

<style scoped>
.banner {
	height: clamp(8rem, 18vw, 14rem);
	margin-bottom: 2.5rem;
	border-radius: var(--radius-lg);
	background-image:
		url('/img/writing-vignette-v2.webp'),
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
.writing-list-enter-active {
	transition:
		opacity 0.28s var(--ease-out-quint),
		filter 0.28s var(--ease-out-quint);
}
.writing-list-leave-active {
	transition: opacity 0.16s ease;
}
.writing-list-enter-from {
	opacity: 0;
	filter: blur(3px);
}
.writing-list-leave-to {
	opacity: 0;
}
.posts li {
	border-top: 1px solid var(--color-hairline);
}
.posts li:last-child {
	border-bottom: 1px solid var(--color-hairline);
}

/* ── Pagination skeleton ── */
.sk-post {
	border-top: 1px solid var(--color-hairline);
}
.sk-post:last-child {
	border-bottom: 1px solid var(--color-hairline);
}
.sk-post-inner {
	display: grid;
	gap: 0.55rem;
	padding: 2rem 0.25rem;
}
.sk-bar {
	border-radius: var(--radius-sm);
	background: color-mix(in oklab, var(--color-hairline) 80%, var(--color-paper));
	animation: sk-pulse 1.6s ease-in-out infinite;
}
.sk-meta-bar {
	height: 0.65rem;
	width: 12rem;
}
.sk-title-bar {
	height: 1.6rem;
}
.sk-title-bar--short {
	width: 58%;
}
.sk-excerpt-bar {
	height: 1rem;
	width: 95%;
}
.sk-excerpt-bar--short {
	width: 72%;
}
.sk-tags-bar {
	height: 0.65rem;
	width: 40%;
	margin-top: 0.3rem;
}
@keyframes sk-pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.45; }
}
@media (prefers-reduced-motion: reduce) {
	.sk-bar {
		animation: none;
		opacity: 0.6;
	}
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
	font-size: var(--text-xs);
	line-height: 1.45;
	color: var(--color-ink-faint);
	margin-top: 0.55rem;
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
.page-link.prev,
.page-link.next {
	justify-content: center;
}
.page-link:not(.disabled):hover {
	color: var(--color-ink);
	border-color: var(--color-moss);
	background: var(--color-sage);
}
.page-link.hidden {
	visibility: hidden;
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

@media (prefers-reduced-motion: reduce) {
	.writing-list-enter-active,
	.writing-list-leave-active {
		transition: none;
	}

	.writing-list-enter-from {
		filter: none;
	}
}
</style>
