<template>
  <div class="d-card">
    <div class="d-card-header">
      <span
        v-if="$slots.icon"
        class="d-card-icon"
      >
        <slot name="icon" />
      </span>
      <h3 class="d-card-title">
        {{ title }}
      </h3>
      <div
        v-if="$slots.actions"
        class="d-card-actions"
      >
        <slot name="actions" />
      </div>
    </div>
    <div class="d-card-body">
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
.d-card {
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.d-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.d-card-icon :deep(svg) {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.d-card-title {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.d-card-actions {
  margin-left: auto;
}

.d-card-body {
  padding: 1.5rem;
}
</style>
