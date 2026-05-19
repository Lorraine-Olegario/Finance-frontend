<template>
  <div
    class="table-actions"
    :class="`table-actions--${align}`"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  align: {
    type: String,
    default: 'center',
    validator: v => ['start', 'center', 'end'].includes(v),
  },
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
