<template>
  <div class="dashboard-charts">
    <DashboardCard title="Distribuição por Categoria">
      <template #icon>
        <SvgIcon name="pie-chart" />
      </template>
      <div
        v-if="hasData"
        class="dashboard-charts__canvas-wrapper"
      >
        <canvas ref="chartCanvas" />
      </div>
      <EmptyState
        v-else
        title="Nenhum valor investido"
        description="Adicione transações para visualizar a distribuição do seu patrimônio"
      >
        <template #action>
          <RouterLink
            to="/portfolio"
            class="dashboard-charts__cta"
          >
            Nova Transação
          </RouterLink>
        </template>
      </EmptyState>
    </DashboardCard>

    <DashboardCard title="Categorias Principais">
      <template #icon>
        <SvgIcon name="trending-up" />
      </template>
      <div
        v-if="topCategories.length > 0"
        class="dashboard-charts__categories"
      >
        <CategoryListItem
          v-for="category in topCategories"
          :key="category.name"
          :name="category.name"
          :count="category.count"
          :value="category.formattedValue"
          :percentage="category.percentage"
          :color="category.color"
        />
      </div>
      <EmptyState
        v-else
        title="Sem dados"
        description="Nenhuma categoria disponível no momento"
      />
    </DashboardCard>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import DashboardCard from '@/components/atoms/DashboardCard/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import CategoryListItem from '@/components/atoms/CategoryListItem/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import { useVisibilityStore } from '@/stores/visibility'
import { formatCurrency } from '@/utils/formatCurrency'

Chart.register(...registerables)

const visibilityStore = useVisibilityStore()

const props = defineProps({
  assetsByType: {
    type: Object,
    default: () => ({})
  },
  categoryColors: {
    type: Object,
    default: () => ({})
  },
  categoryValues: {
    type: Object,
    default: () => ({})
  },
  totalCategoryValue: {
    type: Number,
    default: 0
  }
})

const chartCanvas = ref(null)
let chartInstance = null

function resolveColor(name) {
  return (
    props.categoryColors[name] ||
    props.categoryColors[name?.toUpperCase()] ||
    undefined
  )
}

const hasData = computed(
  () =>
    props.totalCategoryValue > 0 && Object.keys(props.categoryValues).length > 0
)

const topCategories = computed(() => {
  const names = new Set([
    ...Object.keys(props.assetsByType),
    ...Object.keys(props.categoryValues)
  ])

  return Array.from(names)
    .map(name => {
      const value = props.categoryValues[name] || 0
      return {
        name,
        count: props.assetsByType[name] || 0,
        value,
        formattedValue: formatCurrency(value, visibilityStore.valuesHidden),
        percentage:
          props.totalCategoryValue > 0
            ? ((value / props.totalCategoryValue) * 100).toFixed(1)
            : '0.0',
        color: resolveColor(name)
      }
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
})

function buildChart() {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  if (!chartCanvas.value || Object.keys(props.categoryValues).length === 0)
    return

  const labels = Object.keys(props.categoryValues)
  const data = Object.values(props.categoryValues)
  const colors = labels.map(label => resolveColor(label))
  const cardBg = getComputedStyle(chartCanvas.value)
    .getPropertyValue('--bg-elevated')
    .trim()

  chartInstance = new Chart(chartCanvas.value.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        { data, backgroundColor: colors, borderWidth: 2, borderColor: cardBg }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 15, font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
              const pct =
                total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0.0'
              return `${ctx.label}: ${formatCurrency(ctx.parsed, visibilityStore.valuesHidden)} (${pct}%)`
            }
          }
        }
      }
    }
  })
}

// flush: 'post' garante que o DOM (canvas) já está atualizado antes do buildChart
watch(() => props.categoryValues, buildChart, { deep: true, flush: 'post' })

onMounted(buildChart)
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
