<template>
  <RouterLink
    :to="to"
    class="quick-action-card"
  >
    <span class="quick-action-icon"><slot name="icon" /></span>
    <span class="quick-action-label">{{ label }}</span>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  to: { type: String, required: true },
  label: { type: String, required: true }
})
</script>

<style scoped>
.quick-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 24px;
  background: var(--surface);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.quick-action-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.quick-action-icon :deep(svg) {
  width: 32px;
  height: 32px;
  stroke: var(--primary);
}

.quick-action-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
}
</style>
