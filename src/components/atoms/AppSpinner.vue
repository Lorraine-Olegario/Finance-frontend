<template>
  <span
    class="app-spinner"
    :style="{ width: size, height: size }"
    role="status"
    :aria-label="label"
  />
</template>

<script setup>
defineProps({
  size: { type: String, default: '20px' },
  inverted: { type: Boolean, default: false },
  label: { type: String, default: 'Carregando...' }
})
</script>

<style scoped>
.app-spinner {
  display: inline-block;
  border: 2px solid var(--spinner-track, var(--border));
  border-top-color: var(--spinner-head, var(--primary));
  border-radius: 50%;
  flex-shrink: 0;
  animation: spin 0.8s linear infinite;
}

/* Contextos invertidos (ex: botão primário): passe inverted ou defina as
   CSS vars no componente pai */
.app-spinner[data-inverted='true'],
:global(.btn--primary) .app-spinner {
  --spinner-track: rgba(255, 255, 255, 0.3);
  --spinner-head: white;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
