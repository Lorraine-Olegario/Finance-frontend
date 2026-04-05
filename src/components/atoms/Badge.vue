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

// Cores padrão por categoria — ver docs/style-guide.md §4
const CATEGORY_COLORS = {
  Ação: '#3b82f6',
  Ações: '#3b82f6',
  FII: '#10b981',
  ETF: '#f59e0b',
  BDR: '#8b5cf6',
  Cripto: '#ec4899',
  'Renda Fixa': '#f59e0b'
}

const props = defineProps({
  label: { type: String, required: true },
  color: { type: String, default: null } // hex override; usa CATEGORY_COLORS se omitido
})

const badgeStyle = computed(() => ({
  backgroundColor: props.color || CATEGORY_COLORS[props.label] || '#6b7280',
  color: 'white'
}))
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
