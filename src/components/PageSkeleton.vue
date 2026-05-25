<template>
  <div class="shell shell--reading skeleton" aria-hidden="true">
    <div class="sk-back" />
    <div class="sk-meta" />
    <div class="sk-title" />
    <div class="sk-title sk-title--short" />
    <div class="sk-excerpt" />
    <div class="sk-excerpt sk-excerpt--med" />
    <div class="sk-body">
      <div class="sk-line" style="--sk-w:100%;--sk-d:0s" />
      <div class="sk-line" style="--sk-w:94%;--sk-d:.1s" />
      <div class="sk-line" style="--sk-w:82%;--sk-d:.2s" />
      <div class="sk-line sk-line--gap" style="--sk-w:100%;--sk-d:.05s" />
      <div class="sk-line" style="--sk-w:100%;--sk-d:.15s" />
      <div class="sk-line" style="--sk-w:97%;--sk-d:.25s" />
      <div class="sk-line" style="--sk-w:68%;--sk-d:.1s" />
      <div class="sk-line sk-line--gap" style="--sk-w:100%;--sk-d:.2s" />
      <div class="sk-line" style="--sk-w:100%;--sk-d:.3s" />
      <div class="sk-line" style="--sk-w:91%;--sk-d:.05s" />
      <div class="sk-line" style="--sk-w:100%;--sk-d:.15s" />
      <div class="sk-line" style="--sk-w:58%;--sk-d:.25s" />
      <div class="sk-line sk-line--gap" style="--sk-w:100%;--sk-d:.1s" />
      <div class="sk-line" style="--sk-w:100%;--sk-d:.2s" />
      <div class="sk-line" style="--sk-w:88%;--sk-d:.3s" />
      <div class="sk-line" style="--sk-w:74%;--sk-d:.05s" />
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  padding-top: clamp(2.5rem, 6vw, 5rem);
  animation: sk-reveal 0s 150ms both;
}

@keyframes sk-reveal {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.sk-back,
.sk-meta,
.sk-title,
.sk-excerpt,
.sk-line {
  background: color-mix(in oklab, var(--color-hairline) 80%, var(--color-paper));
  border-radius: var(--radius-sm);
  animation: sk-pulse 1.8s ease-in-out infinite;
  animation-delay: var(--sk-d, 0s);
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
  width: 92%;
}
.sk-excerpt--med {
  width: 72%;
  margin-bottom: 0.5rem;
}

.sk-body {
  margin-top: 2.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.sk-line {
  height: 0.85rem;
  width: var(--sk-w, 100%);
  border-radius: var(--radius-sm);
}
.sk-line--gap {
  margin-top: 1.25rem;
}

@keyframes sk-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
  .sk-back,
  .sk-meta,
  .sk-title,
  .sk-excerpt,
  .sk-line {
    animation: none;
    opacity: 0.55;
  }
}
</style>
