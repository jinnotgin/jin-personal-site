<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import NavigationProgress from '@/components/NavigationProgress.vue'
import PageSkeleton from '@/components/PageSkeleton.vue'
import { isNavigating } from '@/lib/navigation'

const hasHydrated = ref(false)

onMounted(() => {
  hasHydrated.value = true
})
</script>

<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <NavigationProgress />
  <SiteHeader />
  <main id="main" tabindex="-1" :class="{ 'is-navigating': isNavigating }">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <!-- Vue Suspense treats an undefined timeout as "never switch to fallback"; see packages/runtime-core/src/components/Suspense.ts in https://github.com/vuejs/core. This preserves SSG HTML during hydration. -->
        <Suspense :timeout="hasHydrated ? 300 : undefined">
          <component :is="Component" :key="route.path" />
          <template #fallback>
            <PageSkeleton v-if="hasHydrated" />
          </template>
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
