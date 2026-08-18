<template>
  <div
    class="stat-card"
    :class="`stat-card--${variant}`"
  >
    <div class="stat-card__header">
      <div class="stat-card__icon">
        <slot name="icon" />
      </div>
      <div class="stat-card__meta">
        <p class="stat-card__label">
          {{ label }}
        </p>
        <p class="stat-card__value money">
          {{ value }}
        </p>
      </div>
    </div>
    <p
      v-if="subtitle || $slots['subtitle-icon']"
      class="stat-card__change num"
      :class="{ 'stat-card__change--positive': isPositive }"
    >
      <slot name="subtitle-icon" />
      {{ subtitle }}
    </p>
    <div
      v-if="$slots.sparkline"
      class="stat-card__sparkline"
    >
      <slot name="sparkline" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary',
    validator: v =>
      ['primary', 'success', 'info', 'warning', 'danger'].includes(v)
  },
  isPositive: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
