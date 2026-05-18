<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { nav, site } from '@/data/site'

const route = useRoute()
const router = useRouter()
const open = ref(false)
const prefetchedRoutes = new Set<string>()
type RouteComponentLoader = () => Promise<unknown>

const activePath = computed(() => route.path.replace(/\/$/, '') || '/')

const isActiveNavItem = (to: string) => {
	const target = to.replace(/\/$/, '') || '/'
	if (target === '/') return activePath.value === '/'
	return activePath.value === target || activePath.value.startsWith(`${target}/`)
}

const prefetchRoute = (to: RouteLocationRaw) => {
	const resolved = router.resolve(to)
	if (prefetchedRoutes.has(resolved.fullPath)) return

	prefetchedRoutes.add(resolved.fullPath)

	for (const record of resolved.matched) {
		const components = record.components ?? {}

		for (const component of Object.values(components)) {
			if (typeof component === 'function') {
				void (component as RouteComponentLoader)()
			}
		}
	}
}

watch(
	() => route.fullPath,
	() => {
		open.value = false
	},
)
</script>

<template>
	<header class="site-header">
		<div
			class="bar"
			style="
				padding-top: calc(var(--p-density, 0.9) * 0.78rem);
				padding-bottom: calc(var(--p-density, 0.9) * 0.78rem);
			"
		>
		<RouterLink
			to="/"
			class="wordmark"
			aria-label="Jin — home"
				@pointerenter="prefetchRoute('/')"
				@focus="prefetchRoute('/')"
			>
				Jin<span class="dot" aria-hidden="true"></span>
			</RouterLink>

			<p
				class="role"
				style="
					margin: 0 auto 0 0;
					padding: 0;
					max-width: none;
					white-space: nowrap;
					overflow: visible;
				"
			>
				{{ site.role }}
			</p>

			<button
				class="menu-toggle"
				:aria-expanded="open"
				aria-controls="primary-nav-v3"
				@click="open = !open"
			>
				{{ open ? 'Close' : 'Menu' }}
			</button>

			<nav id="primary-nav-v3" class="nav" :class="{ 'is-open': open }" aria-label="Primary">
				<RouterLink
					v-for="item in nav"
					:key="`v3-${item.to}`"
					:to="item.to"
					class="nav-link"
					:class="{ 'nav-link--active': isActiveNavItem(item.to) }"
					:aria-current="isActiveNavItem(item.to) ? 'page' : undefined"
					@pointerenter="prefetchRoute(item.to)"
					@focus="prefetchRoute(item.to)"
				>
					{{ item.label }}
				</RouterLink>
			</nav>
		</div>
	</header>
</template>

<style scoped>
.site-header {
	position: sticky;
	top: 0;
	z-index: 40;
	background: var(--color-paper);
	border-bottom: 1px solid var(--color-hairline);
}
.bar {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	max-width: 78rem;
	margin: 0 auto;
	padding: 1.05rem clamp(1.25rem, 4vw, 3.5rem) 0;
}
.wordmark {
	font-size: 1.5rem;
	font-weight: 800;
	letter-spacing: -0.03em;
	text-decoration: none;
	color: var(--color-ink);
	display: inline-flex;
	align-items: baseline;
}
.dot {
	width: 7px;
	height: 7px;
	border-radius: 99px;
	background: var(--color-moss);
	margin-left: 3px;
}
.role {
	max-width: 78rem;
	margin: 0.25rem auto 0;
	padding: 0 clamp(1.25rem, 4vw, 3.5rem) 0.95rem;
	font-size: var(--text-xs);
	letter-spacing: 0.02em;
	color: var(--color-ink-faint);
}
.nav {
	display: flex;
	gap: clamp(1.55rem, 2vw, 2.15rem);
	margin-left: auto;
}
.nav-link {
	font-size: var(--text-sm);
	font-weight: 500;
	text-decoration: none;
	color: var(--color-ink-soft);
	padding-bottom: 2px;
	border-bottom: 1.5px solid transparent;
	transition: color 0.18s var(--ease-out-quint);
}
.nav-link:hover {
	color: var(--color-ink);
}
.nav-link--active {
	color: var(--color-moss-deep);
	border-bottom-color: var(--color-moss);
}
.menu-toggle {
	display: none;
	margin-left: auto;
	font: inherit;
	font-size: var(--text-sm);
	font-weight: 600;
	background: none;
	border: 1px solid var(--color-hairline);
	border-radius: var(--radius-md);
	padding: 0.4rem 0.85rem;
	color: var(--color-ink);
	cursor: pointer;
}

@media (max-width: 720px) {
	.role {
		display: none;
	}
	.menu-toggle {
		display: inline-block;
	}
	.nav {
		display: none;
		flex-direction: column;
		gap: 0;
		width: 100%;
		margin: 0.5rem 0 0;
		border-top: 1px solid var(--color-hairline);
	}
	.nav.is-open {
		display: flex;
	}
	.bar {
		flex-wrap: wrap;
	}
	.nav-link {
		padding: 0.85rem 0;
		border-bottom: 1px solid var(--color-hairline);
	}
	.nav-link--active {
		border-bottom-color: var(--color-hairline);
		font-weight: 700;
	}
}
</style>
