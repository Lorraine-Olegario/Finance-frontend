<template>
  <div
    class="alert"
    :class="`alert-${type}`"
  >
    <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <!-- Error Icon --> <template v-if="type === 'error'"> <circle cx="12" cy="12" r="10" /> <line x1="12" y1="8" x2="12" y2="12" /> <line x1="12" y1="16" x2="12.01" y2="16" /> </template> <!-- Warning Icon --> <template v-else-if="type === 'warning'"> <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /> <line x1="12" y1="9" x2="12" y2="13" /> <line x1="12" y1="17" x2="12.01" y2="17" /> </template> <!-- Success Icon --> <template v-else-if="type === 'success'"> <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /> <polyline points="22 4 12 14.01 9 11.01" /> </template> <!-- Info Icon --> <template v-else> <circle cx="12" cy="12" r="10" /> <line x1="12" y1="16" x2="12" y2="12" /> <line x1="12" y1="8" x2="12.01" y2="8" /> </template> </svg>
    
    <div class="alert-content">
      <h4
        v-if="title"
        class="alert-title"
      >
        {{ title }}
      </h4>
      <p class="alert-message">
        {{ message }}
      </p>
    </div>
    
    <button
      v-if="dismissible"
      class="alert-close"
      @click="$emit('dismiss')"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <line x1="18" y1="6" x2="6" y2="18" /> <line x1="6" y1="6" x2="18" y2="18" /> </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ErrorAlert',
  props: {
    type: {
      type: String,
      default: 'error',
      validator: (value) => ['error', 'warning', 'success', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    dismissible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['dismiss']
}
</script>

<style scoped>
.alert {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 2px solid;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.alert-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}

.alert-success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.3);
}

.alert-info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.3);
}

.alert-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 700;
}

.alert-message {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.alert-close {
  background: transparent;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  color: currentColor;
}

.alert-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

.alert-close svg {
  width: 16px;
  height: 16px;
}
</style>
