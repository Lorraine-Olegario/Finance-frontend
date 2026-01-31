<template>
  <div class="empty-state">
    <div class="empty-icon-wrapper">
      <!-- Custom Icon Slot -->
      <slot name="icon">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <circle cx="12" cy="12" r="10" /> <line x1="12" y1="16" x2="12" y2="12" /> <line x1="12" y1="8" x2="12.01" y2="8" /> </svg>
      </slot>
    </div>
    
    <h3 class="empty-title">
      {{ title }}
    </h3>
    <p class="empty-description">
      {{ description }}
    </p>
    
    <!-- Action Slot -->
    <div
      v-if="$slots.action"
      class="empty-action"
    >
      <slot name="action" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--surface);
  border-radius: 16px;
  border: 2px dashed var(--border);
}

.empty-icon-wrapper {
  margin: 0 auto 1.5rem;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.empty-title {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.empty-action {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
