<template>
  <div class="category-item">
    <span
      class="category-item__dot"
      :style="{ backgroundColor: color }"
    />
    <div class="category-item__info">
      <span class="category-item__name">{{ name }}</span>
      <span class="category-item__meta">
        {{ count }} ativo{{ count === 1 ? '' : 's' }}
      </span>
    </div>
    <span
      v-if="value"
      class="category-item__value money"
    >
      {{ value }}
    </span>
    <span class="category-item__percentage num">{{ percentage }}%</span>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  percentage: {
    type: [Number, String],
    required: true
  },
  color: {
    type: String,
    default: 'var(--text-muted)'
  }
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
