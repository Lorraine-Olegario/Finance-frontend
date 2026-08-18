<template>
  <svg
    class="sparkline"
    width="90"
    height="30"
    viewBox="0 0 90 30"
    aria-hidden="true"
  >
    <polyline
      class="sparkline__line"
      :class="positive ? 'sparkline__line--up' : 'sparkline__line--down'"
      :points="points"
      fill="none"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
// ── Imports ──────────────────────────────────────────────────────────────
import { computed } from 'vue'

// ── State ────────────────────────────────────────────────────────────────
// NOTA: curva puramente decorativa. A API ainda não expõe uma série
// histórica de patrimônio — enquanto esse endpoint não existir, usamos duas
// curvas ilustrativas fixas (alta/baixa) escolhidas apenas pelo sinal do
// lucro total, só como assinatura visual do card. Trocar por dados reais
// assim que houver histórico disponível.
const UP_POINTS = '0,22 12,20 24,24 36,14 48,17 60,8 72,12 90,4'
const DOWN_POINTS = '0,6 12,10 24,8 36,16 48,13 60,20 72,17 90,26'

const props = defineProps({
  positive: {
    type: Boolean,
    default: true
  }
})

// ── Computed ─────────────────────────────────────────────────────────────
const points = computed(() => (props.positive ? UP_POINTS : DOWN_POINTS))
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
