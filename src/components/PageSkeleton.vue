<template>
  <div class="shell shell--reading skeleton" aria-hidden="true">
    <div class="sk-back" />
    <div class="sk-meta" />
    <div class="sk-title" />
    <div class="sk-title sk-title--short" />
    <div class="sk-excerpt" />
    <div class="sk-body">
      <div class="sk-line" />
      <div class="sk-line" />
      <div class="sk-line sk-line--short" />
      <div class="sk-line sk-line--gap" />
      <div class="sk-line" />
      <div class="sk-line" />
      <div class="sk-line sk-line--med" />
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  padding-top: clamp(2.5rem, 6vw, 5rem);
}

.sk-back,
.sk-meta,
.sk-title,
.sk-excerpt,
.sk-line {
  background: color-mix(in oklab, var(--color-hairline) 80%, var(--color-paper));
  border-radius: var(--radius-sm);
  animation: sk-pulse 1.6s ease-in-out infinite;
}

.sk-back {
  width: 6rem;
  height: 0.85rem;
  margin-bottom: 2.5rem;
}

.sk-meta {
  width: 14rem;
  height: 0.7rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-sm);
}

.sk-title {
  height: 2.4rem;
  margin-bottom: 0.6rem;
  border-radius: var(--radius-sm);
}
.sk-title--short {
  width: 62%;
  margin-bottom: 1.2rem;
}

.sk-excerpt {
  height: 1rem;
  margin-bottom: 0.5rem;
  border-radius: var(--radius-sm);
  width: 88%;
}

.sk-body {
  margin-top: 2.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.sk-line {
  height: 0.9rem;
  border-radius: var(--radius-sm);
}
.sk-line--short {
  width: 55%;
}
.sk-line--med {
  width: 75%;
}
.sk-line--gap {
  margin-top: 0.75rem;
}

@keyframes sk-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

@media (prefers-reduced-motion: reduce) {
  .sk-back,
  .sk-meta,
  .sk-title,
  .sk-excerpt,
  .sk-line {
    animation: none;
    opacity: 0.6;
  }
}
</style>
