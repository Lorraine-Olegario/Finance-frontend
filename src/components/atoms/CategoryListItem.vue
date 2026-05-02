<template>
  <div class="category-item">
    <span
      class="category-item__dot"
      :style="{ backgroundColor: color }"
    />
    <span class="category-item__name">{{ name }}</span>
    <span class="category-item__count">{{ count }}</span>
    <span class="category-item__percentage">{{ percentage }}%</span>
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
.category-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.category-item__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-item__name {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.category-item__count {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.category-item__percentage {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
}
</style>
