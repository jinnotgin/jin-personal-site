<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useHead } from '@unhead/vue'
import posthog from 'posthog-js'
import ConstellationMap from '@/components/ConstellationMap.vue'
import { listPosts, formatDate } from '@/lib/markdown'
import { listProjects, byMostRecentProject } from '@/lib/projects'
import { siteSeo } from '@/lib/seo'

useHead(siteSeo())

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

function trackHeroFocusClick() {
	if (building?.to) {
		posthog.capture('hero_focus_clicked', { focus_name: building.name, focus_to: building.to })
	}
}

function trackHomePostClick(slug: string, title: string) {
	posthog.capture('home_post_clicked', { post_slug: slug, post_title: title })
}

const hero = ref<HTMLElement | null>(null)
let heroRaf = 0
let heroPt = { x: 0, y: 0 }
let heroClient = { x: 0, y: 0 }
let kwEls: HTMLElement[] = []
const KW_RADIUS = 150

function applyHero() {
	heroRaf = 0
	const el = hero.value
	if (!el) return
	el.style.setProperty('--hx', heroPt.x.toFixed(4))
	el.style.setProperty('--hy', heroPt.y.toFixed(4))
	let nearest = -1
	let nearestDist = Infinity
	kwEls.forEach((kw, i) => {
		const b = kw.getBoundingClientRect()
		const cx = Math.max(b.left, Math.min(heroClient.x, b.right))
		const cy = Math.max(b.top, Math.min(heroClient.y, b.bottom))
		const dx = heroClient.x - cx
		const dy = heroClient.y - cy
		const d = Math.sqrt(dx * dx + dy * dy)
		if (d < nearestDist) {
			nearestDist = d
			nearest = i
		}
	})
	const lit = nearest >= 0 ? Math.max(0, Math.min(1, 1 - nearestDist / KW_RADIUS)) : 0
	kwEls.forEach((kw, i) => {
		kw.style.setProperty('--n', (i === nearest ? lit : 0).toFixed(3))
	})
	el.style.setProperty('--kw-active', lit.toFixed(3))
}

function onHeroMove(e: PointerEvent) {
	const el = hero.value
	if (!el) return
	const r = el.getBoundingClientRect()
	heroPt.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
	heroPt.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
	heroClient.x = e.clientX
	heroClient.y = e.clientY
	el.style.setProperty('--ha', '1')
	if (!heroRaf) heroRaf = requestAnimationFrame(applyHero)
}

function onHeroLeave() {
	const el = hero.value
	if (!el) return
	heroPt = { x: 0, y: 0 }
	el.style.setProperty('--hx', '0')
	el.style.setProperty('--hy', '0')
	el.style.setProperty('--ha', '0')
	el.style.setProperty('--kw-active', '0')
	for (const kw of kwEls) kw.style.setProperty('--n', '0')
}

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
	const heroEl = hero.value
	if (
		heroEl &&
		window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
		!window.matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		kwEls = Array.from(heroEl.querySelectorAll<HTMLElement>('.kw'))
		heroEl.addEventListener('pointermove', onHeroMove, { passive: true })
		heroEl.addEventListener('pointerleave', onHeroLeave, { passive: true })
	}

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
	const heroEl = hero.value
	if (heroEl) {
		heroEl.removeEventListener('pointermove', onHeroMove)
		heroEl.removeEventListener('pointerleave', onHeroLeave)
	}
	if (heroRaf) cancelAnimationFrame(heroRaf)
})
</script>

<template>
	<div class="home">
		<section ref="hero" class="hero">
			<div class="hero-glow" aria-hidden="true"></div>
			<div class="hero-inner shell">
				<div class="hero-body">
					<div class="hero-copy">
						<p class="hero-intro">Hi, I’m Jin.</p>
						<h1 class="hero-statement">
							I <span class="kw">track</span> early signals, then <span class="kw">build</span> to
							<span class="kw">understand</span> them.
						</h1>

						<component
							:is="building?.to ? 'RouterLink' : 'span'"
							v-if="building"
							:to="building.to"
							class="hero-building"
							:class="{ 'is-static': !building.to }"
							@click="trackHeroFocusClick()"
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
			<header class="method-head">
				<h2 id="method-title" class="method-title">Here’s how I do it.</h2>
				<p class="method-lede">
					I test ideas by putting them against real work, then watching where the tradeoffs show up.
				</p>
			</header>

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
								>I track where new signals and technologies change what teams can make, with AI as
								one current example, and what makes them worth adopting.</span
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
							Real working tools and prototypes with them, to learn what they actually change.
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
							<span>Which trade-offs, unintended consequences, and strategic bets matter.</span>
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
						<RouterLink
							:to="`/writing/${p.slug}`"
							class="latest-link"
							@click="trackHomePostClick(p.slug, p.title)"
						>
							<span class="latest-meta">
								<time :datetime="p.date">{{ formatDate(p.date) }}</time>
								<span class="dot">·</span>
								<span class="cat">{{ p.category }}</span>
							</span>
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
	letter-spacing: 0;
	line-height: 1.08;
	color: var(--color-forest-ink);
}

.hero-statement {
	font-family: var(--font-display);
	font-size: clamp(2.05rem, 1.3rem + 2.9vw, 3.65rem);
	font-weight: 600;
	line-height: 1.04;
	letter-spacing: 0;
	color: var(--color-forest-ink);
	max-width: 24ch;
	margin: 0;
	text-wrap: balance;
}
.hero-statement .kw {
	--n: 0;
	/* A lighter, lower-chroma signal so the hovered word reads as
	   "illuminated" rather than sharing the focus line's solid accent. */
	--kw-lit: oklch(0.79 0.115 126);
	position: relative;
	white-space: nowrap;
	color: color-mix(in oklch, var(--color-forest-ink), var(--kw-lit) calc(var(--n) * 100%));
	transition: --n 0.4s var(--ease-out-quint);
}
.hero-statement .kw::after {
	content: '';
	position: absolute;
	left: -0.04em;
	right: -0.04em;
	bottom: -0.06em;
	height: 2px;
	border-radius: 2px;
	background: var(--kw-lit);
	transform: scaleX(var(--n));
	transform-origin: left;
	opacity: calc(0.2 + var(--n) * 0.8);
}

@media (prefers-reduced-motion: reduce), (hover: none) {
	.hero-statement .kw {
		color: inherit;
		transition: none;
	}
	.hero-statement .kw::after {
		display: none;
	}
}
.hero-anchor {
	font-weight: 800;
	font-size: 1.2em;
	letter-spacing: 0;
	color: var(--color-signal);
}

.hero-building {
	align-self: start;
	display: grid;
	column-gap: 0.55rem;
	row-gap: 0.45rem;
	margin-top: 0.4rem;
	padding-bottom: 0.55rem;
	width: fit-content;
	text-decoration: none;
	border-bottom: 1px solid oklch(0.74 0.03 130 / 0.28);
	order: 3;
}
.hero-building-label {
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	line-height: 1;
	text-transform: uppercase;
	color: var(--color-forest-soft);
	white-space: nowrap;
}
.hero-building-name {
	font-family: var(--font-display);
	font-size: var(--text-xl);
	font-weight: 700;
	letter-spacing: 0;
	color: color-mix(
		in oklch,
		var(--color-river),
		var(--color-forest-soft) calc(var(--kw-active) * 85%)
	);
	opacity: calc(1 - var(--kw-active) * 0.28);
	line-height: 1.12;
}
.hero-building-arrow {
	color: var(--color-river);
	transition: transform 0.32s var(--ease-out-expo);
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
	pointer-events: none;
}
.hero-building.is-static .hero-building-name {
	color: color-mix(
		in oklch,
		var(--color-signal),
		var(--color-forest-soft) calc(var(--kw-active) * 85%)
	);
}

.hero-portrait {
	margin: 0;
	background: var(--color-moss-deep);
	border-radius: var(--radius-md);
	overflow: hidden;
	width: min(15rem, 62vw);
	align-self: center;
	order: -1;
	position: relative;
}
.hero-portrait img {
	display: block;
	width: 100%;
	aspect-ratio: 1;
	object-fit: cover;
	object-position: 50% 42%;
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
	.hero-building {
		display: inline-flex;
		align-items: baseline;
		gap: 0.7rem;
	}
}

/* ---- Pointer-reactive hero: parallax depth + a tracked signal glow ---- */
@property --hx {
	syntax: '<number>';
	inherits: true;
	initial-value: 0;
}
@property --hy {
	syntax: '<number>';
	inherits: true;
	initial-value: 0;
}
@property --ha {
	syntax: '<number>';
	inherits: true;
	initial-value: 0;
}
@property --kw-active {
	syntax: '<number>';
	inherits: true;
	initial-value: 0;
}

.hero {
	--hx: 0;
	--hy: 0;
	--ha: 0;
	--kw-active: 0;
	position: relative;
	transition:
		--hx 0.5s var(--ease-out-quint),
		--hy 0.5s var(--ease-out-quint),
		--ha 0.45s var(--ease-out-quint),
		--kw-active 0.4s var(--ease-out-quint);
}
.hero-glow {
	position: absolute;
	inset: 0;
	z-index: 0;
	pointer-events: none;
	background: radial-gradient(
		22rem 22rem at calc(50% + var(--hx) * 42%) calc(50% + var(--hy) * 46%),
		oklch(0.7 0.088 122 / calc(0.1 * var(--ha))),
		transparent 70%
	);
}
.hero-inner {
	position: relative;
	z-index: 1;
}
.hero-portrait {
	transform: translate3d(calc(var(--hx) * 7px), calc(var(--hy) * 7px), 0);
	transition: transform 0.4s var(--ease-out-quint);
	will-change: transform;
}
.hero-portrait img {
	transform: translate3d(calc(var(--hx) * -3.2%), calc(var(--hy) * -3.2%), 0) scale(1.07);
	transition: transform 0.5s var(--ease-out-quint);
}

@media (prefers-reduced-motion: reduce), (hover: none) {
	.hero {
		transition: none;
	}
	.hero-glow {
		display: none;
	}
	.hero-portrait,
	.hero-portrait img {
		transform: none;
		transition: none;
	}
}

/* ---- How I actually work: compact setup, then the builder loop ---- */
.method {
	padding-top: clamp(4.5rem, 12vw, 9rem);
	padding-bottom: clamp(4.5rem, 12vw, 9rem);
}
.method-head {
	margin: 0 0 clamp(3rem, 8vw, 5.5rem);
	max-width: 48rem;
}
.method-title {
	font-family: var(--font-display);
	font-size: var(--text-2xl);
	font-weight: 700;
	letter-spacing: 0;
	line-height: 1.08;
	color: var(--color-ink);
	margin: 0;
	text-wrap: balance;
}
.method-lede {
	margin: 0.9rem 0 0;
	font-size: var(--text-lg);
	line-height: 1.5;
	color: var(--color-ink-soft);
	max-width: 44ch;
}

/* --p: 0..1 scroll progress of one move. --lp: list progress (unused track). */
@property --p {
	syntax: '<number>';
	inherits: true;
	initial-value: 0;
}
@property --n {
	syntax: '<number>';
	inherits: false;
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
	font-size: clamp(2.35rem, 1.7rem + 4vw, 4.2rem);
	line-height: 0.82;
	letter-spacing: 0;
}
.move-verb .ghost,
.move-verb .fill {
	font-size: clamp(2rem, 1.35rem + 4vw, 3.15rem);
	line-height: 0.98;
	letter-spacing: 0;
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

@media (prefers-reduced-motion: reduce), (hover: none) {
	.move:hover .move-verb .fill,
	.move:focus-visible .move-verb .fill {
		color: var(--color-ink);
		-webkit-text-stroke-color: var(--color-ink);
	}
	.move-more {
		grid-template-rows: 1fr;
		opacity: 1;
		margin-top: 0.85rem;
	}
}

@media (min-width: 900px) {
	.moves {
		gap: clamp(2.4rem, 5vw, 4rem);
	}
	.move {
		grid-template-columns:
			clamp(4rem, 5vw, 6.5rem)
			minmax(14rem, 0.95fr)
			minmax(0, 1fr);
		grid-template-areas: 'num head text';
		column-gap: clamp(2.4rem, 5vw, 5rem);
		align-items: start;
	}
	.move-text {
		padding-top: 0.4rem;
	}
	.move-line {
		font-size: clamp(1.2rem, 0.9rem + 0.7vw, 1.5rem);
	}
	.move-num .ghost,
	.move-num .fill {
		font-size: clamp(2.7rem, 1.6rem + 5vw, 6.4rem);
	}
	.move-verb .ghost,
	.move-verb .fill {
		font-size: clamp(2.3rem, 1.4rem + 4vw, 4.7rem);
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
.latest-head .link {
	white-space: nowrap;
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
	display: flex;
	align-items: center;
	gap: 0.6rem;
	font-size: var(--text-xs);
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--color-ink-faint);
}
.latest-meta .cat {
	color: var(--color-moss-deep);
	font-weight: 700;
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
