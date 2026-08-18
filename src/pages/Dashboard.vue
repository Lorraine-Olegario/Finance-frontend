<template>
  <MainLayout page-title="Dashboard">
    <div class="dashboard-page">
      <DashboardWelcome
        :user-name="authStore.user?.name || 'Usuário'"
        :date="currentDate"
      >
        <template #actions>
          <RouterLink
            to="/portfolio"
            class="dashboard-page__cta"
          >
            <SvgIcon
              name="plus"
              :size="14"
            />
            Nova Transação
          </RouterLink>
        </template>
      </DashboardWelcome>

      <StatsGrid
        :cols="3"
        style="margin-bottom: 1.5rem"
      >
        <StatCard
          label="Patrimônio Total"
          :value="
            formatCurrency(
              portfolioTotals.totalCurrentValue,
              visibilityStore.valuesHidden
            )
          "
          variant="primary"
          :subtitle="patrimonioSubtitle"
        >
          <template #icon>
            <SvgIcon name="dollar" />
          </template>
          <template #sparkline>
            <Sparkline :positive="portfolioTotals.profitLoss >= 0" />
          </template>
        </StatCard>

        <StatCard
          label="Lucro Total"
          :value="
            formatCurrency(
              portfolioTotals.profitLoss,
              visibilityStore.valuesHidden
            )
          "
          :variant="portfolioProfitVariant"
          :subtitle="formatPercent(portfolioTotals.profitLossPercent)"
          :is-positive="portfolioTotals.profitLoss >= 0"
        >
          <template #icon>
            <SvgIcon
              :name="
                portfolioTotals.profitLoss >= 0
                  ? 'trending-up'
                  : 'trending-down'
              "
            />
          </template>
        </StatCard>

        <StatCard
          label="Proventos Recebidos"
          value="—"
          variant="info"
          subtitle="Em breve"
        >
          <template #icon>
            <SvgIcon name="activity" />
          </template>
        </StatCard>
      </StatsGrid>

      <DashboardCharts
        :assets-by-type="assetsByType"
        :category-colors="categoryColors"
        :category-values="categoryValues"
        :total-category-value="portfolioTotals.totalCurrentValue"
      />

      <DashboardMovers
        :gainers="movers.gainers"
        :losers="movers.losers"
      />

      <LoadingSpinner
        v-if="loading"
        fullscreen
      />
    </div>
  </MainLayout>
</template>

<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import MainLayout from '@/components/templates/MainLayout.vue'
import StatCard from '@/components/atoms/StatCard/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import Sparkline from '@/components/atoms/Sparkline/index.vue'
import StatsGrid from '@/components/molecules/StatsGrid/index.vue'
import DashboardWelcome from '@/components/organisms/dashboard/DashboardWelcome/index.vue'
import DashboardCharts from '@/components/organisms/dashboard/DashboardCharts/index.vue'
import DashboardMovers from '@/components/organisms/dashboard/DashboardMovers/index.vue'
import { useAuthStore } from '@/stores/auth'
import { useVisibilityStore } from '@/stores/visibility'
import assetService from '@/services/assetService'
import portfolioService from '@/services/portfolioService'
import { useAssetCategoryMap } from '@/hooks/useAssetCategoryMap'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatPercent } from '@/utils/formatPercent'

// ── State ─────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const visibilityStore = useVisibilityStore()
const { assetCategoryMap, fetchAssetCategoryMap, resolveStatus } =
  useAssetCategoryMap()

const loading = ref(true)
const categoryColors = ref({})
const positions = ref([])
const portfolioSummary = ref({
  total_invested: 0,
  total_current_value: 0,
  profit_loss: 0,
  profit_loss_percent: null,
  assets_count: 0
})

const currentDate = computed(() =>
  new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

// Posições com ativo pausado ("inativo" no catálogo — é o que Assets.vue
// chama de "pausar") ficam de fora de todos os cálculos do dashboard.
// `positions[]` (retornado dentro de portfolio/summary) não traz status —
// status só existe no catálogo de ativos do usuário, por isso cruzamos
// pelo código via `useAssetCategoryMap`/`resolveStatus`. Ativos
// "observando" não são afetados por este filtro. Isso é um workaround de
// frontend; o ideal seria a API de carteira já excluir pausados, mas isso
// está fora deste repositório.
const filteredPositions = computed(() =>
  positions.value.filter(p => resolveStatus(p.code) !== 'inativo')
)

// Patrimônio/Lucro recalculados a partir das posições filtradas — nunca
// usar total_current_value/profit_loss agregados de portfolioSummary
// diretamente, pois o backend pode incluir posições pausadas nesse total.
const portfolioTotals = computed(() => {
  const totalInvested = filteredPositions.value.reduce(
    (sum, p) => sum + (p.average_price || 0) * (p.quantity || 0),
    0
  )
  const totalCurrentValue = filteredPositions.value.reduce(
    (sum, p) => sum + (p.current_value || 0),
    0
  )
  const profitLoss = totalCurrentValue - totalInvested
  const profitLossPercent =
    totalInvested > 0 ? (profitLoss / totalInvested) * 100 : null

  return { totalInvested, totalCurrentValue, profitLoss, profitLossPercent }
})

const portfolioProfitVariant = computed(() =>
  portfolioTotals.value.profitLoss >= 0 ? 'success' : 'danger'
)
const patrimonioSubtitle = computed(
  () =>
    `Investido: ${formatCurrency(portfolioTotals.value.totalInvested, visibilityStore.valuesHidden)} · ${formatPercent(portfolioTotals.value.profitLossPercent)}`
)

// Contagem e valor por categoria calculados a partir das posições
// filtradas da carteira do usuário — nunca do catálogo geral de ativos do
// sistema, nem de posições pausadas.
const categoryBreakdown = computed(() => {
  const breakdown = {}
  for (const position of filteredPositions.value) {
    const category = assetCategoryMap.value[position.code]?.nome
    if (!category) continue
    if (!breakdown[category]) breakdown[category] = { count: 0, value: 0 }
    breakdown[category].count += 1
    breakdown[category].value += position.current_value || 0
  }
  return breakdown
})

const assetsByType = computed(() =>
  Object.fromEntries(
    Object.entries(categoryBreakdown.value).map(([name, { count }]) => [
      name,
      count
    ])
  )
)

const categoryValues = computed(() =>
  Object.fromEntries(
    Object.entries(categoryBreakdown.value).map(([name, { value }]) => [
      name,
      value
    ])
  )
)

// Maiores variações (rentabilidade (atual-pm)/pm) entre as posições
// filtradas — top 4 altas e top 4 baixas, ambas com rentabilidade
// calculável.
const movers = computed(() => {
  const withPercent = filteredPositions.value
    .map(p => ({
      code: p.code,
      name: p.name || '',
      percent:
        p.profit_loss_percent === null || p.profit_loss_percent === undefined
          ? null
          : Number(p.profit_loss_percent)
    }))
    .filter(p => p.percent !== null && !Number.isNaN(p.percent))
    .sort((a, b) => a.percent - b.percent)

  const losers = withPercent.filter(p => p.percent < 0).slice(0, 4)
  const gainers = withPercent
    .filter(p => p.percent >= 0)
    .slice(-4)
    .reverse()

  return { gainers, losers }
})

onMounted(loadDashboard)

/** Busca cores personalizadas de categoria (contagem e valor vêm da carteira) */
async function fetchAssetsSummary() {
  const res = await assetService.getUserAssetsSummary()

  const categorias = res.data?.categorias
  if (Array.isArray(categorias)) {
    categoryColors.value = Object.fromEntries(
      categorias.map(item => [item.categoria, item.color])
    )
  }
}

/** Busca resumo de patrimônio e posições da carteira */
async function fetchPortfolioSummary() {
  try {
    const res = await portfolioService.getSummary()
    portfolioSummary.value = {
      total_invested: res.data?.total_invested ?? 0,
      total_current_value: res.data?.total_current_value ?? 0,
      profit_loss: res.data?.profit_loss ?? 0,
      profit_loss_percent: res.data?.profit_loss_percent ?? null,
      assets_count: res.data?.assets_count ?? 0
    }
    positions.value = Array.isArray(res.data?.positions)
      ? res.data.positions
      : []
  } catch {
    // erro opcional — não bloqueia o dashboard
  }
}

/** Orquestra todas as chamadas do dashboard */
async function loadDashboard() {
  if (!authStore.user?.id) {
    console.warn('[Dashboard] Usuário não identificado')
    loading.value = false
    return
  }

  loading.value = true
  try {
    await Promise.all([
      fetchAssetsSummary(),
      fetchPortfolioSummary(),
      fetchAssetCategoryMap()
    ])
  } catch (err) {
    console.error('[Dashboard] Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-page__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  background: var(--primary);
  color: var(--primary-contrast);
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s;
}

.dashboard-page__cta:hover {
  background: var(--primary-hover);
  color: var(--primary-contrast);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px var(--primary-muted);
}
</style>
