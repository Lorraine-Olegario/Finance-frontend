<template>
  <div :class="['stat-card', variant]">
    <div class="stat-icon">
      <slot name="icon"></slot>
    </div>
    <div class="stat-content">
      <p class="stat-label">{{ label }}</p>
      <p class="stat-value">{{ value }}</p>
      <p v-if="subtitle" :class="['stat-change', { positive: isPositive }]">
        <slot name="subtitle-icon"></slot>
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    subtitle: { type: String, default: '' },
    variant: { type: String, default: 'primary' },
    isPositive: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
.stat-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--border-color);
  display: flex;
  gap: 16px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: currentColor;
}

.stat-card.primary { color: #3b82f6; }
.stat-card.success { color: #10b981; }
.stat-card.info { color: #8b5cf6; }
.stat-card.warning { color: #f59e0b; }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.stat-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0.1;
  border-radius: 12px;
}

.stat-icon :deep(svg) {
  width: 28px;
  height: 28px;
  stroke: currentColor;
  position: relative;
  z-index: 1;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 8px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  line-height: 1;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change :deep(svg) {
  width: 14px;
  height: 14px;
}
</style>
