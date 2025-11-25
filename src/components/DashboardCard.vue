<template>
  <div class="card">
    <div v-if="title" class="card-header">
      <h3>
        <slot name="icon"></slot>
        {{ title }}
      </h3>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'DashboardCard',
  props: {
    title: { type: String, default: '' }
  }
}
</script>

<style scoped>
.card {
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-header :deep(.icon) {
  width: 20px;
  height: 20px;
  color: var(--primary);
}
</style>
