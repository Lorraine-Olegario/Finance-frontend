<template>
  <button
    type="button"
    class="action-btn"
    :class="`action-btn--${variant}`"
    :title="title"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    // default | edit | delete | play | pause | observe | info
    validator: v =>
      [
        'default',
        'edit',
        'delete',
        'play',
        'pause',
        'observe',
        'info'
      ].includes(v)
  },
  title: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.action-btn :deep(svg) {
  width: 18px;
  height: 18px;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.action-btn:not(:disabled):hover {
  transform: scale(1.05);
}

.action-btn--default:not(:disabled):hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
.action-btn--edit:not(:disabled):hover {
  background: rgba(98, 0, 238, 0.08);
  border-color: var(--primary);
  color: var(--primary);
}
.action-btn--delete:not(:disabled):hover {
  background: rgba(220, 38, 38, 0.08);
  border-color: var(--danger);
  color: var(--danger);
}
.action-btn--play:not(:disabled):hover {
  background: rgba(0, 200, 83, 0.08);
  border-color: var(--success);
  color: var(--success);
}
.action-btn--pause:not(:disabled):hover {
  background: rgba(245, 158, 11, 0.08);
  border-color: var(--accent-yellow);
  color: var(--accent-yellow);
}
.action-btn--observe:not(:disabled):hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}
.action-btn--info:not(:disabled):hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}
</style>
