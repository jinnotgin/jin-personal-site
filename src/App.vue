<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import NavigationProgress from '@/components/NavigationProgress.vue'
import { isNavigating } from '@/lib/navigation'
</script>

<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <NavigationProgress />
  <SiteHeader />
  <main id="main" tabindex="-1" :class="{ 'is-navigating': isNavigating }">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <Suspense :timeout="0">
          <component :is="Component" :key="route.path" />
        </Suspense>
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
</template>

<style scoped>
main {
  outline: none;
  flex: 1 0 auto;
  overflow-x: clip;
  transition: opacity 0.2s var(--ease-out-quint);
}

main.is-navigating {
  opacity: 0.62;
}

@media (prefers-reduced-motion: reduce) {
  main {
    transition: none;
  }
}
</style>
