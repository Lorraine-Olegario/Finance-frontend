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
import AppSpinner from '@/components/atoms/AppSpinner/index.vue'

defineOptions({ inheritAttrs: false })

defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'secondary', 'ghost', 'danger'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: v => ['sm', 'md', 'lg'].includes(v),
  },
  type: {
    type: String,
    default: 'button',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
