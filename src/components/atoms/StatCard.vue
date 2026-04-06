<template>
  <div
    class="stat-card"
    :class="`stat-card--${variant}`"
  >
    <div class="stat-header">
      <div class="stat-icon">
        <slot name="icon" />
      </div>
    </div>
    <p class="stat-label">
      {{ label }}
    </p>
    <p class="stat-value">
      {{ value }}
    </p>
    <p
      v-if="subtitle || $slots['subtitle-icon']"
      class="stat-change"
      :class="{ positive: isPositive }"
    >
      <slot name="subtitle-icon" />
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtitle: { type: String, default: '' },
  variant: {
    type: String,
    default: 'primary',
    validator: v => ['primary', 'success', 'info', 'warning'].includes(v)
  },
  isPositive: { type: Boolean, default: false }
})
</script>

<style scoped>
.stat-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Barra de accent lateral */
.stat-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: currentColor;
  border-radius: 16px 0 0 16px;
}

/* Variantes — cor via currentColor */
.stat-card--primary {
  color: var(--accent-blue);
}
.stat-card--success {
  color: var(--accent-green);
}
.stat-card--info {
  color: var(--accent);
}
.stat-card--warning {
  color: var(--accent-yellow);
}

.stat-header {
  margin-bottom: 1rem;
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
  border-radius: 12px;
  background: currentColor;
  opacity: 0.1;
}

.stat-icon :deep(svg) {
  width: 28px;
  height: 28px;
  stroke: currentColor;
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.25rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin: 0 0 0.5rem;
}

.stat-change {
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}

.stat-change.positive {
  color: var(--accent-green);
}
.stat-change :deep(svg) {
  width: 14px;
  height: 14px;
}
</style>
