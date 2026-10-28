<template>
  <div class="net-worth-donut">
    <div class="net-worth-donut__block">
      <div class="net-worth-donut__chart">
        <canvas
          ref="chartCanvas"
          role="img"
          :aria-label="ariaLabel"
        />
      </div>

      <ul class="net-worth-donut__list">
        <li
          v-for="item in items"
          :key="item.label"
          class="net-worth-donut__item"
        >
          <span class="net-worth-donut__name">
            {{ item.label }}
            <button
              v-if="canClassify && item.label === UNCLASSIFIED_LABEL"
              type="button"
              class="net-worth-donut__classify"
              @click="$emit('classify')"
            >
              Classificar
            </button>
          </span>
          <span class="net-worth-donut__value">
            {{ formatCurrency(item.value, visibilityStore.valuesHidden) }}
          </span>
          <span class="net-worth-donut__percent">
            {{ formatPlainPercent(item.percent) }}
          </span>
          <span class="net-worth-donut__track">
            <span
              class="net-worth-donut__bar"
              :style="{
                width: `${Math.min(Number(item.percent), 100)}%`,
                backgroundColor: colorFor(item, items.indexOf(item))
              }"
            />
          </span>
        </li>
      </ul>
    </div>

    <div
      v-if="showIdeal"
      class="net-worth-donut__block"
    >
      <div class="net-worth-donut__chart">
        <canvas
          ref="idealCanvas"
          role="img"
          :aria-label="`Posição ideal: ${idealSummary}`"
        />
      </div>

      <ul class="net-worth-donut__list net-worth-donut__list--ideal">
        <li
          v-for="item in idealItems"
          :key="item.label"
          class="net-worth-donut__item net-worth-donut__item--ideal"
        >
          <span class="net-worth-donut__percent">
            {{ formatPlainPercent(item.percent) }}
          </span>
          <span
            class="net-worth-donut__dot"
            :style="{ backgroundColor: colorFor(item, items.indexOf(item)) }"
          />
          <span class="net-worth-donut__name">{{ item.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import { getCssVar } from '@/utils/cssVar'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatPlainPercent } from '@/utils/formatPlainPercent'
import { useVisibilityStore } from '@/stores/visibility'

Chart.register(...registerables)

const UNCLASSIFIED_LABEL = 'Sem classificação'
const PALETTE_SIZE = 8
const MIN_LABELED_PERCENT = 3
const MAX_LABEL_LENGTH = 24

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  showIdeal: {
    type: Boolean,
    default: false
  },
  canClassify: {
    type: Boolean,
    default: false
  }
})

defineEmits<{
  classify: []
}>()

const visibilityStore = useVisibilityStore()
const chartCanvas = ref(null)
const idealCanvas = ref(null)
const charts = []

const idealItems = computed(() =>
  props.items
    .filter(item => item.ideal_percent != null)
    .map(item => ({ ...item, percent: item.ideal_percent }))
    .sort((a, b) => b.percent - a.percent)
)

const ariaLabel = computed(() => summarize(props.items))
const idealSummary = computed(() => summarize(idealItems.value))

// Rótulos externos com linha-guia: o Chart.js não os desenha nativamente.
const externalLabelsPlugin = {
  id: 'externalLabels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    const dataset = chart.data.datasets[0]
    const textColor = getCssVar('--text-primary')

    ctx.save()
    ctx.font = `12px ${getCssVar('--font-sans')}`
    ctx.textBaseline = 'middle'

    chart.getDatasetMeta(0).data.forEach((arc, index) => {
      if (chart.$percents[index] < MIN_LABELED_PERCENT) return

      const { x, y, outerRadius, startAngle, endAngle } = arc.getProps(
        ['x', 'y', 'outerRadius', 'startAngle', 'endAngle'],
        true
      )
      const angle = (startAngle + endAngle) / 2
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const side = cos >= 0 ? 1 : -1
      const elbowX = x + cos * (outerRadius + 12)
      const elbowY = y + sin * (outerRadius + 12)
      const endX = elbowX + side * 10

      ctx.strokeStyle = dataset.backgroundColor[index]
      ctx.beginPath()
      ctx.moveTo(x + cos * outerRadius, y + sin * outerRadius)
      ctx.lineTo(elbowX, elbowY)
      ctx.lineTo(endX, elbowY)
      ctx.stroke()

      ctx.fillStyle = textColor
      ctx.textAlign = side === 1 ? 'left' : 'right'
      ctx.fillText(truncate(chart.data.labels[index]), endX + side * 4, elbowY)
    })

    ctx.restore()
  }
}

watch(
  () => [props.items, props.showIdeal, visibilityStore.valuesHidden],
  async () => {
    await nextTick()
    renderCharts()
  },
  { deep: true, immediate: true }
)

onBeforeUnmount(destroyCharts)

function summarize(list) {
  return list
    .map(item => `${item.label} ${formatPlainPercent(item.percent)}`)
    .join(', ')
}

function truncate(label) {
  return label.length > MAX_LABEL_LENGTH
    ? `${label.slice(0, MAX_LABEL_LENGTH - 1)}…`
    : label
}

function colorFor(item, index) {
  return (
    item.color || getCssVar(`--chart-palette-${(index % PALETTE_SIZE) + 1}`)
  )
}

function destroyCharts() {
  charts.splice(0).forEach(chart => chart.destroy())
}

function buildChart(canvas, list, valueOf) {
  const hidden = visibilityStore.valuesHidden

  const chart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: list.map(item => item.label),
      datasets: [
        {
          data: list.map(valueOf),
          backgroundColor: list.map(item =>
            colorFor(item, props.items.indexOf(item))
          ),
          borderWidth: 0
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      cutout: '62%',
      layout: { padding: { left: 90, right: 90, top: 16, bottom: 16 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: getCssVar('--bg-elevated'),
          borderColor: getCssVar('--border-default'),
          borderWidth: 1,
          titleColor: getCssVar('--text-primary'),
          bodyColor: getCssVar('--text-secondary'),
          callbacks: {
            title: () => '',
            label: context => {
              const item = list[context.dataIndex]
              const value = formatCurrency(item.value, hidden)
              return `${item.label}: ${formatPlainPercent(item.percent)} · ${value}`
            }
          }
        }
      }
    },
    plugins: [externalLabelsPlugin]
  })

  chart.$percents = list.map(item => Number(item.percent))
  charts.push(chart)
}

function renderCharts() {
  destroyCharts()

  if (chartCanvas.value && props.items.length > 0) {
    buildChart(chartCanvas.value, props.items, item => item.value)
  }

  if (props.showIdeal && idealCanvas.value && idealItems.value.length > 0) {
    buildChart(idealCanvas.value, idealItems.value, item => item.percent)
  }
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
