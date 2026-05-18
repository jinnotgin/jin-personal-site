<script setup lang="ts">
import { site } from '@/data/site'
const year = new Date().getFullYear()
</script>

<template>
	<footer class="site-footer">
		<div class="motif" aria-hidden="true"></div>
		<div class="inner">
			<div class="lead">
				<p class="line">What I’ve built, written, and learnt from.</p>
				<p class="sub">
					My working archive across product management, generative AI, systems thinking, and change management.
				</p>
			</div>
			<nav class="links" aria-label="Elsewhere">
				<a
					v-for="l in site.contact.links"
					:key="l.href"
					:href="l.href"
					class="flink"
					:rel="l.href.startsWith('http') ? 'noopener me' : undefined"
					:target="l.href.startsWith('http') ? '_blank' : undefined"
				>
					{{ l.label }}
				</a>
			</nav>
		</div>
		<p class="colophon">© {{ year }} {{ site.name }}</p>
	</footer>
</template>

<style scoped>
.site-footer {
	position: relative;
	margin-top: 7rem;
	background: var(--color-forest);
	color: var(--color-forest-ink);
	overflow: hidden;
}
.motif {
	position: absolute;
	inset: 0;
	pointer-events: none;
	opacity: 0.5;
	/* Generated motif if present; quiet CSS waterline if not */
	background-image:
		url('/img/water-motif-wide.webp'),
		radial-gradient(120% 80% at 80% 120%, oklch(0.4 0.05 170 / 0.45), transparent 60%);
	background-size: cover, cover;
	background-position: center bottom;
	background-repeat: no-repeat;
	mix-blend-mode: soft-light;
}
.inner {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
	justify-content: space-between;
	align-items: flex-end;
	max-width: 78rem;
	margin: 0 auto;
	padding: clamp(3.5rem, 7vw, 6rem) clamp(1.25rem, 4vw, 3.5rem) 2rem;
}
.line {
	font-size: var(--text-2xl);
	font-weight: 700;
	letter-spacing: -0.02em;
	max-width: 18.5ch;
	margin: 0;
}
.sub {
	margin: 0.85rem 0 0;
	color: var(--color-forest-soft);
	font-size: var(--text-md);
}
.links {
	display: flex;
	gap: 1.6rem;
}
.flink {
	color: var(--color-forest-ink);
	text-decoration: none;
	font-weight: 600;
	font-size: var(--text-sm);
	padding-bottom: 3px;
	border-bottom: 1.5px solid oklch(0.74 0.03 130 / 0.5);
	transition: border-color 0.18s var(--ease-out-quint);
}
.flink:hover {
	border-bottom-color: var(--color-forest-ink);
}
.colophon {
	position: relative;
	max-width: 78rem;
	margin: 0 auto;
	padding: 0 clamp(1.25rem, 4vw, 3.5rem) 2rem;
	font-size: var(--text-sm);
	color: var(--color-forest-soft);
}
</style>
