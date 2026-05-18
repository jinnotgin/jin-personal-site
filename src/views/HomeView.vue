<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import ConstellationMap from '@/components/ConstellationMap.vue'
import { listPosts, formatDate } from '@/lib/markdown'
import { listProjects, byMostRecentProject } from '@/lib/projects'

const latest = listPosts().slice(0, 3)

/**
 * Currently-building pointer. Set BUILDING to:
 *   'auto'                       newest active project, resolved dynamically
 *   'promptpal' (a slug string)  pin to a specific project, links to it
 *   { label, to? }               custom label; links internally if `to` given
 */
const BUILDING: 'auto' | string | { label: string; to?: string } = {
	label: 'AI in the software lifecycle',
}

const building = (() => {
	if (typeof BUILDING === 'object') {
		return { name: BUILDING.label, to: BUILDING.to }
	}
	const project =
		BUILDING === 'auto'
			? listProjects()
					.filter((p) => p.status === 'active')
					.sort(byMostRecentProject)[0]
			: listProjects().find((p) => p.slug === BUILDING)
	return project ? { name: project.name, to: `/projects/${project.slug}` } : null
})()

const method = ref<HTMLElement | null>(null)
let raf = 0
let moveEls: HTMLElement[] = []

function update() {
	raf = 0
	const vh = window.innerHeight
	const start = vh * 1.02
	const end = vh * 0.74
	for (const el of moveEls) {
		const r = el.getBoundingClientRect()
		const anchor = r.top + r.height * 0.15
		const p = Math.max(0, Math.min(1, (start - anchor) / (start - end)))
		el.style.setProperty('--p', p.toFixed(4))
	}
	const sec = method.value
	if (sec) {
		const r = sec.getBoundingClientRect()
		const span = Math.max(r.height - vh * 0.5, 1)
		const lp = Math.max(0, Math.min(1, (vh * 0.6 - r.top) / span))
		sec.style.setProperty('--lp', lp.toFixed(4))
	}
}

function onScroll() {
	if (!raf) raf = requestAnimationFrame(update)
}

onMounted(() => {
	const el = method.value
	if (!el) return
	moveEls = Array.from(el.querySelectorAll<HTMLElement>('.move'))
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		el.style.setProperty('--lp', '1')
		moveEls.forEach((m) => m.style.setProperty('--p', '1'))
		return
	}
	update()
	window.addEventListener('scroll', onScroll, { passive: true })
	window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
	window.removeEventListener('scroll', onScroll)
	window.removeEventListener('resize', onScroll)
	if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
	<div class="home">
		<section class="hero">
			<div class="hero-inner shell">
				<div class="hero-body">
					<div class="hero-copy">
						<p class="hero-intro">Hi, I’m Jin.</p>
						<h1 class="hero-statement">
							I track emerging signals, then build to understand them.
						</h1>

						<component
							:is="building?.to ? 'RouterLink' : 'span'"
							v-if="building"
							:to="building.to"
							class="hero-building"
							:class="{ 'is-static': !building.to }"
						>
							<span class="hero-building-label">Current focus</span>
							<span class="hero-building-name">{{ building.name }}</span>
							<span v-if="building.to" class="hero-building-arrow" aria-hidden="true">→</span>
						</component>
					</div>

					<figure class="hero-portrait">
						<img
							src="/img/jin-portrait-square-800.jpg"
							srcset="
								/img/jin-portrait-square-800.jpg   800w,
								/img/jin-portrait-square-1200.jpg 1200w
							"
							sizes="(min-width: 760px) 18rem, min(15rem, 62vw)"
							alt="Jin outdoors, smiling in a denim shirt."
						/>
					</figure>
				</div>
			</div>
		</section>

		<section ref="method" class="method shell" aria-labelledby="method-title">
			<h2 id="method-title" class="method-title">
				I don’t trust ideas that never meet the work. I build until the tradeoffs show up.
			</h2>

			<ol class="moves">
				<li class="move" tabindex="0">
					<span class="move-num">
						<span class="ghost">01</span>
						<span class="fill" aria-hidden="true">01</span>
					</span>
					<div class="move-head">
						<h3 class="move-verb">
							<span class="ghost">Track</span>
							<span class="fill" aria-hidden="true">Track</span>
						</h3>
						<span class="move-rule" aria-hidden="true"></span>
					</div>
					<div class="move-text">
						<p class="move-line">Early signs while they are still unclear and messy.</p>
						<p class="move-more">
							<span
								>I look for where AI changes what teams can make, where it can become relevant,
								and what has to be true before it is worth adopting.</span
							>
						</p>
					</div>
				</li>
				<li class="move" tabindex="0">
					<span class="move-num">
						<span class="ghost">02</span>
						<span class="fill" aria-hidden="true">02</span>
					</span>
					<div class="move-head">
						<h3 class="move-verb">
							<span class="ghost">Build</span>
							<span class="fill" aria-hidden="true">Build</span>
						</h3>
						<span class="move-rule" aria-hidden="true"></span>
					</div>
					<div class="move-text">
						<p class="move-line">
							Real tools and prototypes with them, to learn what they actually change.
						</p>
						<p class="move-more">
							<span
								>Shipping proof-of-concepts to see what those early signs do to teams,
								organisations, and digital systems.</span
							>
						</p>
					</div>
				</li>
				<li class="move" tabindex="0">
					<span class="move-num">
						<span class="ghost">03</span>
						<span class="fill" aria-hidden="true">03</span>
					</span>
					<div class="move-head">
						<h3 class="move-verb">
							<span class="ghost">Understand</span>
							<span class="fill" aria-hidden="true">Understand</span>
						</h3>
						<span class="move-rule" aria-hidden="true"></span>
					</div>
					<div class="move-text">
						<p class="move-line">
							Their second and third-order effects on teams and organisations.
						</p>
						<p class="move-more">
							<span
								>Which trade-offs, unintended consequences, and strategic bets matter.</span
							>
						</p>
					</div>
				</li>
			</ol>
		</section>

		<div class="shell home-rest">
			<section class="map-lead">
				<h2>The threads I keep returning to</h2>
				<p class="map-instruction">
					<span class="map-instruction-mark" aria-hidden="true"></span>
					Choose one to see the writing and projects behind it.
				</p>
			</section>

			<ConstellationMap />

			<section class="latest">
				<div class="latest-head">
					<h2>Recent notes on what I’m learning</h2>
					<RouterLink to="/writing" class="link">All writing →</RouterLink>
				</div>
				<ul>
					<li v-for="p in latest" :key="p.slug">
						<RouterLink :to="`/writing/${p.slug}`" class="latest-link">
							<span class="latest-meta">{{ formatDate(p.date) }} · {{ p.category }}</span>
							<span class="latest-title">{{ p.title }}</span>
							<span class="latest-excerpt">{{ p.excerpt }}</span>
						</RouterLink>
					</li>
				</ul>
				<div class="latest-footer">
					<RouterLink to="/writing" class="latest-more link"> View all writing → </RouterLink>
				</div>
			</section>
		</div>
	</div>
</template>

<style scoped>
/* ---- Hero: forest-drenched first viewport ---- */
.hero {
	background: var(--color-forest);
	color: var(--color-forest-ink);
	border-bottom: 1px solid oklch(0.302 0.038 158 / 0.5);
	overflow: clip;
}
.hero-inner {
	padding-top: clamp(2rem, 5vw, 3.6rem);
	padding-bottom: clamp(2rem, 5vw, 3.6rem);
}

.hero-body {
	display: grid;
	gap: clamp(1.6rem, 5vw, 3rem);
	align-items: center;
	animation: hero-rise 0.9s var(--ease-out-expo) 0.08s both;
}
.hero-copy {
	display: contents;
	min-width: 0;
}

.hero-intro {
	margin: 0 0 0.5rem;
	font-family: var(--font-display);
	font-size: clamp(1.45rem, 1.2rem + 1.1vw, 2rem);
	font-weight: 700;
	letter-spacing: -0.02em;
	line-height: 1.08;
	color: var(--color-forest-ink);
}

.hero-statement {
	font-family: var(--font-display);
	font-size: clamp(2.05rem, 1.3rem + 2.9vw, 3.65rem);
	font-weight: 600;
	line-height: 1.04;
	letter-spacing: -0.026em;
	color: var(--color-forest-ink);
	max-width: 24ch;
	margin: 0;
	text-wrap: balance;
}
.hero-turn {
	display: block;
	margin-top: 0.3em;
	font-size: 0.58em;
	line-height: 1.08;
	color: var(--color-forest-soft);
	font-weight: 500;
}
.hero-anchor {
	font-weight: 800;
	font-size: 1.2em;
	letter-spacing: -0.04em;
	color: var(--color-signal);
}

.hero-building {
	align-self: start;
	display: inline-flex;
	align-items: baseline;
	gap: 0.6rem;
	margin-top: 0.4rem;
	padding-bottom: 3px;
	width: fit-content;
	text-decoration: none;
	border-bottom: 1px solid oklch(0.52 0.078 222 / 0.45);
	order: 3;
	transition: border-color 0.3s var(--ease-out-quint);
}
.hero-building-label {
	font-size: var(--text-xs);
	font-weight: 600;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: var(--color-forest-soft);
	white-space: nowrap;
}
.hero-building-name {
	font-family: var(--font-display);
	font-size: var(--text-lg);
	font-weight: 700;
	letter-spacing: -0.02em;
	color: var(--color-river);
}
.hero-building-arrow {
	color: var(--color-river);
	transition: transform 0.32s var(--ease-out-expo);
}
.hero-building:hover {
	border-color: var(--color-river);
}
.hero-building:hover .hero-building-arrow {
	transform: translateX(4px);
}
.hero-building:focus-visible {
	outline: none;
	border-radius: var(--radius-sm);
	box-shadow: 0 0 0 2px oklch(0.7 0.088 122 / 0.55);
}
.hero-building.is-static {
	border-bottom-color: oklch(0.74 0.03 130 / 0.32);
	pointer-events: none;
}
.hero-building.is-static .hero-building-name {
	color: var(--color-signal);
}

.hero-portrait {
	margin: 0;
	background: var(--color-moss-deep);
	border-radius: var(--radius-md);
	overflow: hidden;
	width: min(15rem, 62vw);
	align-self: center;
	order: -1;
}
.hero-portrait::after {
	content: '';
	position: absolute;
	inset: 0;
	background: linear-gradient(205deg, oklch(0.302 0.038 158 / 0.12), oklch(0.424 0.078 152 / 0.32));
	opacity: 1;
	transition: opacity 0.55s var(--ease-out-quint);
	pointer-events: none;
}
.hero-portrait {
	position: relative;
}
.hero-portrait img {
	display: block;
	width: 100%;
	aspect-ratio: 1;
	object-fit: cover;
	object-position: 50% 42%;
	filter: saturate(0.72) brightness(1.04) contrast(0.99);
	transition: filter 0.55s var(--ease-out-quint);
}
.hero-portrait:hover img,
.hero-portrait:focus-within img {
	filter: saturate(1) brightness(1) contrast(1);
}
.hero-portrait:hover::after,
.hero-portrait:focus-within::after {
	opacity: 0;
}

@media (prefers-reduced-motion: reduce), (hover: none) {
	.move-more {
		grid-template-rows: 1fr;
		opacity: 1;
		margin-top: 0.85rem;
	}
}
@media (hover: none) {
	.hero-portrait img {
		filter: none;
	}
	.hero-portrait::after {
		opacity: 0;
	}
}

@media (min-width: 760px) {
	.hero-body {
		grid-template-columns: minmax(0, 1fr) 18rem;
		gap: clamp(2.25rem, 5vw, 4rem);
	}
	.hero-copy {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: clamp(1.2rem, 2.5vw, 1.8rem);
	}
	.hero-portrait {
		width: 18rem;
		align-self: center;
		order: initial;
	}
}

@keyframes hero-rise {
	from {
		opacity: 0;
		transform: translateY(1.4rem);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* ---- How I actually work: bold builder statement ---- */
.method {
	padding-top: clamp(4.5rem, 12vw, 9rem);
	padding-bottom: clamp(4.5rem, 12vw, 9rem);
}
.method-eyebrow {
	display: flex;
	align-items: center;
	gap: 0.7rem;
	margin: 0 0 1.4rem;
	font-size: var(--text-xs);
	font-weight: 600;
	letter-spacing: 0.2em;
	text-transform: uppercase;
	color: var(--color-moss-deep);
}
.method-eyebrow::before {
	content: '';
	width: 2rem;
	height: 2px;
	background: var(--color-moss);
}
.method-title {
	font-family: var(--font-display);
	font-size: clamp(2rem, 1.2rem + 3.4vw, 3.7rem);
	font-weight: 700;
	letter-spacing: -0.03em;
	line-height: 1.04;
	color: var(--color-ink);
	margin: 0 0 clamp(3rem, 8vw, 6rem);
	max-width: 20ch;
	text-wrap: balance;
}

/* --p: 0..1 scroll progress of one move. --lp: list progress (unused track). */
@property --p {
	syntax: '<number>';
	inherits: true;
	initial-value: 0;
}

.moves {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: clamp(2.5rem, 6vw, 5rem);
}
.move {
	--p: 0;
	position: relative;
	display: grid;
	grid-template-columns: clamp(3rem, 9vw, 7rem) 1fr;
	grid-template-areas:
		'num head'
		'num text';
	column-gap: clamp(1.1rem, 3vw, 2.2rem);
	row-gap: clamp(0.9rem, 2vw, 1.4rem);
	align-items: start;
	outline: none;
	cursor: default;
	transform: translate3d(calc((1 - var(--p)) * -1.4rem), 0, 0);
	transition: --p 0.16s linear;
}
.move-num {
	grid-area: num;
}
.move-head {
	grid-area: head;
}
.move-text {
	grid-area: text;
	min-width: 0;
}

/* Layered build: ghost + fill share one grid cell so they register exactly;
   both carry identical text-stroke so geometry matches at any viewport. */
.move-num,
.move-verb {
	display: inline-grid;
	font-family: var(--font-display);
	font-weight: 700;
	margin: 0;
}
.ghost,
.fill {
	grid-area: 1 / 1;
	display: block;
	white-space: nowrap;
	padding-right: 0.12em;
}
.move-num .ghost,
.move-num .fill {
	font-size: clamp(2.7rem, 1.6rem + 5vw, 6.4rem);
	line-height: 0.82;
	letter-spacing: -0.04em;
}
.move-verb .ghost,
.move-verb .fill {
	font-size: clamp(2.3rem, 1.4rem + 4vw, 4.7rem);
	line-height: 0.98;
	letter-spacing: -0.035em;
}
/* Ghost shows the not-yet-built right portion; fill shows the built left
   portion. They are clipped to complementary halves of the same box, so a
   built row has zero ghost left to fringe and they meet cleanly mid-scrub. */
.ghost {
	color: transparent;
	-webkit-text-stroke-width: 1.25px;
	clip-path: inset(-0.2em -0.2em -0.2em calc(var(--p) * 100%));
}
.fill {
	-webkit-text-stroke-width: 1.25px;
	clip-path: inset(-0.2em calc((1 - var(--p)) * 100%) -0.2em -0.2em);
}
.move-num .ghost {
	-webkit-text-stroke-color: oklch(0.852 0.02 132 / 0.9);
}
.move-verb .ghost {
	-webkit-text-stroke-color: oklch(0.572 0.019 150 / 0.55);
}
.move-num .fill {
	color: var(--color-signal);
	-webkit-text-stroke-color: var(--color-signal);
}
.move-verb .fill {
	color: var(--color-ink);
	-webkit-text-stroke-color: var(--color-ink);
}
.move:hover .move-verb .fill,
.move:focus-visible .move-verb .fill {
	color: var(--color-moss-deep);
	-webkit-text-stroke-color: var(--color-moss-deep);
}

.move-rule {
	display: block;
	width: clamp(3rem, 8vw, 5.5rem);
	height: 4px;
	margin: clamp(0.85rem, 1.8vw, 1.3rem) 0 0;
	background: var(--color-signal);
	transform: scaleX(var(--p));
	transform-origin: left;
}
.move-line {
	margin: 0;
	font-size: clamp(1.15rem, 1rem + 0.7vw, 1.55rem);
	line-height: 1.42;
	color: var(--color-ink-soft);
	max-width: 40ch;
	text-wrap: pretty;
}
.move-more {
	margin: 0;
	display: grid;
	grid-template-rows: 0fr;
	opacity: 0;
	transition:
		grid-template-rows 0.55s var(--ease-out-expo),
		opacity 0.4s var(--ease-out-quint);
}
.move-more > span {
	display: block;
	overflow: hidden;
	min-height: 0;
	font-size: var(--text-base);
	line-height: 1.55;
	color: var(--color-ink-faint);
	max-width: 42ch;
}
.move:hover .move-more,
.move:focus-visible .move-more {
	grid-template-rows: 1fr;
	opacity: 1;
	margin-top: 0.85rem;
}
.move:focus-visible {
	border-radius: var(--radius-sm);
	box-shadow: 0 0 0 2px oklch(0.7 0.088 122 / 0.55);
}

@media (min-width: 900px) {
	.moves {
		gap: clamp(2.4rem, 5vw, 4rem);
	}
	.move {
		grid-template-columns:
			clamp(4rem, 5vw, 6.5rem)
			minmax(11rem, 0.8fr)
			minmax(0, 1.15fr);
		grid-template-areas: 'num head text';
		column-gap: clamp(2rem, 5vw, 4.5rem);
		align-items: start;
	}
	.move-text {
		padding-top: 0.4rem;
	}
	.move-line {
		font-size: clamp(1.2rem, 0.9rem + 0.7vw, 1.5rem);
	}
}

@media (prefers-reduced-motion: reduce) {
	.move {
		transform: none;
		transition: none;
	}
}

.map-lead {
	margin-top: 0;
	max-width: 40rem;
}
.map-lead h2 {
	font-size: var(--text-2xl);
	max-width: 22ch;
	margin: 0;
}
.map-instruction {
	display: flex;
	align-items: baseline;
	gap: 0.6rem;
	margin: 1rem 0 0;
	font-size: var(--text-base);
	color: var(--color-ink-soft);
}
.map-instruction-mark {
	flex: none;
	align-self: center;
	width: 1.4rem;
	height: 1px;
	background: var(--color-moss);
}

.latest {
	margin-top: clamp(5rem, 12vw, 9.5rem);
	padding-bottom: clamp(4rem, 9vw, 7rem);
}
.latest-head {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 1rem;
	padding-bottom: 1.25rem;
	border-bottom: 1px solid var(--color-hairline);
}
.latest-head h2 {
	font-size: var(--text-2xl);
}
.latest ul {
	list-style: none;
	margin: 0;
	padding: 0;
}
.latest li {
	border-bottom: 1px solid var(--color-hairline);
}
.latest-link {
	display: grid;
	gap: 0.35rem;
	padding: 1.5rem 0;
	text-decoration: none;
	color: var(--color-ink);
}
.latest-link:hover .latest-title {
	color: var(--color-moss-deep);
}
.latest-meta {
	font-size: var(--text-xs);
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--color-ink-faint);
}
.latest-title {
	font-size: var(--text-xl);
	font-weight: 700;
	transition: color 0.18s var(--ease-out-quint);
}
.latest-excerpt {
	color: var(--color-ink-soft);
	max-width: 62ch;
}

.latest-footer {
	padding-top: 1.5rem;
	text-align: right;
}
.latest-more {
	font-size: var(--text-sm);
	letter-spacing: 0.04em;
}
</style>
