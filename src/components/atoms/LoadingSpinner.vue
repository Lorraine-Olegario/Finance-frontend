<template>
  <div
    class="loading-spinner"
    :class="{ 'loading-spinner--fullscreen': fullscreen }"
  >
    <div
      class="loading-spinner__spinner"
      :style="{ width: size, height: size }"
    />
    <p
      v-if="message"
      class="loading-spinner__message"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: 'Carregando...' },
  size: { type: String, default: '48px' },
  fullscreen: { type: Boolean, default: false }
})
</script>

<style scoped>
.loading-spinner {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner--fullscreen {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner__spinner {
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  animation: spin 0.8s linear infinite;
}

.loading-spinner__message {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
