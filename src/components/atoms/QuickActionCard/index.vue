<template>
  <RouterLink
    :to="to"
    class="quick-action-card"
  >
    <span class="quick-action-card__icon"><slot name="icon" /></span>
    <span class="quick-action-card__label">{{ label }}</span>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  to: { type: String, required: true },
  label: { type: String, required: true }
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
