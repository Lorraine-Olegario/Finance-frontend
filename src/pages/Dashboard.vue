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
          :value="formatCurrency(portfolioSummary.total_current_value)"
          variant="primary"
          :subtitle="patrimonioSubtitle"
        >
          <template #icon>
            <SvgIcon name="dollar" />
          </template>
        </StatCard>

        <StatCard
          label="Lucro Total"
          :value="formatCurrency(portfolioSummary.profit_loss)"
          :variant="portfolioProfitVariant"
          :subtitle="formatPercent(portfolioSummary.profit_loss_percent)"
          :is-positive="portfolioSummary.profit_loss >= 0"
        >
          <template #icon>
            <SvgIcon
              :name="
                portfolioSummary.profit_loss >= 0
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
        :total-category-value="portfolioSummary.total_current_value"
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
import StatsGrid from '@/components/molecules/StatsGrid/index.vue'
import DashboardWelcome from '@/components/organisms/dashboard/DashboardWelcome/index.vue'
import DashboardCharts from '@/components/organisms/dashboard/DashboardCharts/index.vue'
import { useAuthStore } from '@/stores/auth'
import assetService from '@/services/assetService'
import portfolioService from '@/services/portfolioService'
import { useAssetCategoryMap } from '@/hooks/useAssetCategoryMap'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatPercent } from '@/utils/formatPercent'

// ── State ─────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const { assetCategoryMap, fetchAssetCategoryMap } = useAssetCategoryMap()

const loading = ref(true)
const assetsByType = ref({})
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

const portfolioProfitVariant = computed(() =>
  portfolioSummary.value.profit_loss >= 0 ? 'success' : 'danger'
)
const patrimonioSubtitle = computed(
  () =>
    `Investido: ${formatCurrency(portfolioSummary.value.total_invested)} · ${formatPercent(portfolioSummary.value.profit_loss_percent)}`
)

const categoryValues = computed(() => {
  const totals = {}
  for (const position of positions.value) {
    const category = assetCategoryMap.value[position.code]?.nome
    if (!category) continue
    totals[category] = (totals[category] || 0) + (position.current_value || 0)
  }
  return totals
})

onMounted(loadDashboard)

/** Busca resumo de ativos e cores personalizadas de categoria */
async function fetchAssetsSummary() {
  const res = await assetService.getUserAssetsSummary()

  const categorias = res.data?.categorias
  if (Array.isArray(categorias)) {
    assetsByType.value = Object.fromEntries(
      categorias.map(item => [item.categoria, item.quantidade])
    )
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
    positions.value = Array.isArray(res.data?.positions) ? res.data.positions : []
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
}
</style>
