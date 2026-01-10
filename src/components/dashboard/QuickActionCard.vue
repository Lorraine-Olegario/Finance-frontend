<template>
  <router-link
    :to="to"
    class="action-card"
  >
    <slot name="icon" />
    <span>{{ label }}</span>
  </router-link>
</template>

<script>
export default {
  name: 'QuickActionCard',
  props: {
    to: { type: String, required: true },
    label: { type: String, required: true }
  }
}
</script>

<style scoped>
.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: var(--surface);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
  cursor: pointer;
}

.action-card:hover {
  border-color: var(--primary);
  background: rgba(98, 0, 238, 0.02);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.action-card :deep(svg) {
  width: 32px;
  height: 32px;
  stroke: var(--primary);
}

.action-card span {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
}
</style>
