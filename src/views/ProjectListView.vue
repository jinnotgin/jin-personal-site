<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import posthog from 'posthog-js'
import { threads } from '@/data/threads'
import { listProjects, byMostRecentProject, projectsByThread } from '@/lib/projectsIndex'
import { projectsIndexSeo } from '@/lib/seo'

function trackProjectClick(slug: string, name: string, status: string, thread: string) {
	posthog.capture('project_clicked', {
		project_slug: slug,
		project_name: name,
		project_status: status,
		thread,
	})
}

useHead(projectsIndexSeo())

const groups = computed(() =>
	threads
		.map((t) => ({
			thread: t,
			items: projectsByThread(t.id).sort(byMostRecentProject),
		}))
		.filter((g) => g.items.length),
)

const counts = computed(() => {
	const all = listProjects()
	return { total: all.length, active: all.filter((p) => p.status === 'active').length }
})
</script>

<template>
	<div class="shell">
		<div class="banner" aria-hidden="true"></div>

		<header class="page-head">
			<h1>Projects and tools, grouped by core threads.</h1>
			<p class="lede">
				{{ counts.total }} projects, {{ counts.active }} still active. Some are tools you can try
				out; some are written case studies from work that cannot be publicly demoed.
			</p>
		</header>

		<div class="groups">
			<section v-for="g in groups" :key="g.thread.id" class="group" :aria-label="g.thread.label">
				<div class="group-head">
					<h2>{{ g.thread.label }}</h2>
					<p>{{ g.thread.line }}</p>
				</div>

				<ul class="rows">
					<li v-for="p in g.items" :key="p.slug">
						<RouterLink
							:to="`/projects/${p.slug}`"
							class="row"
							@click="trackProjectClick(p.slug, p.name, p.status, g.thread.label)"
						>
							<span class="row-name">{{ p.name }}</span>
							<span class="row-intent">{{ p.intent }}</span>
							<span class="row-meta">
								<span class="status" :class="`status--${p.status}`">{{ p.status }}</span>
								<span class="row-year">{{ p.year }}</span>
							</span>
						</RouterLink>
					</li>
				</ul>
			</section>
		</div>
	</div>
</template>

<style scoped>
.banner {
	height: clamp(8rem, 18vw, 14rem);
	margin-bottom: 2.5rem;
	border-radius: var(--radius-lg);
	background-image:
		url('/img/projects-vignette.webp'),
		linear-gradient(
			165deg,
			var(--color-sage) 0%,
			var(--color-paper-raised) 55%,
			var(--color-sage-deep) 100%
		);
	background-size: cover, cover;
	background-position: center;
	border: 1px solid var(--color-hairline);
}
.groups {
	display: grid;
	gap: clamp(3rem, 6vw, 5rem);
}
.group-head {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 0.5rem 1.25rem;
	padding-bottom: 1rem;
	border-bottom: 2px solid var(--color-ink);
}
.group-head h2 {
	font-size: var(--text-2xl);
}
.group-head p {
	font-size: var(--text-sm);
	color: var(--color-ink-faint);
	margin: 0;
}
.rows {
	list-style: none;
	margin: 0;
	padding: 0;
}
.rows li {
	border-bottom: 1px solid var(--color-hairline);
}
.row {
	display: grid;
	grid-template-columns: minmax(9rem, 14rem) 1fr auto;
	align-items: baseline;
	gap: 0.4rem 2rem;
	padding: 1.35rem 0.5rem;
	text-decoration: none;
	color: var(--color-ink);
	transition: background 0.18s var(--ease-out-quint);
}
.row:hover {
	background: var(--color-sage);
}
.row-name {
	font-size: var(--text-lg);
	font-weight: 700;
}
.row:hover .row-name {
	color: var(--color-moss-deep);
}
.row-intent {
	color: var(--color-ink-soft);
	font-size: var(--text-base);
}
.row-meta {
	display: flex;
	align-items: center;
	gap: 1rem;
	justify-self: end;
	white-space: nowrap;
}
.row-year {
	font-size: var(--text-sm);
	color: var(--color-ink-faint);
}

@media (max-width: 720px) {
	.row {
		grid-template-columns: 1fr;
		gap: 0.4rem;
		padding: 1.25rem 0.25rem;
	}
	.row-meta {
		justify-self: start;
		margin-top: 0.3rem;
	}
}
</style>
