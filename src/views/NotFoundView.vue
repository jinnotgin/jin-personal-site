<script setup lang="ts"></script>

<template>
  <div class="shell shell--reading nf">
    <p class="eyebrow">404</p>
    <h1>That thread does not connect to anything.</h1>
    <p class="lede">
      The page you asked for is not on the map. Nothing here is broken on
      purpose; the link just leads nowhere.
    </p>
    <nav class="ways">
      <RouterLink to="/" class="link">The map</RouterLink>
      <RouterLink to="/workbench" class="link">Workbench</RouterLink>
      <RouterLink to="/writing" class="link">Writing</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.nf {
  min-height: 50vh;
}
.ways {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-weight: 600;
}
</style>
