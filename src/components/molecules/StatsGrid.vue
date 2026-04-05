<template>
  <div
    class="stats-grid"
    :style="colsStyle"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cols: { type: Number, default: null },
  minWidth: { type: String, default: '220px' }
})

const colsStyle = computed(() => {
  if (props.cols) {
    return { gridTemplateColumns: `repeat(${props.cols}, 1fr)` }
  }
  return {
    gridTemplateColumns: `repeat(auto-fit, minmax(${props.minWidth}, 1fr))`
  }
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
