<template>
  <NetWorthCard
    title="Evolução do Patrimônio"
    empty-title="Sem evolução para exibir"
    empty-description="Cadastre suas compras para ver a evolução"
    :loading="loading"
    :error="error"
    :empty="visiblePoints.length === 0"
    @retry="$emit('retry')"
  >
    <template #actions>
      <label class="net-worth-evolution__select">
        <SvgIcon
          name="calendar"
          :size="16"
        />
        <BaseSelect
          :model-value="controls.period"
          :options="PERIOD_OPTIONS"
          aria-label="Período"
          @update:model-value="updateControls({ period: $event })"
        />
      </label>
      <label class="net-worth-evolution__select">
        <SvgIcon
          name="dollar"
          :size="16"
        />
        <BaseSelect
          :model-value="controls.categoryId"
          :options="categoryOptions"
          aria-label="Tipo de ativo"
          @update:model-value="updateControls({ categoryId: $event })"
        />
      </label>
    </template>

    <div
      v-if="controls.period === 'custom'"
      class="net-worth-evolution__custom"
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
        :disabled="!isCustomRangeValid"
        @click="updateControls({ from: customFrom, to: customTo })"
      >
        Aplicar
      </BaseButton>
      <span
        v-if="customFrom && customTo && !isCustomRangeValid"
        class="net-worth-evolution__range-error"
      >
        A data inicial deve ser anterior à final, sem datas futuras.
      </span>
    </div>

    <div class="net-worth-evolution__chart">
      <canvas
        ref="chartCanvas"
        role="img"
        :aria-label="ariaLabel"
      />
    </div>
  </NetWorthCard>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import NetWorthCard from '@/components/molecules/NetWorthCard/index.vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import { getCssVar } from '@/utils/cssVar'
import { formatCurrency } from '@/utils/formatCurrency'
import { useVisibilityStore } from '@/stores/visibility'

Chart.register(...registerables)

const PERIOD_OPTIONS = [
  { value: '12m', label: 'Últimos 12 meses' },
  { value: '2y', label: 'Últimos 2 anos' },
  { value: '5y', label: 'Últimos 5 anos' },
  { value: 'yearly', label: 'Anual' },
  { value: 'custom', label: 'Data personalizada' }
]

const props = defineProps({
  controls: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
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
}>()

const visibilityStore = useVisibilityStore()
const chartCanvas = ref(null)
const today = new Date().toISOString().slice(0, 10)
const customFrom = ref(props.controls.from || '')
const customTo = ref(props.controls.to || '')
let chart = null

const categoryOptions = computed(() => [
  { value: '', label: 'Todos os tipos' },
  ...props.categories.map(category => ({
    value: String(category.id),
    label: category.label
  }))
])

// O back devolve zeros antes da primeira compra: corta o trecho inicial vazio.
const visiblePoints = computed(() => {
  const firstIndex = props.points.findIndex(
    point => point.invested || point.capital_gain || point.net_worth
  )
  return firstIndex === -1 ? [] : props.points.slice(firstIndex)
})

const isCustomRangeValid = computed(
  () =>
    Boolean(customFrom.value) &&
    Boolean(customTo.value) &&
    customFrom.value <= customTo.value &&
    customTo.value <= today
)

const ariaLabel = computed(() => {
  if (visiblePoints.value.length === 0) return 'Evolução do patrimônio'
  const last = visiblePoints.value[visiblePoints.value.length - 1]
  return `Evolução do patrimônio de ${visiblePoints.value[0].label} a ${last.label}. Patrimônio atual: ${formatCurrency(last.net_worth, visibilityStore.valuesHidden)}`
})

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

function formatAxisValue(value, hidden) {
  if (hidden) return formatCurrency(value, true)
  if (Math.abs(value) >= 10000) return `R$ ${value / 1000}K`
  return `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

function renderChart() {
  destroyChart()

  if (!chartCanvas.value || visiblePoints.value.length === 0) return

  const hidden = visibilityStore.valuesHidden
  const textColor = getCssVar('--text-secondary')
  const subtleColor = getCssVar('--border-subtle')
  const points = visiblePoints.value

  chart = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: points.map(point => point.label),
      datasets: [
        {
          label: 'Valor aplicado',
          data: points.map(point => point.invested),
          backgroundColor: getCssVar('--networth-invested')
        },
        {
          label: 'Ganho de Capital',
          data: points.map(point => point.capital_gain),
          backgroundColor: getCssVar('--networth-gain')
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
            callback: value => formatAxisValue(value, hidden)
          },
          grid: {
            color: context =>
              context.tick.value === 0
                ? getCssVar('--text-muted')
                : subtleColor,
            lineWidth: context => (context.tick.value === 0 ? 2 : 1)
          }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { color: textColor } },
        tooltip: {
          backgroundColor: getCssVar('--bg-elevated'),
          borderColor: getCssVar('--border-default'),
          borderWidth: 1,
          titleColor: getCssVar('--text-primary'),
          bodyColor: textColor,
          footerColor: getCssVar('--text-primary'),
          callbacks: {
            label: context =>
              `${context.dataset.label}: ${formatCurrency(context.parsed.y, hidden)}`,
            labelTextColor: context =>
              context.datasetIndex === 1
                ? getCssVar(
                    context.parsed.y < 0
                      ? '--networth-negative'
                      : '--networth-positive'
                  )
                : textColor,
            footer: items =>
              `Patrimônio total: ${formatCurrency(points[items[0].dataIndex].net_worth, hidden)}`
          }
        }
      }
    }
  })
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
