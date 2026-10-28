<template>
  <DividendsCard
    title="Distribuição de proventos em 12 meses"
    :loading="loading"
    :error="error"
    :empty="items.length === 0"
    @retry="$emit('retry')"
  >
    <div class="dividends-distribution">
      <div class="dividends-distribution__chart">
        <canvas ref="chartCanvas" />
      </div>

      <ul class="dividends-distribution__legend">
        <li
          v-for="(item, index) in visibleItems"
          :key="item.code"
          class="dividends-distribution__item"
        >
          <span
            class="dividends-distribution__dot"
            :style="{ backgroundColor: colorFor(index, item.isOther) }"
          />
          <span class="dividends-distribution__code">{{ item.code }}</span>
          <span class="dividends-distribution__percent">
            {{ formatPercentValue(item.percent) }}
          </span>
        </li>
      </ul>

      <BaseButton
        v-if="items.length > 0"
        variant="secondary"
        size="sm"
        class="dividends-distribution__all"
        @click="$emit('show-all')"
      >
        Ver todos
      </BaseButton>
    </div>
  </DividendsCard>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import DividendsCard from '@/components/molecules/DividendsCard/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import { getCssVar } from '@/utils/cssVar'

Chart.register(...registerables)

const MAX_VISIBLE = 5
const PALETTE_SIZE = 8

const props = defineProps({
  items: {
    type: Array,
    default: () => []
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
  'show-all': []
}>()

const chartCanvas = ref(null)
let chart = null

// Maiores ativos + os demais agrupados em "Outros"
const visibleItems = computed(() => {
  const rows = props.items.map(item => ({
    code: item.asset.code,
    total: item.total,
    percent: item.percent,
    isOther: false
  }))

  if (rows.length <= MAX_VISIBLE) return rows

  const rest = rows.slice(MAX_VISIBLE)
  return [
    ...rows.slice(0, MAX_VISIBLE),
    {
      code: 'Outros',
      total: rest.reduce((sum, row) => sum + row.total, 0),
      percent:
        Math.round(rest.reduce((sum, row) => sum + row.percent, 0) * 100) / 100,
      isOther: true
    }
  ]
})

watch(
  () => [props.items, props.loading, props.error],
  async () => {
    await nextTick()
    renderChart()
  },
  { deep: true, immediate: true }
)

onBeforeUnmount(destroyChart)

function colorFor(index, isOther) {
  return isOther
    ? getCssVar('--chart-palette-other')
    : getCssVar(`--chart-palette-${(index % PALETTE_SIZE) + 1}`)
}

function formatPercentValue(value) {
  return `${Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`
}

function destroyChart() {
  chart?.destroy()
  chart = null
}

function renderChart() {
  destroyChart()

  if (!chartCanvas.value || visibleItems.value.length === 0) return

  chart = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: visibleItems.value.map(item => item.code),
      datasets: [
        {
          data: visibleItems.value.map(item => item.total),
          backgroundColor: visibleItems.value.map((item, index) =>
            colorFor(index, item.isOther)
          ),
          borderWidth: 0
        }
      ]
    },
    options: {
      cutout: '62%',
      plugins: { legend: { display: false } }
    }
  })
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
