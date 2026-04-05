<template>
  <div class="dashboard-charts">
    <DashboardCard title="Distribuição por Categoria">
      <template #icon>
        <!-- prettier-ignore -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /> <path d="M22 12A10 10 0 0 0 12 2v10z" /> </svg>
      </template>
      <div
        v-if="userAssetsCount > 0"
        class="dashboard-charts__canvas-wrapper"
      >
        <canvas ref="chartCanvas" />
      </div>
      <EmptyState
        v-else
        title="Nenhum ativo observado"
        description="Adicione ativos para visualizar a distribuição por categoria"
      >
        <template #action>
          <RouterLink
            to="/my-assets"
            class="btn btn-primary btn-sm"
          >
            Adicionar Ativos
          </RouterLink>
        </template>
      </EmptyState>
    </DashboardCard>

    <DashboardCard title="Categorias Principais">
      <template #icon>
        <!-- prettier-ignore -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /> <polyline points="17 6 23 6 23 12" /> </svg>
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
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import DashboardCard from '@/components/atoms/DashboardCard.vue'
import EmptyState from '@/components/atoms/EmptyState.vue'
import CategoryListItem from '@/components/atoms/CategoryListItem.vue'

Chart.register(...registerables)

const props = defineProps({
  assetsByType: { type: Object, default: () => ({}) },
  userAssetsCount: { type: Number, default: 0 },
  categoryColors: { type: Object, default: () => ({}) }
})

const chartCanvas = ref(null)
let chartInstance = null

const DEFAULT_COLORS = {
  Ações: '#3b82f6',
  Acao: '#3b82f6',
  Acoes: '#3b82f6',
  FIIs: '#10b981',
  FII: '#10b981',
  Criptomoedas: '#ec4899',
  Criptomoeda: '#ec4899',
  Cripto: '#ec4899',
  BDRs: '#8b5cf6',
  BDR: '#8b5cf6',
  Stocks: '#f59e0b',
  Stock: '#f59e0b',
  'Renda Fixa': '#f59e0b',
  ETFs: '#06b6d4',
  ETF: '#06b6d4'
}

function getCategoryColor(name) {
  return props.categoryColors[name] || DEFAULT_COLORS[name] || '#6b7280'
}

const topCategories = computed(() =>
  Object.entries(props.assetsByType)
    .map(([name, count]) => ({
      name,
      count,
      percentage:
        props.userAssetsCount > 0
          ? ((count / props.userAssetsCount) * 100).toFixed(1)
          : '0.0',
      color: getCategoryColor(name)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
)

function buildChart() {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  if (!chartCanvas.value || Object.keys(props.assetsByType).length === 0) return

  const labels = Object.keys(props.assetsByType)
  const data = Object.values(props.assetsByType)
  const colors = labels.map(getCategoryColor)

  chartInstance = new Chart(chartCanvas.value.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }]
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
              const pct = ((ctx.parsed / total) * 100).toFixed(1)
              return `${ctx.label}: ${ctx.parsed} (${pct}%)`
            }
          }
        }
      }
    }
  })
}

watch(
  () => props.assetsByType,
  () => nextTick(buildChart),
  { deep: true }
)

onMounted(() => nextTick(buildChart))
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<style scoped>
.dashboard-charts {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 2rem;
}

.dashboard-charts__canvas-wrapper {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-charts__categories {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (max-width: 1024px) {
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
}
</style>
