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
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  percentage: {
    type: [Number, String],
    required: true,
  },
  color: {
    type: String,
    default: '#6b7280',
  },
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
