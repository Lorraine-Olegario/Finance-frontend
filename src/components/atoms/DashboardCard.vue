<template>
  <div class="dashboard-card">
    <div class="dashboard-card__header">
      <span
        v-if="$slots.icon"
        class="dashboard-card__icon"
      >
        <slot name="icon" />
      </span>
      <h3 class="dashboard-card__title">
        {{ title }}
      </h3>
      <div
        v-if="$slots.actions"
        class="dashboard-card__actions"
      >
        <slot name="actions" />
      </div>
    </div>
    <div class="dashboard-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true }
})
</script>

<style scoped>
.dashboard-card {
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.dashboard-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.dashboard-card__icon :deep(svg) {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.dashboard-card__title {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.dashboard-card__actions {
  margin-left: auto;
}

.dashboard-card__body {
  padding: 1.5rem;
}
</style>
