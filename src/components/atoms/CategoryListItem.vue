<template>
  <div class="cat-item">
    <span
      class="cat-dot"
      :style="{ backgroundColor: color }"
    />
    <span class="cat-name">{{ name }}</span>
    <span class="cat-count">{{ count }}</span>
    <span class="cat-pct">{{ percentage }}%</span>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  count: { type: Number, required: true },
  percentage: { type: [Number, String], required: true },
  color: { type: String, default: '#6b7280' }
})
</script>

<style scoped>
.cat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.cat-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cat-name {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.cat-count {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.cat-pct {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}
</style>
