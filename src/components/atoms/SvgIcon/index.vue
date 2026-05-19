<template>
  <!-- eslint-disable vue/no-v-html -->
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-label="label || undefined"
    :aria-hidden="!label || undefined"
    v-html="path"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script setup>
import { computed } from 'vue'
import { icons } from '@/assets/icons/index.js'

const props = defineProps({
  /** Nome do ícone — chave em src/assets/icons/index.js */
  name: {
    type: String,
    required: true,
  },
  /** Tamanho em px (width e height iguais) */
  size: {
    type: [String, Number],
    default: 24,
  },
  /** Espessura do traço */
  strokeWidth: {
    type: [String, Number],
    default: 2,
  },
  /** Label acessível. Se vazio, o ícone é aria-hidden. */
  label: {
    type: String,
    default: '',
  },
})

const path = computed(() => {
  if (import.meta.env.DEV && !icons[props.name]) {
    console.warn(`[SvgIcon] Ícone não encontrado: "${props.name}"`)
  }
  return icons[props.name] ?? ''
})
</script>
