<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
</template>

<style scoped>
main {
  outline: none;
  min-height: 60vh;
}
</style>
