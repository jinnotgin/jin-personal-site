<script setup lang="ts"></script>

<template>
  <div class="shell shell--reading nf">
    <p class="eyebrow">404</p>
    <h1>This page doesn't exist.</h1>
    <p class="lede">
      The link you followed leads nowhere. Try one of these instead.
    </p>
    <nav class="ways">
      <RouterLink to="/" class="link">Home</RouterLink>
      <RouterLink to="/projects" class="link">Projects</RouterLink>
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
