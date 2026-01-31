<template>
  <div class="loading-container" :class="{ fullscreen: fullscreen }">
    <div class="spinner" :style="{ width: size, height: size }" />
    <p v-if="message" class="loading-message">
      {{ message }}
    </p>
  </div>
</template>

<script>
  export default {
    name: "LoadingSpinner",
    props: {
      message: {
        type: String,
        default: "Carregando...",
      },
      size: {
        type: String,
        default: "48px",
      },
      fullscreen: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style scoped>
  .loading-container {
    text-align: center;
    padding: 4rem 2rem;
  }

  .loading-container.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .spinner {
    border: 4px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    animation: spin 0.8s linear infinite;
  }

  .loading-message {
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
