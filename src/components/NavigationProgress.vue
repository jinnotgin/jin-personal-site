<script setup lang="ts">
import { isNavigating } from '@/lib/navigation'
</script>

<template>
  <Transition name="nav-progress">
    <div v-if="isNavigating" class="nav-progress" role="status" aria-label="Loading page">
      <div class="nav-progress__bar" />
    </div>
  </Transition>
</template>

<style scoped>
.nav-progress {
  position: fixed;
  inset: 0 0 auto 0;
  height: 2px;
  z-index: 100;
  overflow: hidden;
  background: color-mix(in oklab, var(--color-moss) 12%, transparent);
}

.nav-progress__bar {
  height: 100%;
  width: 40%;
  background: var(--color-moss);
  transform: translateX(-100%);
  animation: nav-progress-slide 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

.nav-progress-enter-active,
.nav-progress-leave-active {
  transition: opacity 0.25s var(--ease-out-quint);
}
.nav-progress-enter-from,
.nav-progress-leave-to {
  opacity: 0;
}

@keyframes nav-progress-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-progress__bar {
    width: 100%;
    transform: none;
    animation: none;
    opacity: 0.6;
  }
}
</style>
