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

<style scoped>
.badge-atom {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
