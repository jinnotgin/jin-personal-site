<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import posthog from 'posthog-js'
import { formatDate } from '@/lib/markdown'
import { getPost } from '@/lib/postMarkdown'
import { postSeo, writingIndexSeo } from '@/lib/seo'

const route = useRoute()
const post = await getPost(String(route.params.slug))
useHead(post ? postSeo(post) : writingIndexSeo())

const prev = post?.prev ?? null
const next = post?.next ?? null

onMounted(() => {
	if (post) {
		posthog.capture('post_viewed', {
			post_slug: post.slug,
			post_title: post.title,
			post_category: post.category,
			reading_minutes: post.readingMinutes,
		})
	}
})

function trackPagerClick(direction: 'newer' | 'older', targetSlug: string, targetTitle: string) {
	posthog.capture('post_pager_navigated', {
		direction,
		from_slug: String(route.params.slug),
		to_slug: targetSlug,
		to_title: targetTitle,
	})
}
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
					v-if="next"
					:to="`/writing/${next.slug}`"
					class="pager-link older"
					@click="trackPagerClick('older', next.slug, next.title)"
				>
					<span class="pager-dir">Older</span>
					<span class="pager-title">{{ next.title }}</span>
				</RouterLink>
				<RouterLink
					v-if="prev"
					:to="`/writing/${prev.slug}`"
					class="pager-link newer"
					@click="trackPagerClick('newer', prev.slug, prev.title)"
				>
					<span class="pager-dir">Newer</span>
					<span class="pager-title">{{ prev.title }}</span>
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
.pager-link.newer {
	text-align: right;
	grid-column: 2;
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
	.pager-link.newer {
		grid-column: auto;
		text-align: left;
	}
}

.prose :deep(img),
.prose :deep(figure) {
	display: block;
	width: min(50rem, calc(100vw - 5rem));
	height: auto;
	margin: 2rem 50%;
	transform: translateX(-50%);
}
.prose :deep(figure) {
	margin-top: 2.5rem;
	margin-bottom: 2.5rem;
}
.prose :deep(figure img) {
	display: block;
	width: 100%;
	height: auto;
	margin: 0;
	transform: none;
}
.prose :deep(figcaption) {
	margin-top: 0.65rem;
	font-size: var(--text-sm);
	color: var(--color-ink-faint);
	text-align: center;
	font-style: italic;
	line-height: 1.5;
}

@media (max-width: 760px) {
	.prose :deep(img),
	.prose :deep(figure) {
		width: 100%;
		margin: 1.5rem 0;
		transform: none;
	}
}

.prose :deep(.cols) {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1.5rem;
	width: min(68rem, calc(100vw - 4rem));
	margin: 2rem 50%;
	transform: translateX(-50%);
	align-items: start;
}
.prose :deep(.cols > p) {
	display: contents;
}
.prose :deep(.cols > p:empty) {
	display: none;
}
.prose :deep(.cols img),
.prose :deep(.cols figure) {
	width: 100%;
	margin: 0;
	transform: none;
}
.prose :deep(.cols figure img) {
	width: 100%;
}
@media (max-width: 760px) {
	.prose :deep(.cols) {
		grid-template-columns: 1fr;
		gap: 1rem;
		width: 100%;
		margin: 1.5rem 0;
		transform: none;
	}
}

.prose :deep(table) {
	width: 100%;
	border-collapse: collapse;
	font-size: var(--text-sm);
	margin: 2rem 0;
	display: block;
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
}
.prose :deep(thead) {
	border-bottom: 2px solid var(--color-hairline);
}
.prose :deep(th) {
	text-align: left;
	font-size: var(--text-xs);
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-ink-faint);
	padding: 0 1.25rem 0.65rem 0;
	white-space: nowrap;
}
.prose :deep(td) {
	padding: 0.7rem 1.25rem 0.7rem 0;
	vertical-align: top;
	border-bottom: 1px solid var(--color-hairline);
	line-height: 1.5;
}
.prose :deep(tr:last-child td) {
	border-bottom: none;
}
</style>
