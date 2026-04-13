<template>
  <button
    class="base-btn"
    :class="[
      `base-btn--${variant}`,
      `base-btn--${size}`,
      { 'base-btn--loading': loading }
    ]"
    :type="type"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <AppSpinner
      v-if="loading"
      size="16px"
      :inverted="variant === 'primary' || variant === 'danger'"
    />
    <slot name="icon-left" />
    <span
      v-if="$slots.default"
      class="base-btn__label"
    >
      <slot />
    </span>
    <slot name="icon-right" />
  </button>
</template>

<script setup>
import AppSpinner from './AppSpinner.vue'

defineOptions({ inheritAttrs: false })

defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost | danger
  size: { type: String, default: 'md' }, // sm | md | lg
  type: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
}

.base-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.base-btn:not(:disabled):active {
  transform: scale(0.97);
}

/* Sizes */
.base-btn--sm {
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
}
.base-btn--md {
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
}
.base-btn--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* Variants */
.base-btn--primary {
  background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
  color: white;
}
.base-btn--primary:not(:disabled):hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, #6d28d9 100%);
  box-shadow: 0 4px 12px rgba(98, 0, 238, 0.35);
  transform: translateY(-1px);
}

.base-btn--secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border);
}
.base-btn--secondary:not(:disabled):hover {
  background: var(--bg-hover);
  border-color: var(--primary);
  color: var(--primary);
}

.base-btn--ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: transparent;
}
.base-btn--ghost:not(:disabled):hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.base-btn--danger {
  background: var(--danger);
  color: white;
}
.base-btn--danger:not(:disabled):hover {
  background: #b91c1c;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
  transform: translateY(-1px);
}

.base-btn__label {
  line-height: 1;
}
</style>
