<template>
  <div class="category-item">
    <div class="category-info">
      <div class="category-color" :style="{ backgroundColor: color }" />
      <span class="category-name">{{ name }}</span>
    </div>
    <div class="category-stats">
      <span class="category-count">{{ count }}</span>
      <span class="category-percentage">{{ percentage }}%</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CategoryListItem",
    props: {
      name: { type: String, required: true },
      count: { type: Number, required: true },
      percentage: { type: [String, Number], required: true },
      color: { type: String, required: true },
    },
  };
</script>

<style scoped>
  .category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .category-item:last-child {
    border-bottom: none;
  }

  .category-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .category-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .category-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .category-stats {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .category-count {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .category-percentage {
    font-size: 0.875rem;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: 500;
  }
</style>
