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
defineOptions({ inheritAttrs: false })

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

<style scoped lang="scss">
@use './styles.module';
</style>
