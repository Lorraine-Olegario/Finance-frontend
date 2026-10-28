<template>
  <DividendsCard
    title="Resumo"
    :loading="loading"
    :error="error"
    @retry="$emit('retry')"
  >
    <div class="dividends-summary">
      <div class="dividends-summary__block">
        <span class="dividends-summary__label">
          Média Mensal (últ. 12 meses)
        </span>
        <strong
          class="dividends-summary__value dividends-summary__value--highlight"
        >
          {{ money(summary?.monthly_average) }}
        </strong>
      </div>

      <div class="dividends-summary__block">
        <span class="dividends-summary__label">
          Total de 12 meses
          <SvgIcon
            name="info"
            :size="14"
            label="Soma dos proventos líquidos já recebidos nos últimos 12 meses. A média mensal é esse total dividido por 12."
          />
        </span>
        <strong class="dividends-summary__value">
          {{ money(summary?.last_12_months_total) }}
        </strong>
      </div>

      <div class="dividends-summary__block">
        <span class="dividends-summary__label">Total da carteira</span>
        <strong class="dividends-summary__value">
          {{ money(summary?.portfolio_total) }}
        </strong>
      </div>
    </div>
  </DividendsCard>
</template>

<script setup lang="ts">
import DividendsCard from '@/components/molecules/DividendsCard/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import { useVisibilityStore } from '@/stores/visibility'
import { formatCurrency } from '@/utils/formatCurrency'

defineProps({
  summary: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits<{
  retry: []
}>()

const visibilityStore = useVisibilityStore()

function money(value) {
  return formatCurrency(value ?? 0, visibilityStore.valuesHidden)
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
