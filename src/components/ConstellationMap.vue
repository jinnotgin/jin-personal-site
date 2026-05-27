<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import posthog from 'posthog-js'
import { threads } from '@/data/threads'
import { byMostRecentProject, projectsByThread } from '@/lib/projectsIndex'
import { homePostsByThread, slugifyCategory } from '@/lib/homeWriting'
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
const trailBlurbEl = ref<HTMLElement | null>(null)
const railListEl = ref<HTMLElement | null>(null)
const mapEndEl = ref<HTMLElement | null>(null)
const pointer = ref({ x: 0.5, y: 0.5, active: false })

const isMobile = ref(false)

function checkIfMobile() {
	isMobile.value = typeof window !== 'undefined' && window.innerWidth < 880
}

// The sticky rail is a second copy of the switcher. It is live only in the
// window between "the map has scrolled out of comfortable reach" and "the
// reader has left the trail entirely" (i.e. entered the writing section).
const pastSwitcher = ref(false)
const pastTrail = ref(false)
const railVisible = computed(() => pastSwitcher.value && !pastTrail.value)
const railTop = ref(0)
const railHeight = ref(56)
const railBlockerActive = ref(false)
const railOverflowing = ref(false)
const railCanScrollBack = ref(false)
const railCanScrollForward = ref(false)
const railEl = ref<HTMLElement | null>(null)
const railBlockerTop = computed(() => Math.max(0, railTop.value - RAIL_TOP_GAP))
const railBlockerHeight = computed(() => Math.max(0, railTop.value - railBlockerTop.value))
const railBlockerVisible = computed(() => railVisible.value && railBlockerActive.value)

// How many px of the switcher should still be on screen at the moment the
// rail appears, i.e. the rail kicks in once (switcherHeight - REMAINING) has
// scrolled past the header. Larger = appears earlier (more still showing);
// smaller = waits until almost all of it is gone.
const RAIL_REVEAL_REMAINING = 120

// How many px before the trail's true end the rail should retire. Larger =
// vanishes earlier (further from the writing section).
const RAIL_HIDE_OFFSET = 120
const RAIL_TRAIL_SCROLL_DURATION_MS = 280
const RAIL_TOP_GAP = 12
const TRAIL_HEAD_SCROLL_GAP = 28
const DESKTOP_NODE_SCROLL_GAP = 12
const DESKTOP_DETAIL_VISIBLE_LINES = 3

let frame = 0
let resizeObserver: ResizeObserver | undefined
let switcherObserver: IntersectionObserver | undefined
let endObserver: IntersectionObserver | undefined
let reduceMotion = false
let scrollFrame = 0

function measureRailTop() {
	const header = document.querySelector<HTMLElement>('.site-header')
	const headerHeight = header ? Math.round(header.getBoundingClientRect().height) : 0
	railTop.value = headerHeight + RAIL_TOP_GAP
}

function measureRailHeight() {
	const el = railEl.value
	railHeight.value = el ? Math.round(el.getBoundingClientRect().height) : 56
}

function measureRailOverflow() {
	const list = railListEl.value
	if (!list) {
		railOverflowing.value = false
		railCanScrollBack.value = false
		railCanScrollForward.value = false
		return
	}

	const maxScroll = list.scrollWidth - list.clientWidth
	railOverflowing.value = maxScroll > 1
	railCanScrollBack.value = list.scrollLeft > 1
	railCanScrollForward.value = list.scrollLeft < maxScroll - 1
}

function onRailScroll() {
	measureRailOverflow()
}

function scrollRail(direction: 'back' | 'forward') {
	const list = railListEl.value
	if (!list) return

	const distance = Math.max(list.clientWidth * 0.62, 160)
	list.scrollBy({
		left: direction === 'back' ? -distance : distance,
		behavior: reduceMotion ? 'auto' : 'smooth',
	})

	window.requestAnimationFrame(measureRailOverflow)
}

function updateRailVisibilityFromLayout() {
	const switcherHeight = switcherEl.value?.getBoundingClientRect().height ?? 0
	const revealLine = Math.round(railTop.value - (switcherHeight - RAIL_REVEAL_REMAINING))
	const mapStartTop = mapStartEl.value?.getBoundingClientRect().top
	if (mapStartTop !== undefined) {
		pastSwitcher.value = mapStartTop < revealLine
	}

	const switcherRect = switcherEl.value?.getBoundingClientRect()
	if (switcherRect) {
		const blockerTop = railBlockerTop.value
		const blockerBottom = railBlockerTop.value + railBlockerHeight.value
		railBlockerActive.value =
			switcherRect.top < blockerBottom && switcherRect.bottom > blockerTop
	}

	const hideLine = railTop.value + RAIL_HIDE_OFFSET
	const mapEndTop = mapEndEl.value?.getBoundingClientRect().top
	if (mapEndTop !== undefined) {
		pastTrail.value = mapEndTop < hideLine
	}
}

function onScroll() {
	if (scrollFrame) return
	scrollFrame = window.requestAnimationFrame(() => {
		scrollFrame = 0
		updateRailVisibilityFromLayout()
	})
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
	// whichever constellation layout is live.
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

	updateRailVisibilityFromLayout()
}

// Deliberate choice (click / keyboard focus): locks the selection so hover
// can no longer change it.
function commit(id: ThreadId) {
	selected.value = id
	committed.value = id
	window.sessionStorage.setItem(SELECTED_THREAD_STORAGE_KEY, id)
	const thread = threads.find((t) => t.id === id)
	posthog.capture('thread_selected', { thread_id: id, thread_label: thread?.label })
}

function isDesktopLayout() {
	return typeof window !== 'undefined' && window.matchMedia('(min-width: 880px)').matches
}

function trailDetailIsVisible() {
	const blurb = trailBlurbEl.value
	if (!blurb) return false

	const rect = blurb.getBoundingClientRect()
	const lineHeight = Number.parseFloat(window.getComputedStyle(blurb).lineHeight)
	const targetDepth = Number.isFinite(lineHeight)
		? lineHeight * DESKTOP_DETAIL_VISIBLE_LINES
		: 84
	const detailCheckpoint = rect.top + targetDepth

	return detailCheckpoint <= window.innerHeight && detailCheckpoint > railTop.value
}

function scrollToDesktopMapTop() {
	const switcher = switcherEl.value
	if (!switcher) return

	const target =
		switcher.getBoundingClientRect().top + window.scrollY - (railTop.value + DESKTOP_NODE_SCROLL_GAP)

	window.scrollTo({
		top: target,
		behavior: reduceMotion ? 'auto' : 'smooth',
	})
}

function commitFromNode(id: ThreadId) {
	commit(id)

	if (isMobile.value) {
		requestAnimationFrame(scrollToTrailHeadSmooth)
	} else if (!isDesktopLayout() || trailDetailIsVisible()) {
		return
	} else {
		requestAnimationFrame(scrollToDesktopMapTop)
	}
}

// Switching from the rail changes content far above the fold, so bring the
// new pattern's head into view to confirm the switch instead of leaving the
// reader stranded mid-trail in a now-different thread.
function commitFromRail(id: ThreadId) {
	commit(id)
	requestAnimationFrame(() => {
		scrollToTrailHeadFast()
		scrollRailToActive()
	})
}

function trailHeadScrollTarget() {
	const trailHead = trailHeadEl.value
	if (!trailHead) return null

	return (
		trailHead.getBoundingClientRect().top +
		window.scrollY -
		(railTop.value + railHeight.value + TRAIL_HEAD_SCROLL_GAP)
	)
}

function scrollToTrailHeadSmooth() {
	const target = trailHeadScrollTarget()
	if (target === null) return

	window.scrollTo({
		top: target,
		behavior: reduceMotion ? 'auto' : 'smooth',
	})
}

function scrollToTrailHeadFast() {
	const target = trailHeadScrollTarget()
	if (target === null) return

	if (reduceMotion) {
		window.scrollTo({ top: target, behavior: 'auto' })
		return
	}

	const start = window.scrollY
	const distance = target - start
	const startedAt = performance.now()

	function step(now: number) {
		const progress = Math.min((now - startedAt) / RAIL_TRAIL_SCROLL_DURATION_MS, 1)
		const eased = 1 - Math.pow(1 - progress, 3)
		window.scrollTo(0, start + distance * eased)
		if (progress < 1) window.requestAnimationFrame(step)
	}

	window.requestAnimationFrame(step)
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

const nodes = computed(() => {
	const mobileCoords = [
		{ x: 25, y: 36, placement: 'bottom' },
		{ x: 75, y: 36, placement: 'bottom' },
		{ x: 50, y: 60, placement: 'bottom' },
		{ x: 25, y: 84, placement: 'bottom' },
		{ x: 75, y: 84, placement: 'bottom' }
	]

	return threads.map((t, index) => {
		if (isMobile.value) {
			const coords = mobileCoords[index] || { x: 50, y: 50, placement: 'bottom' }
			return {
				...t,
				x: coords.x,
				y: coords.y,
				placement: coords.placement as 'top' | 'right' | 'bottom' | 'left'
			}
		} else {
			const rad = (t.angle * Math.PI) / 180
			return {
				...t,
				x: CX + RX * Math.cos(rad),
				y: CY + RY * Math.sin(rad),
				placement: labelPlacement(CX + RX * Math.cos(rad), CY + RY * Math.sin(rad)),
			}
		}
	})
})

const currentCX = computed(() => isMobile.value ? 50 : CX)
const currentCY = computed(() => isMobile.value ? 12 : CY)

const active = computed(() => threads.find((t) => t.id === selected.value)!)

const trail = computed(() => {
	const t = active.value
	return {
		projects: projectsByThread(t.id).sort(byMostRecentProject),
		writing: homePostsByThread(t.id),
		journey: journey.filter((j) => t.journey.includes(j.id)),
		external: t.external ?? [],
	}
})

function curve(x: number, y: number): string {
	const cx = currentCX.value
	const cy = currentCY.value
	const mx = (cx + x) / 2
	const my = (cy + y) / 2 - (isMobile.value ? 2 : 7)
	return `M ${cx} ${cy} Q ${mx} ${my} ${x} ${y}`
}

function canvasCurve(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	x: number,
	y: number,
) {
	const cx = currentCX.value
	const cy = currentCY.value
	const startX = (cx / 100) * width
	const startY = (cy / 100) * height
	const endX = (x / 100) * width
	const endY = (y / 100) * height
	const controlX = ((cx + x) / 200) * width
	const controlY = (((cy + y) / 2 - (isMobile.value ? 2 : 7)) / 100) * height

	ctx.moveTo(startX, startY)
	ctx.quadraticCurveTo(controlX, controlY, endX, endY)
}

function pointOnCurve(width: number, height: number, x: number, y: number, t: number) {
	const cx = currentCX.value
	const cy = currentCY.value
	const startX = (cx / 100) * width
	const startY = (cy / 100) * height
	const endX = (x / 100) * width
	const endY = (y / 100) * height
	const controlX = ((cx + x) / 200) * width
	const controlY = (((cy + y) / 2 - (isMobile.value ? 2 : 7)) / 100) * height
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
			Math.max(width, height) * (isMobile.value ? 0.2 : 0.36),
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
		ctx.lineWidth = isActive ? 2.6 : 1.5
		ctx.stroke()

		if (!reduceMotion && isActive) {
			for (let i = 0; i < 3; i += 1) {
				const t = (drift * 0.22 + i * 0.34) % 1
				const p = pointOnCurve(width, height, n.x, n.y + nodeBreath, t)
				const radius = 3.2 + Math.sin(drift * 5 + i) * 0.75
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
		const pull = pointer.value.active ? Math.max(0, 1 - distance / (isMobile.value ? 120 : 220)) : 0

		ctx.beginPath()
		ctx.arc(nodeX, nodeY, isActive ? 13 : 9 + pull * (isMobile.value ? 4 : 7), 0, Math.PI * 2)
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
	checkIfMobile()
	prepareCanvas()

	resizeObserver = new ResizeObserver(restartAnimation)
	if (switcherEl.value) resizeObserver.observe(switcherEl.value)
	animate()

	measureRailTop()
	measureRailHeight()
	measureRailOverflow()
	buildObservers()
	window.addEventListener('resize', onResize)
	window.addEventListener('scroll', onScroll, { passive: true })
})

function onResize() {
	checkIfMobile()
	measureRailTop()
	measureRailHeight()
	measureRailOverflow()
	buildObservers()
	updateRailVisibilityFromLayout()
}

onBeforeUnmount(() => {
	window.cancelAnimationFrame(frame)
	window.cancelAnimationFrame(scrollFrame)
	resizeObserver?.disconnect()
	switcherObserver?.disconnect()
	endObserver?.disconnect()
	window.removeEventListener('resize', onResize)
	window.removeEventListener('scroll', onScroll)
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

				<div class="centre" :style="{ left: currentCX + '%', top: currentCY + '%' }" aria-hidden="true">
					<img class="centre-avatar" src="/img/jin-portrait-square-800.jpg" alt="" loading="lazy" />
					<span class="centre-mark"></span>
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
						@click="commitFromNode(n.id)"
						@focus="commit(n.id)"
						@pointerenter="preview(n.id)"
					>
						<span class="node-dot" aria-hidden="true"></span>
						<span class="node-label">{{ n.label }}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Sticky rail: takes over once the switcher above is out of view -->
		<span
			class="rail-paper-blocker"
			:class="{ 'is-visible': railBlockerVisible }"
			:style="{ top: railBlockerTop + 'px', height: railBlockerHeight + 'px' }"
			aria-hidden="true"
		></span>
		<nav
			ref="railEl"
			class="thread-rail"
			:class="{ 'is-visible': railVisible }"
			:style="{ top: railTop + 'px' }"
			aria-label="Switch thread"
			:aria-hidden="!railVisible"
		>
			<div class="thread-rail-inner">
				<button
					class="rail-scroll-button rail-scroll-button--back"
					:class="{ 'is-visible': railCanScrollBack }"
					type="button"
					aria-label="Show previous threads"
					:aria-hidden="!railCanScrollBack"
					:tabindex="railVisible && railCanScrollBack ? 0 : -1"
					@click="scrollRail('back')"
				>
					<span class="rail-scroll-icon" aria-hidden="true"></span>
				</button>
				<div
					ref="railListEl"
					class="thread-rail-list"
					:class="{
						overflowing: railOverflowing,
						'can-scroll-back': railCanScrollBack,
						'can-scroll-forward': railCanScrollForward,
					}"
					@scroll.passive="onRailScroll"
				>
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
				<button
					class="rail-scroll-button rail-scroll-button--forward"
					:class="{ 'is-visible': railCanScrollForward }"
					type="button"
					aria-label="Show more threads"
					:aria-hidden="!railCanScrollForward"
					:tabindex="railVisible && railCanScrollForward ? 0 : -1"
					@click="scrollRail('forward')"
				>
					<span class="rail-scroll-icon" aria-hidden="true"></span>
				</button>
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
				<h3>{{ active.label }}</h3>
				<p ref="trailBlurbEl" class="trail-blurb measure">{{ active.blurb }}</p>
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

/* ---------- constellation base styles ---------- */
.field {
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
	stroke-width: 1.6;
	vector-effect: non-scaling-stroke;
	transition:
		stroke 0.4s var(--ease-out-quint),
		stroke-width 0.4s var(--ease-out-quint);
}
.wire.lit {
	stroke: var(--color-moss);
	stroke-width: 3;
	opacity: 0.24;
}

.centre {
	position: absolute;
	z-index: 2;
	transform: translate(-50%, -50%);
	width: clamp(4.8rem, 8vw, 6.7rem);
	aspect-ratio: 1;
	border-radius: 999px;
	padding: 0.18rem;
	background: var(--color-paper);
	overflow: hidden;
	box-shadow:
		0 0 0 1px var(--color-hairline),
		0 0 0 0.3rem oklch(0.968 0.013 95 / 0.78),
		0 0 2.2rem var(--color-paper);
}
.centre-avatar {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: inherit;
	object-fit: cover;
	object-position: 50% 42%;
	scale: 1.15;
	filter: saturate(0.92) brightness(1.02) contrast(0.98);
}
.centre-mark {
	display: none;
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
	max-width: 12rem;
	font-size: var(--text-base);
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
	max-width: 15rem;
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
	max-width: 15rem;
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

/* ---------- trail (all sizes) ---------- */
.trail {
	margin-top: clamp(0.45rem, 1.5vw, 1rem);
	padding-top: clamp(1.25rem, 2.8vw, 2rem);
	position: relative;
}
.trail::before {
	content: none;
}
.trail-head h3 {
	font-size: var(--text-xl);
	margin: 0;
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
	.trail-list-footer {
		justify-content: flex-end;
	}

	.trail-all-link {
		text-align: right;
	}

	.field {
		aspect-ratio: auto;
		height: clamp(30rem, 115vw, 38rem);
		max-height: none;
	}

	.centre {
		width: 1.3rem;
		padding: 0.12rem;
		background: var(--color-sage-deep);
		box-shadow:
			0 0 0 1px var(--color-hairline),
			0 0 0 0.22rem oklch(0.968 0.013 95 / 0.78);
	}

	.centre-avatar {
		display: none;
	}

	.centre-mark {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: inherit;
		background: var(--color-paper);
	}

	.node {
		width: min(22rem, 64vw);
		height: 4.5rem;
	}

	.node--bottom .node-label,
	.node--top .node-label {
		white-space: normal;
		text-align: center;
		width: max-content;
		max-width: 6.45rem;
		font-size: var(--text-sm);
		line-height: 1.2;
	}
}

/* ---------- wide: the constellation appears ---------- */
@media (min-width: 880px) {
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
}

.map-start-sentinel,
.map-end-sentinel {
	display: block;
	height: 1px;
}

/* ---------- sticky thread rail ---------- */
.rail-paper-blocker {
	position: fixed;
	left: 0;
	right: 0;
	z-index: 29;
	pointer-events: none;
	background-color: var(--color-paper);
	background-image: radial-gradient(oklch(0.302 0.038 158 / 0.0125) 1px, transparent 1px);
	background-size: 4px 4px;
	opacity: 0;
	visibility: hidden;
	transition:
		opacity 0.18s var(--ease-out-quint),
		visibility 0s linear 0.18s;
}
.rail-paper-blocker.is-visible {
	opacity: 1;
	visibility: visible;
	transition:
		opacity 0.18s var(--ease-out-quint),
		visibility 0s;
}
.thread-rail {
	position: fixed;
	left: 50%;
	width: max-content;
	max-width: min(calc(100% - clamp(1rem, 6vw, 4rem)), 68rem);
	z-index: 30;
	/* Lifted pill: it stays close to the header but reads as its own control. */
	background: oklch(0.968 0.013 95 / 0.96);
	border: 1px solid var(--color-hairline);
	border-radius: 999px;
	overflow: hidden;
	box-shadow: 0 0 0 oklch(0.302 0.038 158 / 0);
	opacity: 0;
	visibility: hidden;
	transform: translate(-50%, -0.7rem);
	transition:
		transform 0.42s var(--ease-out-quint),
		opacity 0.32s var(--ease-out-quint),
		box-shadow 0.42s var(--ease-out-quint),
		visibility 0s linear 0.42s;
}
.thread-rail.is-visible {
	opacity: 1;
	visibility: visible;
	transform: translate(-50%, 0);
	/* Sanctioned Lift Shadow, present only while the rail is live, so the
	   reveal lands as a control arriving over the content. */
	box-shadow:
		0 1px 2px oklch(0.302 0.038 158 / 0.05),
		0 10px 30px oklch(0.302 0.038 158 / 0.1);
	transition:
		transform 0.42s var(--ease-out-quint),
		opacity 0.32s var(--ease-out-quint),
		box-shadow 0.42s var(--ease-out-quint),
		visibility 0s;
}
.thread-rail-inner {
	position: relative;
	display: flex;
	align-items: center;
	min-width: 0;
	max-width: 100%;
	padding: 0.36rem clamp(0.72rem, 1.35vw, 1rem);
}
@media (max-width: 520px) {
	.thread-rail-inner {
		padding: 0.32rem 0.6rem;
	}
}
.thread-rail-list {
	min-width: 0;
	display: flex;
	gap: clamp(0.34rem, 0.9vw, 0.78rem);
	overflow-x: auto;
	scrollbar-width: none;
	-webkit-overflow-scrolling: touch;
	scroll-snap-type: x proximity;
}
.thread-rail-list.overflowing {
	-webkit-mask-image: linear-gradient(to right, #000 0, #000 100%);
	mask-image: linear-gradient(to right, #000 0, #000 100%);
}
.thread-rail-list.can-scroll-back {
	-webkit-mask-image: linear-gradient(to right, transparent 0, transparent 1.55rem, #000 2.45rem, #000 100%);
	mask-image: linear-gradient(to right, transparent 0, transparent 1.55rem, #000 2.45rem, #000 100%);
}
.thread-rail-list.can-scroll-forward {
	-webkit-mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 2.45rem), transparent calc(100% - 1.55rem), transparent 100%);
	mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 2.45rem), transparent calc(100% - 1.55rem), transparent 100%);
}
.thread-rail-list.can-scroll-back.can-scroll-forward {
	-webkit-mask-image: linear-gradient(
		to right,
		transparent 0,
		transparent 1.55rem,
		#000 2.45rem,
		#000 calc(100% - 2.45rem),
		transparent calc(100% - 1.55rem),
		transparent 100%
	);
	mask-image: linear-gradient(
		to right,
		transparent 0,
		transparent 1.55rem,
		#000 2.45rem,
		#000 calc(100% - 2.45rem),
		transparent calc(100% - 1.55rem),
		transparent 100%
	);
}
.thread-rail-list::-webkit-scrollbar {
	display: none;
}
.rail-scroll-button {
	position: absolute;
	top: 50%;
	z-index: 2;
	display: inline-grid;
	place-items: center;
	width: 2.25rem;
	height: 100%;
	padding: 0;
	border: 0;
	border-radius: 999px;
	background: transparent;
	color: var(--color-moss-deep);
	cursor: pointer;
	opacity: 0;
	visibility: hidden;
	pointer-events: none;
	transition:
		color 0.18s var(--ease-out-quint),
		opacity 0.18s var(--ease-out-quint),
		transform 0.18s var(--ease-out-quint),
		visibility 0s linear 0.18s;
}
.rail-scroll-button--back {
	left: 0;
	transform: translate(0.12rem, -50%);
}
.rail-scroll-button--forward {
	right: 0;
	transform: translate(-0.12rem, -50%);
}
.rail-scroll-button.is-visible {
	opacity: 1;
	visibility: visible;
	pointer-events: auto;
	transition:
		color 0.18s var(--ease-out-quint),
		opacity 0.18s var(--ease-out-quint),
		transform 0.18s var(--ease-out-quint),
		visibility 0s;
}
.rail-scroll-button--back.is-visible {
	transform: translate(0.12rem, -50%);
}
.rail-scroll-button--forward.is-visible {
	transform: translate(-0.12rem, -50%);
}
.rail-scroll-button.is-visible:hover {
	color: var(--color-ink);
	transform: translate(calc(-0.12rem + 1px), -50%);
}
.rail-scroll-button--back.is-visible:hover {
	transform: translate(calc(0.12rem - 1px), -50%);
}
.rail-scroll-icon {
	position: relative;
	display: block;
	width: 1rem;
	height: 1rem;
}
.rail-scroll-icon::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 0.42rem;
	height: 0.42rem;
	border-top: 1.5px solid currentColor;
	border-right: 1.5px solid currentColor;
	transform: translate(-57%, -48%) rotate(45deg);
}
.rail-scroll-button--back .rail-scroll-icon::before {
	transform: translate(-43%, -48%) rotate(-135deg);
}
.rail-item {
	position: relative;
	flex: none;
	display: inline-flex;
	align-items: center;
	gap: 0.44rem;
	min-height: 38px;
	padding: 0.28rem 0.62rem;
	background: none;
	border: 0;
	border-radius: 999px;
	cursor: pointer;
	font: inherit;
	font-size: var(--text-sm);
	font-weight: 600;
	white-space: nowrap;
	color: var(--color-ink-soft);
	transition:
		color 0.18s var(--ease-out-quint),
		background 0.18s var(--ease-out-quint),
		box-shadow 0.18s var(--ease-out-quint);
	scroll-snap-align: start;
}
.rail-item:hover {
	color: var(--color-ink);
	background: transparent;
	box-shadow: inset 0 0 0 1px oklch(0.852 0.02 132 / 0.85);
}
.rail-item:hover .rail-dot {
	background: var(--color-moss);
	border-color: var(--color-moss);
	transform: scale(1.08);
}
.rail-dot {
	width: 7px;
	height: 7px;
	border-radius: 99px;
	border: 1.5px solid var(--color-sage-deep);
	transition:
		background 0.18s var(--ease-out-quint),
		border-color 0.18s var(--ease-out-quint),
		transform 0.18s var(--ease-out-quint),
		box-shadow 0.18s var(--ease-out-quint);
}
.rail-item.active {
	background: oklch(0.922 0.022 135 / 0.42);
	color: var(--color-moss-deep);
	font-weight: 700;
}
/* C — carry the map's dot vocabulary: pre-selected default is an outlined
   moss dot, matching the constellation's hollow node ("shown, not chosen"). */
.rail-item.active .rail-dot {
	border-color: var(--color-moss);
	transform: scale(1.15);
}
/* A committed choice: solid fill + soft ring, mirroring the filled active
   node on the map so the rail reads as the same control. */
.rail-item.committed .rail-dot {
	background: var(--color-moss);
	border-color: var(--color-moss);
	transform: scale(1.2);
	box-shadow: 0 0 0 3px oklch(0.52 0.087 150 / 0.12);
}
@media (prefers-reduced-motion: reduce) {
	.thread-rail,
	.thread-rail.is-visible {
		transition: visibility 0s;
		transform: translate(-50%, 0);
	}
}

/* Receipts re-animate on each thread change so the cause is felt. */
.trail-head h3,
.trail-blurb {
	animation: trail-head-in 0.68s 0.06s var(--ease-out-expo) both;
}
.trail-grid {
	animation: trail-head-in 0.72s 0.12s var(--ease-out-expo) both;
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
	.trail-blurb,
	.trail-grid {
		animation: none;
		opacity: 1;
		transform: none;
	}
}

</style>
