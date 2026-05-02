<template>
  <span
    class="badge-atom"
    :style="badgeStyle"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  color: { type: String, default: null } // hex override; usa CATEGORY_COLORS se omitido
})

const badgeStyle = computed(() => {
  const bg = props.color || '#6b7280'
  return { backgroundColor: bg, color: 'white' }
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
