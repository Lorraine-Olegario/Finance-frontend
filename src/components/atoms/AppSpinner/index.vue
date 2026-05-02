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

<style scoped lang="scss">
@use './styles.module';
</style>
