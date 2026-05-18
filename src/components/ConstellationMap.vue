<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { threads } from '@/data/threads'
import { byMostRecentProject, projectsByThread } from '@/lib/projects'
import { postsByThread, slugifyCategory } from '@/lib/markdown'
import { journey } from '@/data/journey'
import type { ThreadId } from '@/data/types'

const CX = 50
const CY = 54
const RX = 34
const RY = 38

const WRITING_PREVIEW = 3
const PROJECT_PREVIEW = 3
const SELECTED_THREAD_STORAGE_KEY = 'jin:selected-thread'

function isThreadId(value: string | null): value is ThreadId {
	return threads.some((thread) => thread.id === value)
}

function storedThreadId(): ThreadId {
	if (typeof window === 'undefined') return threads[0]!.id
	const stored = window.sessionStorage.getItem(SELECTED_THREAD_STORAGE_KEY)
	return isThreadId(stored) ? stored : threads[0]!.id
}

const initialThread = storedThreadId()
const selected = ref<ThreadId>(initialThread)
const committed = ref<ThreadId | null>(initialThread === threads[0]!.id ? null : initialThread)
const touched = computed(() => committed.value !== null)
const fieldEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const switcherEl = ref<HTMLElement | null>(null)
const mapStartEl = ref<HTMLElement | null>(null)
const trailHeadEl = ref<HTMLElement | null>(null)
const railListEl = ref<HTMLElement | null>(null)
const mapEndEl = ref<HTMLElement | null>(null)
const pointer = ref({ x: 0.5, y: 0.5, active: false })

// The sticky rail is a second copy of the switcher. It is live only in the
// window between "the map has scrolled out of comfortable reach" and "the
// reader has left the trail entirely" (i.e. entered the writing section).
const pastSwitcher = ref(false)
const pastTrail = ref(false)
const railVisible = computed(() => pastSwitcher.value && !pastTrail.value)
const railTop = ref(0)
const railHeight = ref(56)
const railOverflowing = ref(false)
const railEl = ref<HTMLElement | null>(null)

// How many px of the switcher should still be on screen at the moment the
// rail appears, i.e. the rail kicks in once (switcherHeight - REMAINING) has
// scrolled past the header. Larger = appears earlier (more still showing);
// smaller = waits until almost all of it is gone.
const RAIL_REVEAL_REMAINING = 120

// How many px before the trail's true end the rail should retire. Larger =
// vanishes earlier (further from the writing section).
const RAIL_HIDE_OFFSET = 120

let frame = 0
let resizeObserver: ResizeObserver | undefined
let switcherObserver: IntersectionObserver | undefined
let endObserver: IntersectionObserver | undefined
let reduceMotion = false

function measureRailTop() {
	const header = document.querySelector<HTMLElement>('.site-header')
	railTop.value = header ? Math.round(header.getBoundingClientRect().height) : 0
}

function measureRailHeight() {
	const el = railEl.value
	railHeight.value = el ? Math.round(el.getBoundingClientRect().height) : 56
}

function measureRailOverflow() {
	const list = railListEl.value
	railOverflowing.value = !!list && list.scrollWidth - list.clientWidth > 1
}

// Rebuilt whenever the header height changes: both observers' top inset must
// track the sticky header. The switcher observer reveals the rail as soon as
// the map slips under the header; the end observer hides it again once the
// trail's end passes under the header, so it never bleeds into the writing.
function buildObservers() {
	switcherObserver?.disconnect()
	endObserver?.disconnect()

	// Anchored to a sentinel at the very top of the map block. The rail appears
	// once (switcherHeight - REMAINING) has scrolled past the header, where
	// REMAINING is the px of switcher still wanted on screen at that moment. A
	// positive rootMargin top grows the root upward so the sentinel must travel
	// further to exit it. Height and layout are re-measured so this tracks
	// whichever component (desktop constellation vs mobile stack) is live.
	const switcherHeight = switcherEl.value?.getBoundingClientRect().height ?? 0
	const revealLine = Math.round(railTop.value - (switcherHeight - RAIL_REVEAL_REMAINING))
	switcherObserver = new IntersectionObserver(
		([entry]) => {
			if (!entry) return
			pastSwitcher.value = !entry.isIntersecting && entry.boundingClientRect.top < revealLine
		},
		{ threshold: 0, rootMargin: `${-revealLine}px 0px 0px 0px` },
	)
	if (mapStartEl.value) switcherObserver.observe(mapStartEl.value)

	// Hide the rail RAIL_HIDE_OFFSET px before the trail's end actually reaches
	// the header, so it clears out as the reader approaches the writing section
	// rather than lingering until the very last pixel of the trail.
	const hideLine = railTop.value + RAIL_HIDE_OFFSET
	endObserver = new IntersectionObserver(
		([entry]) => {
			if (!entry) return
			pastTrail.value = !entry.isIntersecting && entry.boundingClientRect.top < hideLine
		},
		{ threshold: 0, rootMargin: `-${hideLine}px 0px 0px 0px` },
	)
	if (mapEndEl.value) endObserver.observe(mapEndEl.value)
}

// Deliberate choice (click / keyboard focus): locks the selection so hover
// can no longer change it.
function commit(id: ThreadId) {
	selected.value = id
	committed.value = id
	window.sessionStorage.setItem(SELECTED_THREAD_STORAGE_KEY, id)
}

// Switching from the rail changes content far above the fold, so bring the
// new pattern's head into view to confirm the switch instead of leaving the
// reader stranded mid-trail in a now-different thread.
function commitFromRail(id: ThreadId) {
	commit(id)
	requestAnimationFrame(() => {
		trailHeadEl.value?.scrollIntoView({
			behavior: reduceMotion ? 'auto' : 'smooth',
			block: 'start',
		})
		scrollRailToActive()
	})
}

// Keep the active rail item visible when the selection changes or the rail
// appears. Without this, the active thread can sit off-screen in the
// horizontally-scrolling rail on narrow viewports.
function scrollRailToActive() {
	const list = railListEl.value
	if (!list) return
	const active = list.querySelector<HTMLElement>('.rail-item.active')
	if (!active) return
	const listRect = list.getBoundingClientRect()
	const itemRect = active.getBoundingClientRect()
	const offset = itemRect.left - listRect.left - (listRect.width - itemRect.width) / 2
	list.scrollBy({ left: offset, behavior: 'smooth' })
}

watch(railVisible, (visible) => {
	if (visible) requestAnimationFrame(scrollRailToActive)
})

// Non-committal hover preview: only steers the map until the visitor has
// actually committed to a thread.
function preview(id: ThreadId) {
	if (committed.value !== null) return
	selected.value = id
}

const writingPreview = computed(() => trail.value.writing.slice(0, WRITING_PREVIEW))

const writingOverflow = computed(() => trail.value.writing.length - WRITING_PREVIEW)

const projectPreview = computed(() => trail.value.projects.slice(0, PROJECT_PREVIEW))

const projectOverflow = computed(() => trail.value.projects.length - PROJECT_PREVIEW)

const writingCategoryParam = computed(() => {
	const cats = trail.value.writing.map((w) => w.category)
	if (!cats.length) return null
	const freq = cats.reduce<Record<string, number>>((acc, c) => {
		acc[c] = (acc[c] ?? 0) + 1
		return acc
	}, {})
	return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
})

function trackPointer(event: PointerEvent) {
	const field = fieldEl.value
	if (!field) return

	const rect = field.getBoundingClientRect()
	pointer.value = {
		x: (event.clientX - rect.left) / rect.width,
		y: (event.clientY - rect.top) / rect.height,
		active: true,
	}
}

function releasePointer() {
	pointer.value = { ...pointer.value, active: false }
}

const nodes = computed(() =>
	threads.map((t) => {
		const rad = (t.angle * Math.PI) / 180
		return {
			...t,
			x: CX + RX * Math.cos(rad),
			y: CY + RY * Math.sin(rad),
			placement: labelPlacement(CX + RX * Math.cos(rad), CY + RY * Math.sin(rad)),
		}
	}),
)

const active = computed(() => threads.find((t) => t.id === selected.value)!)

const trail = computed(() => {
	const t = active.value
	return {
		projects: projectsByThread(t.id).sort(byMostRecentProject),
		writing: postsByThread(t.id),
		journey: journey.filter((j) => t.journey.includes(j.id)),
		external: t.external ?? [],
	}
})

function curve(x: number, y: number): string {
	const mx = (CX + x) / 2
	const my = (CY + y) / 2 - 7
	return `M ${CX} ${CY} Q ${mx} ${my} ${x} ${y}`
}

function canvasCurve(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	x: number,
	y: number,
) {
	const startX = (CX / 100) * width
	const startY = (CY / 100) * height
	const endX = (x / 100) * width
	const endY = (y / 100) * height
	const controlX = ((CX + x) / 200) * width
	const controlY = (((CY + y) / 2 - 7) / 100) * height

	ctx.moveTo(startX, startY)
	ctx.quadraticCurveTo(controlX, controlY, endX, endY)
}

function pointOnCurve(width: number, height: number, x: number, y: number, t: number) {
	const startX = (CX / 100) * width
	const startY = (CY / 100) * height
	const endX = (x / 100) * width
	const endY = (y / 100) * height
	const controlX = ((CX + x) / 200) * width
	const controlY = (((CY + y) / 2 - 7) / 100) * height
	const inv = 1 - t

	return {
		x: inv * inv * startX + 2 * inv * t * controlX + t * t * endX,
		y: inv * inv * startY + 2 * inv * t * controlY + t * t * endY,
	}
}

function prepareCanvas() {
	const canvas = canvasEl.value
	const field = fieldEl.value
	if (!canvas || !field) return

	const rect = field.getBoundingClientRect()
	const dpr = Math.min(window.devicePixelRatio || 1, 2)
	canvas.width = Math.round(rect.width * dpr)
	canvas.height = Math.round(rect.height * dpr)
	canvas.style.width = `${rect.width}px`
	canvas.style.height = `${rect.height}px`

	const ctx = canvas.getContext('2d')
	if (!ctx) return

	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function drawConstellation(time: number) {
	const canvas = canvasEl.value
	const field = fieldEl.value
	const ctx = canvas?.getContext('2d')
	if (!canvas || !field || !ctx) return

	const rect = field.getBoundingClientRect()
	const width = rect.width
	const height = rect.height
	ctx.clearRect(0, 0, width, height)

	const drift = reduceMotion ? 0 : time * 0.001
	const pointerX = pointer.value.x * width
	const pointerY = pointer.value.y * height

	if (pointer.value.active) {
		const glow = ctx.createRadialGradient(
			pointerX,
			pointerY,
			0,
			pointerX,
			pointerY,
			Math.max(width, height) * 0.36,
		)
		glow.addColorStop(0, 'rgba(92, 143, 98, 0.07)')
		glow.addColorStop(0.58, 'rgba(92, 143, 98, 0.022)')
		glow.addColorStop(1, 'rgba(92, 143, 98, 0)')
		ctx.fillStyle = glow
		ctx.fillRect(0, 0, width, height)
	}

	nodes.value.forEach((n, index) => {
		const isActive = n.id === selected.value
		const phase = drift + index * 0.72
		const nodeBreath = reduceMotion ? 0 : Math.sin(phase) * 0.55

		ctx.beginPath()
		canvasCurve(ctx, width, height, n.x, n.y + nodeBreath)
		ctx.strokeStyle = isActive ? 'rgba(56, 128, 82, 0.68)' : 'rgba(176, 204, 177, 0.46)'
		ctx.lineWidth = isActive ? 1.6 : 0.9
		ctx.stroke()

		if (!reduceMotion && isActive) {
			for (let i = 0; i < 3; i += 1) {
				const t = (drift * 0.22 + i * 0.34) % 1
				const p = pointOnCurve(width, height, n.x, n.y + nodeBreath, t)
				const radius = 2.4 + Math.sin(drift * 5 + i) * 0.75
				ctx.beginPath()
				ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
				ctx.fillStyle = `rgba(56, 128, 82, ${0.1 + t * 0.38})`
				ctx.fill()
			}
		}

		const nodeX = (n.x / 100) * width
		const nodeY = ((n.y + nodeBreath) / 100) * height
		const dx = pointerX - nodeX
		const dy = pointerY - nodeY
		const distance = Math.sqrt(dx * dx + dy * dy)
		const pull = pointer.value.active ? Math.max(0, 1 - distance / 220) : 0

		ctx.beginPath()
		ctx.arc(nodeX, nodeY, isActive ? 13 : 9 + pull * 7, 0, Math.PI * 2)
		ctx.strokeStyle = isActive
			? 'rgba(56, 128, 82, 0.2)'
			: `rgba(56, 128, 82, ${0.05 + pull * 0.16})`
		ctx.lineWidth = isActive ? 1.2 : 1
		ctx.stroke()
	})
}

function animate(time = 0) {
	drawConstellation(time)
	if (!reduceMotion) {
		frame = window.requestAnimationFrame(animate)
	}
}

function restartAnimation() {
	window.cancelAnimationFrame(frame)
	prepareCanvas()
	animate()
}

function labelPlacement(x: number, y: number): 'top' | 'right' | 'bottom' | 'left' {
	if (y < CY - 18) return 'top'
	if (y > CY + 18) return 'bottom'
	return x > CX ? 'right' : 'left'
}

watch(selected, () => {
	if (reduceMotion) restartAnimation()
})

onMounted(() => {
	reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	prepareCanvas()
	resizeObserver = new ResizeObserver(restartAnimation)
	if (fieldEl.value) resizeObserver.observe(fieldEl.value)
	animate()

	measureRailTop()
	measureRailHeight()
	measureRailOverflow()
	buildObservers()
	window.addEventListener('resize', onResize)
})

function onResize() {
	measureRailTop()
	measureRailHeight()
	measureRailOverflow()
	buildObservers()
}

onBeforeUnmount(() => {
	window.cancelAnimationFrame(frame)
	resizeObserver?.disconnect()
	switcherObserver?.disconnect()
	endObserver?.disconnect()
	window.removeEventListener('resize', onResize)
})
</script>

<template>
	<section class="map" aria-labelledby="map-heading">
		<h2 id="map-heading" class="sr-only">Recurring threads</h2>

		<div ref="switcherEl" class="switcher">
			<span ref="mapStartEl" class="map-start-sentinel" aria-hidden="true"></span>
			<!-- Constellation: decorative wires + identity, real buttons over it -->
			<div ref="fieldEl" class="field" @pointermove="trackPointer" @pointerleave="releasePointer">
				<canvas ref="canvasEl" class="field-canvas" aria-hidden="true"></canvas>
				<svg class="wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
					<path
						v-for="n in nodes"
						:key="n.id"
						:d="curve(n.x, n.y)"
						class="wire"
						:class="{ lit: n.id === selected }"
					/>
				</svg>

				<div class="centre" :style="{ left: CX + '%', top: CY + '%' }" aria-hidden="true">
					<img
						class="centre-avatar"
						src="/img/jin-portrait-square-800.jpg"
						alt=""
						loading="lazy"
					/>
				</div>

				<div class="node-layer">
					<button
						v-for="n in nodes"
						:key="n.id"
						class="node"
						:class="[
							`node--${n.placement}`,
							{
								active: n.id === selected,
								preselected: n.id === selected && committed === null,
								inviting: !touched && n.id !== selected,
							},
						]"
						:style="{ left: n.x + '%', top: n.y + '%' }"
						:aria-pressed="n.id === committed"
						@click="commit(n.id)"
						@focus="commit(n.id)"
						@pointerenter="preview(n.id)"
					>
						<span class="node-dot" aria-hidden="true"></span>
						<span class="node-label">{{ n.label }}</span>
					</button>
				</div>
			</div>

			<!-- Stacked index: same threads, source of truth on narrow screens -->
			<div class="stacked">
				<button
					v-for="(t, i) in threads"
					:key="t.id"
					class="stack-item"
					:class="{
						'stack-item--active': t.id === selected,
						'stack-item--committed': t.id === committed,
					}"
					:style="{ '--i': i }"
					:aria-pressed="t.id === selected"
					@click="commit(t.id)"
				>
					<span class="stack-dot" aria-hidden="true"></span>
					<span class="stack-text">
						<span class="stack-label">{{ t.label }}</span>
						<span class="stack-line">{{ t.line }}</span>
					</span>
					<span class="stack-mark" aria-hidden="true">
						{{ t.id === selected ? 'Tracing below' : 'Trace' }}
					</span>
				</button>
			</div>
		</div>

		<!-- Sticky rail: takes over once the switcher above is out of view -->
		<nav
			ref="railEl"
			class="thread-rail"
			:class="{ 'is-visible': railVisible }"
			:style="{ top: railTop + 'px' }"
			aria-label="Switch pattern"
			:aria-hidden="!railVisible"
		>
			<div class="thread-rail-inner">
				<span class="thread-rail-eyebrow" aria-hidden="true">Patterns</span>
				<div ref="railListEl" class="thread-rail-list" :class="{ overflowing: railOverflowing }">
					<button
						v-for="t in threads"
						:key="t.id"
						class="rail-item"
						:class="{ active: t.id === selected, committed: t.id === committed }"
						:aria-current="t.id === selected ? 'true' : undefined"
						:tabindex="railVisible ? 0 : -1"
						@click="commitFromRail(t.id)"
					>
						<span class="rail-dot" aria-hidden="true"></span>
						{{ t.label }}
					</button>
				</div>
			</div>
		</nav>

		<!-- The trail: evidence for the selected thread -->
		<div
			:key="selected"
			class="trail"
			role="region"
			aria-live="polite"
			:aria-label="`Trail for ${active.label}`"
		>
			<header
				ref="trailHeadEl"
				class="trail-head"
				:style="{ scrollMarginTop: railTop + railHeight + 42 + 'px' }"
			>
				<p class="trail-cue">
					<span class="trail-cue-mark" aria-hidden="true"></span>
					Tracing this thread
				</p>
				<h3>{{ active.label }}</h3>
				<p class="trail-blurb measure">{{ active.blurb }}</p>
			</header>

			<div class="trail-grid" :key="selected">
				<div v-if="trail.journey.length" class="trail-col">
					<p class="col-title">In the Journey</p>
					<ul>
						<li v-for="j in trail.journey" :key="j.id">
							<RouterLink to="/journey" class="trail-link">{{ j.role }}</RouterLink>
							<span class="trail-note">{{ j.period }} · {{ j.org }}</span>
						</li>
					</ul>
				</div>

				<div v-if="trail.writing.length" class="trail-col">
					<p class="col-title">Writing</p>
					<ul>
						<li v-for="w in writingPreview" :key="w.slug">
							<RouterLink :to="`/writing/${w.slug}`" class="trail-link">
								{{ w.title }}
							</RouterLink>
							<span class="trail-note">{{ w.excerpt }}</span>
						</li>
					</ul>
					<div v-if="writingOverflow > 0" class="trail-list-footer">
						<RouterLink
							:to="
								writingCategoryParam
									? `/writing?category=${slugifyCategory(writingCategoryParam)}`
									: '/writing'
							"
							class="trail-all-link"
							>View all in this thread →</RouterLink
						>
					</div>
				</div>

				<div v-if="trail.projects.length" class="trail-col">
					<p class="col-title">Projects and tools</p>
					<ul>
						<li v-for="p in projectPreview" :key="p.slug">
							<RouterLink :to="`/projects/${p.slug}`" class="trail-link">
								{{ p.name }}
							</RouterLink>
							<span class="trail-note">{{ p.intent }}</span>
						</li>
					</ul>
					<div v-if="projectOverflow > 0" class="trail-list-footer">
						<RouterLink to="/projects" class="trail-all-link">View all in this thread →</RouterLink>
					</div>
				</div>

				<div v-if="trail.external.length" class="trail-col">
					<p class="col-title">Elsewhere</p>
					<ul>
						<li v-for="e in trail.external" :key="e.href">
							<a :href="e.href" class="trail-link" target="_blank" rel="noopener"
								>{{ e.label }} ↗</a
							>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<span ref="mapEndEl" class="map-end-sentinel" aria-hidden="true"></span>
	</section>
</template>

<style scoped>
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	white-space: nowrap;
}

.map {
	margin-top: clamp(1.25rem, 3vw, 2.25rem);
}

/* ---------- base / narrow: stacked index is the truth ---------- */
.field {
	display: none;
}

.stacked {
	position: relative;
	display: grid;
	border-top: 1px solid var(--color-hairline);
}

.stack-item {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem;
	text-align: left;
	padding: 0.72rem 0.4rem 0.72rem 0.9rem;
	background: none;
	border: 0;
	border-bottom: 1px solid var(--color-hairline);
	cursor: pointer;
	font: inherit;
	color: var(--color-ink);
	z-index: 1;
	transition:
		background 0.25s var(--ease-out-quint),
		transform 0.12s var(--ease-out-quint);
	/* Staggered entry animation */
	animation: stack-enter 0.48s calc(var(--i) * 60ms) var(--ease-out-expo) both;
}

/* --- Node dot: echoes the constellation nodes --- */
.stack-dot {
	position: relative;
	flex: none;
	width: 10px;
	height: 10px;
	border-radius: 99px;
	border: 2px solid var(--color-sage-deep);
	background: var(--color-paper);
	z-index: 3;
	transition:
		background 0.3s var(--ease-out-quint),
		border-color 0.3s var(--ease-out-quint),
		transform 0.3s var(--ease-out-quint),
		box-shadow 0.3s var(--ease-out-quint);
}
/* Vertical thread segments above and below each dot */
.stack-dot::before,
.stack-dot::after {
	content: '';
	position: absolute;
	left: 50%;
	width: 1px;
	background: var(--color-sage-deep);
	opacity: 0.45;
	transform: translateX(-50%);
	pointer-events: none;
}
.stack-dot::before {
	bottom: calc(100% + 2px);
	height: 2rem;
}
.stack-dot::after {
	top: calc(100% + 2px);
	height: 2rem;
}
/* First item: no line above */
.stack-item:first-child .stack-dot::before {
	display: none;
}
/* Last item: no line below */
.stack-item:last-child .stack-dot::after {
	display: none;
}

.stack-text {
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
	min-width: 0;
	flex: 1;
}
.stack-item:hover {
	background: oklch(0.922 0.022 135 / 0.5);
}
.stack-item:hover .stack-dot {
	border-color: var(--color-moss);
	transform: scale(1.15);
}

/* --- Touch press feedback --- */
.stack-item:active {
	transform: scale(0.985);
	transition-duration: 0.08s;
}

/* --- Active state: sage bg + filled dot --- */
.stack-item--active {
	background: var(--color-sage);
}
.stack-item--active .stack-label {
	color: var(--color-moss-deep);
}
.stack-item--active .stack-dot {
	background: var(--color-sage);
	border-color: var(--color-moss);
	transform: scale(1.1);
	box-shadow: 0 0 0 3px oklch(0.52 0.087 150 / 0.1);
}

/* --- Committed state: solid filled dot + breathing --- */
.stack-item--committed .stack-dot {
	background: var(--color-moss);
	border-color: var(--color-moss);
	transform: scale(1.15);
	box-shadow: 0 0 0 4px oklch(0.52 0.087 150 / 0.12);
	animation: stack-dot-breathe 3s ease-in-out infinite;
}

.stack-label {
	font-size: var(--text-lg);
	font-weight: 700;
	transition: color 0.25s var(--ease-out-quint);
}
.stack-line {
	font-size: var(--text-sm);
	color: var(--color-ink-soft);
	display: none;
}
.stack-item--active .stack-line {
	display: block;
}
.stack-mark {
	flex: none;
	font-size: var(--text-sm);
	font-weight: 600;
	letter-spacing: 0.02em;
	color: var(--color-ink-faint);
	transition:
		color 0.25s var(--ease-out-quint),
		transform 0.3s var(--ease-out-quint),
		opacity 0.3s var(--ease-out-quint);
}
.stack-mark::after {
	content: ' \203A';
}
.stack-item--active .stack-mark {
	color: var(--color-moss-deep);
	font-weight: 700;
	animation: stack-mark-in 0.4s var(--ease-out-expo) both;
}
.stack-item--active .stack-mark::after {
	content: ' \2193';
}

/* --- Active dot thread segments turn moss --- */
.stack-item--active .stack-dot::before,
.stack-item--active .stack-dot::after {
	background: var(--color-moss);
	opacity: 0.35;
}

/* ---------- trail (all sizes) ---------- */
.trail {
	margin-top: clamp(0.45rem, 1.5vw, 1rem);
	padding-top: clamp(0.9rem, 2vw, 1.35rem);
	position: relative;
}
.trail::before {
	content: none;
}
.trail-cue {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin: 0;
	font-size: var(--text-base);
	font-weight: 600;
	letter-spacing: 0;
	color: var(--color-moss-deep);
}
.trail-cue-mark {
	width: 0.95rem;
	height: 0.95rem;
	border: 2px solid var(--color-moss);
	border-radius: 99px;
	background: var(--color-moss);
}
.trail-head h3 {
	font-size: var(--text-xl);
	margin: 0.7rem 0 0;
}
.trail-blurb {
	margin: 1.1rem 0 0;
	color: var(--color-ink-soft);
	font-size: var(--text-lg);
}
.trail-grid {
	margin-top: clamp(2rem, 5vw, 3.6rem);
	margin-bottom: clamp(2.5rem, 6vw, 4rem);
	display: grid;
	grid-template-columns: 1fr;
	gap: clamp(1.5rem, 4vw, 2rem);
}
.col-title {
	font-size: var(--text-sm);
	font-weight: 700;
	letter-spacing: 0;
	color: var(--color-moss-deep);
	margin: 0 0 0.9rem;
	padding-bottom: 0.5rem;
	border-bottom: 1px solid var(--color-hairline);
}
.trail-col ul {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.6rem;
}
.trail-col li {
	display: flex;
	flex-direction: column;
	gap: 0.15rem;
}
.trail-link {
	display: inline;
	font-weight: 600;
	color: var(--color-river-deep);
	text-decoration-line: underline;
	text-decoration-color: oklch(0.52 0.078 222 / 0.38);
	text-decoration-thickness: 1.5px;
	text-underline-offset: 0.24em;
	transition: text-decoration-color 0.18s var(--ease-out-quint);
}
.trail-link:hover {
	text-decoration-color: currentColor;
}
.trail-note {
	font-size: var(--text-sm);
	color: var(--color-ink-faint);
	line-height: 1.5;
	display: none;
}
.trail-list-footer {
	display: flex;
	align-items: baseline;
	gap: 1rem;
	margin-top: 1rem;
	padding-top: 0.85rem;
	border-top: 1px solid var(--color-hairline);
}
.trail-all-link {
	font-size: var(--text-sm);
	color: var(--color-river-deep);
	text-decoration: underline;
	text-decoration-color: oklch(0.52 0.078 222 / 0.4);
	text-decoration-thickness: 1px;
	text-underline-offset: 0.24em;
	transition: text-decoration-color 0.18s var(--ease-out-quint);
}
.trail-all-link:hover {
	text-decoration-color: currentColor;
}

@media (max-width: 879px) {
	.trail {
		padding-top: clamp(1.5rem, 4vw, 2rem);
	}

	.trail-list-footer {
		justify-content: flex-end;
	}

	.trail-all-link {
		text-align: right;
	}
}

/* ---------- wide: the constellation appears ---------- */
@media (min-width: 880px) {
	.stacked {
		display: none;
	}

	.trail-note {
		display: block;
	}
	.trail-col ul {
		gap: 1.15rem;
	}
	.trail-col li {
		gap: 0.25rem;
	}
	.trail-grid {
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
		gap: clamp(1.5rem, 4vw, 2rem) 2.5rem;
	}
	.field {
		display: block;
		position: relative;
		width: min(100%, 70rem);
		aspect-ratio: 2.72 / 1;
		max-height: 24.5rem;
		margin: 0.2rem auto 0;
		isolation: isolate;
		overflow: hidden;
	}

	.field-canvas {
		position: absolute;
		inset: 0;
		z-index: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		opacity: 0.76;
	}

	.wires {
		position: absolute;
		inset: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		opacity: 0.12;
	}
	.wire {
		fill: none;
		stroke: var(--color-sage-deep);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
		transition:
			stroke 0.4s var(--ease-out-quint),
			stroke-width 0.4s var(--ease-out-quint);
	}
	.wire.lit {
		stroke: var(--color-moss);
		stroke-width: 2;
		opacity: 0.24;
	}

	.centre {
		position: absolute;
		z-index: 2;
		transform: translate(-50%, -50%);
		width: clamp(4.8rem, 8vw, 6.7rem);
		aspect-ratio: 1;
		border-radius: 999px;
		padding: 0.28rem;
		background: var(--color-paper);
		box-shadow:
			0 0 0 1px var(--color-hairline),
			0 0 0 0.65rem oklch(0.968 0.013 95 / 0.78),
			0 0 2.2rem var(--color-paper);
	}
	.centre-avatar {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: inherit;
		object-fit: cover;
		object-position: 50% 42%;
		filter: saturate(0.82) brightness(1.03) contrast(0.98);
	}

	.node-layer {
		position: absolute;
		inset: 0;
		z-index: 3;
	}
	.node {
		position: absolute;
		transform: translate(-50%, -50%);
		display: grid;
		place-items: center;
		width: min(22rem, 32vw);
		height: 5.5rem;
		background: none;
		border: 0;
		border-radius: var(--radius-md);
		cursor: pointer;
		font: inherit;
		color: var(--color-ink-soft);
		touch-action: manipulation;
		will-change: transform;
	}
	.node--right {
		width: min(35rem, 42vw);
		transform: translate(-28%, -50%);
	}
	.node--left {
		width: min(35rem, 42vw);
		transform: translate(-72%, -50%);
	}
	.node--top,
	.node--bottom {
		height: 7.6rem;
	}
	.node-dot {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 14px;
		height: 14px;
		border-radius: 99px;
		background: var(--color-paper);
		border: 2px solid var(--color-sage-deep);
		box-shadow: 0 0 0 7px var(--color-paper);
		transition:
			border-color 0.3s var(--ease-out-quint),
			background 0.3s var(--ease-out-quint),
			transform 0.3s var(--ease-out-quint),
			box-shadow 0.3s var(--ease-out-quint);
		will-change: transform;
	}
	.node-label {
		position: absolute;
		max-width: 10.5rem;
		font-size: var(--text-sm);
		font-weight: 600;
		line-height: 1.3;
		text-shadow:
			0 0 0.35rem var(--color-paper),
			0 0 0.9rem var(--color-paper),
			0 0 1.4rem var(--color-paper);
		transition: color 0.2s var(--ease-out-quint);
	}
	.node--top .node-label {
		bottom: calc(50% + 1.55rem);
		left: 50%;
		transform: translateX(-50%);
		max-width: 13rem;
		white-space: nowrap;
	}
	.node--right .node-label {
		top: 50%;
		left: calc(28% + 2rem);
		transform: translateY(-50%);
		text-align: left;
	}
	.node--bottom .node-label {
		top: calc(50% + 1.55rem);
		left: 50%;
		transform: translateX(-50%);
		max-width: 13rem;
		white-space: nowrap;
	}
	.node--left .node-label {
		top: 50%;
		right: calc(28% + 2rem);
		transform: translateY(-50%);
		text-align: right;
	}
	.node--right .node-dot {
		left: 28%;
	}
	.node--left .node-dot {
		left: 72%;
	}
	.node:hover .node-dot,
	.node:focus-visible .node-dot {
		border-color: var(--color-moss);
		box-shadow:
			0 0 0 7px var(--color-paper),
			0 0 0 12px oklch(0.52 0.087 150 / 0.08);
		transform: translate(-50%, -50%) scale(1.22);
	}
	.node:hover .node-label,
	.node:focus-visible .node-label {
		color: var(--color-ink);
	}
	.node.active .node-dot {
		background: var(--color-moss);
		border-color: var(--color-moss);
		box-shadow:
			0 0 0 7px var(--color-paper),
			0 0 0 12px oklch(0.52 0.087 150 / 0.09);
		transform: translate(-50%, -50%) scale(1.18);
	}
	.node.active .node-label {
		color: var(--color-ink);
		font-weight: 700;
	}

	/* Pre-selected default: this thread is shown, but the visitor hasn't
     chosen it yet. Reads as a hollow "suggested" marker rather than the
     solid fill of a committed choice, and stays steerable by hover. */
	.node.active.preselected .node-dot {
		background: var(--color-paper);
		border-color: var(--color-moss);
		box-shadow:
			0 0 0 7px var(--color-paper),
			0 0 0 12px oklch(0.52 0.087 150 / 0.05);
		transform: translate(-50%, -50%) scale(1.1);
	}
	.node.active.preselected .node-label {
		color: var(--color-ink-soft);
		font-weight: 600;
	}

	/* Resting invitation: unpicked dots breathe so the map reads as touchable
     without an imperative. Stops once the visitor has engaged. */
	.node.inviting .node-dot::after {
		content: '';
		position: absolute;
		inset: -5px;
		border-radius: 99px;
		border: 1px solid var(--color-moss);
		pointer-events: none;
		animation: node-invite 3s var(--ease-out-quint) infinite;
	}
	@keyframes node-invite {
		0% {
			opacity: 0.5;
			transform: scale(0.6);
		}
		70%,
		100% {
			opacity: 0;
			transform: scale(1.3);
		}
	}
	.node:hover .node-dot::after,
	.node:focus-visible .node-dot::after {
		animation: none;
		opacity: 0;
	}
	@media (prefers-reduced-motion: reduce) {
		.node.inviting .node-dot::after {
			animation: none;
			opacity: 0.35;
			transform: scale(1);
		}
	}
}

.map-start-sentinel,
.map-end-sentinel {
	display: block;
	height: 1px;
}

/* ---------- sticky thread rail ---------- */
.thread-rail {
	position: fixed;
	left: 0;
	right: 0;
	z-index: 30;
	background: var(--color-paper);
	border-bottom: 1px solid var(--color-hairline);
	opacity: 0;
	visibility: hidden;
	transform: translateY(-100%);
	transition:
		transform 0.42s var(--ease-out-quint),
		opacity 0.32s var(--ease-out-quint),
		visibility 0s linear 0.42s;
}
.thread-rail.is-visible {
	opacity: 1;
	visibility: visible;
	transform: translateY(0);
	transition:
		transform 0.42s var(--ease-out-quint),
		opacity 0.32s var(--ease-out-quint),
		visibility 0s;
}
.thread-rail-inner {
	max-width: 78rem;
	margin: 0 auto;
	display: flex;
	align-items: center;
	gap: clamp(0.6rem, 2vw, 1.4rem);
	padding: 0.7rem clamp(1.25rem, 4vw, 3.5rem);
}
@media (max-width: 520px) {
	.thread-rail-inner {
		gap: 0.6rem;
		padding: 0.6rem 0.75rem 0.6rem 1rem;
	}
}
.thread-rail-eyebrow {
	flex: none;
	font-size: var(--text-sm);
	font-weight: 700;
	letter-spacing: 0;
	color: var(--color-ink-faint);
	border-right: 1px solid var(--color-hairline);
	padding-right: clamp(0.6rem, 2vw, 1.4rem);
}
@media (max-width: 520px) {
	.thread-rail-eyebrow {
		display: none;
	}
}
.thread-rail-list {
	display: flex;
	gap: clamp(0.6rem, 2vw, 1.4rem);
	overflow-x: auto;
	scrollbar-width: none;
	-webkit-overflow-scrolling: touch;
	scroll-snap-type: x proximity;
}
.thread-rail-list.overflowing {
	-webkit-mask-image: linear-gradient(
		to right,
		transparent 0,
		#000 1.1rem,
		#000 calc(100% - 1.6rem),
		transparent 100%
	);
	mask-image: linear-gradient(
		to right,
		transparent 0,
		#000 1.1rem,
		#000 calc(100% - 1.6rem),
		transparent 100%
	);
}
.thread-rail-list::-webkit-scrollbar {
	display: none;
}
.rail-item {
	flex: none;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	min-height: 44px;
	padding: 0.45rem 0.15rem;
	background: none;
	border: 0;
	cursor: pointer;
	font: inherit;
	font-size: var(--text-sm);
	font-weight: 600;
	white-space: nowrap;
	color: var(--color-ink-soft);
	transition: color 0.18s var(--ease-out-quint);
	scroll-snap-align: start;
}
.rail-item:hover {
	color: var(--color-ink);
}
.rail-dot {
	width: 7px;
	height: 7px;
	border-radius: 99px;
	border: 1.5px solid var(--color-sage-deep);
	transition:
		background 0.2s var(--ease-out-quint),
		border-color 0.2s var(--ease-out-quint);
}
.rail-item.active {
	color: var(--color-moss-deep);
	font-weight: 700;
}
/* Pre-selected default: outlined moss, matching the map's hollow node so the
   two switchers agree on "shown but not yet chosen". */
.rail-item.active .rail-dot {
	border-color: var(--color-moss);
}
/* A committed choice: solid fill, mirroring the map's filled active node. */
.rail-item.committed .rail-dot {
	background: var(--color-moss);
	border-color: var(--color-moss);
}
@media (prefers-reduced-motion: reduce) {
	.thread-rail,
	.thread-rail.is-visible {
		transition: visibility 0s;
		transform: none;
	}
}

/* Receipts re-animate on each thread change so the cause is felt */
/* trail-cue stays instant — only title + blurb animate as one block */
.trail-head h3,
.trail-blurb {
	animation: trail-head-in 0.68s 0.06s var(--ease-out-expo) both;
}
@keyframes trail-head-in {
	from {
		opacity: 0;
		transform: translateY(2rem);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@media (prefers-reduced-motion: reduce) {
	.trail-head h3,
	.trail-blurb {
		animation: none;
		opacity: 1;
		transform: none;
	}
}

/* ---------- mobile stacked index animations ---------- */
@keyframes stack-enter {
	from {
		opacity: 0;
		transform: translateY(0.7rem);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes stack-dot-breathe {
	0%,
	100% {
		box-shadow: 0 0 0 3px oklch(0.52 0.087 150 / 0.1);
		transform: scale(1.1);
	}
	50% {
		box-shadow: 0 0 0 5px oklch(0.52 0.087 150 / 0.06);
		transform: scale(1.2);
	}
}

@keyframes stack-mark-in {
	from {
		opacity: 0;
		transform: translateY(-3px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* ---------- reduced motion: mobile stacked ---------- */
@media (prefers-reduced-motion: reduce) {
	.stack-item {
		animation: none;
		opacity: 1;
		transform: none;
	}
	.stack-item--committed .stack-dot {
		animation: none;
	}
	.stack-item--active .stack-mark {
		animation: none;
		opacity: 1;
		transform: none;
	}
}
</style>
