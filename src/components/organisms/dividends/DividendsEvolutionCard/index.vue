<template>
  <DividendsCard
    title="Evolução de Proventos"
    :loading="loading"
    :error="error"
    :empty="points.length === 0"
    @retry="$emit('retry')"
  >
    <template #actions>
      <SegmentedControl
        :model-value="controls.group"
        :options="GROUP_OPTIONS"
        @update:model-value="updateControls({ group: $event })"
      />
      <BaseSelect
        :model-value="controls.period"
        :options="PERIOD_OPTIONS"
        aria-label="Período"
        @update:model-value="updateControls({ period: $event })"
      />
    </template>

    <div
      v-if="controls.period === 'custom'"
      class="dividends-evolution__custom"
    >
      <label>
        De
        <input
          v-model="customFrom"
          type="date"
          :max="today"
        />
      </label>
      <label>
        Até
        <input
          v-model="customTo"
          type="date"
          :max="today"
        />
      </label>
      <BaseButton
        variant="primary"
        size="sm"
        :disabled="!customFrom || !customTo || customFrom > customTo"
        @click="updateControls({ from: customFrom, to: customTo })"
      >
        Aplicar
      </BaseButton>
    </div>

    <div class="dividends-evolution__chart">
      <canvas ref="chartCanvas" />
    </div>

    <p class="dividends-evolution__hint">
      Você pode clicar nas barras para visualizar os detalhes de cada mês.
    </p>
  </DividendsCard>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import DividendsCard from '@/components/molecules/DividendsCard/index.vue'
import SegmentedControl from '@/components/molecules/SegmentedControl/index.vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import { getCssVar } from '@/utils/cssVar'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatEvolutionPeriod } from '@/utils/dividendLabels'
import { useVisibilityStore } from '@/stores/visibility'

Chart.register(...registerables)

const GROUP_OPTIONS = [
  { value: 'month', label: 'Mensal' },
  { value: 'year', label: 'Anual' }
]

const PERIOD_OPTIONS = [
  { value: '12m', label: 'Últimos 12 meses' },
  { value: '2y', label: 'Últimos 2 anos' },
  { value: '5y', label: 'Últimos 5 anos' },
  { value: 'custom', label: 'Data personalizada' }
]

const props = defineProps({
  controls: {
    type: Object,
    required: true
  },
  points: {
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

const emit = defineEmits<{
  retry: []
  'update:controls': [controls: object]
  'select-period': [period: string]
}>()

const visibilityStore = useVisibilityStore()
const chartCanvas = ref(null)
const today = new Date().toISOString().slice(0, 10)
const customFrom = ref(props.controls.from || '')
const customTo = ref(props.controls.to || '')
let chart = null

watch(
  () => [
    props.points,
    props.loading,
    props.error,
    visibilityStore.valuesHidden
  ],
  async () => {
    await nextTick()
    renderChart()
  },
  { deep: true, immediate: true }
)

onBeforeUnmount(destroyChart)

function updateControls(changes) {
  emit('update:controls', { ...props.controls, ...changes })
}

function destroyChart() {
  chart?.destroy()
  chart = null
}

function renderChart() {
  destroyChart()

  if (!chartCanvas.value || props.points.length === 0) return

  const hidden = visibilityStore.valuesHidden
  const textColor = getCssVar('--text-secondary')

  chart = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: props.points.map(point => formatEvolutionPeriod(point.period)),
      datasets: [
        {
          label: 'Proventos recebidos',
          data: props.points.map(point => point.received),
          backgroundColor: getCssVar('--chart-blue')
        },
        {
          label: 'Proventos a receber',
          data: props.points.map(point => point.pending),
          backgroundColor: getCssVar('--chart-blue-light')
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          ticks: { color: textColor },
          grid: { display: false }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColor,
            callback: value => formatCurrency(value, hidden)
          },
          grid: { color: getCssVar('--border-subtle') }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { color: textColor } },
        tooltip: {
          callbacks: {
            label: context =>
              `${context.dataset.label}: ${formatCurrency(context.parsed.y, hidden)}`
          }
        }
      },
      onClick: (_event, elements) => {
        if (elements.length === 0) return
        emit('select-period', props.points[elements[0].index].period)
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length
          ? 'pointer'
          : 'default'
      }
    }
  })
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
