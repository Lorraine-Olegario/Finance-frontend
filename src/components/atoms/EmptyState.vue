<template>
  <div class="empty-state">
    <div class="empty-state__icon-wrapper">
      <slot name="icon">
        <SvgIcon
          name="info"
          :size="64"
          class="empty-state__icon"
        />
      </slot>
    </div>
    <h3 class="empty-state__title">
      {{ title }}
    </h3>
    <p class="empty-state__description">
      {{ description }}
    </p>
    <div
      v-if="$slots.action"
      class="empty-state__action"
    >
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/atoms/SvgIcon.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true }
})
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--surface);
  border-radius: 16px;
  border: 2px dashed var(--border);
}

.empty-state__icon-wrapper {
  margin: 0 auto 1.5rem;
}

.empty-state__icon {
  width: 64px;
  height: 64px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.empty-state__title {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-state__description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.empty-state__action {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
