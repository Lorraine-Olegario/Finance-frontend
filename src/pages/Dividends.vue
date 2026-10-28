<template>
  <MainLayout
    page-title="Proventos"
    page-subtitle="Dividendos, JCP e rendimentos da sua carteira"
  >
    <div class="dividends-page">
      <DividendsFilterBar
        v-model:asset-category-id="dividendsStore.assetCategoryId"
        v-model:asset-id="dividendsStore.assetId"
        :categories="dividendsStore.categories"
        :assets="dividendsStore.assets"
        :has-filters="dividendsStore.hasFilters"
        @clear="dividendsStore.clearFilters"
      />

      <div class="dividends-page__grid">
        <aside class="dividends-page__side">
          <DividendsSummaryCard
            :summary="summary.data.value"
            :loading="summary.loading.value"
            :error="summary.error.value"
            @retry="loadSummary"
          />
          <DividendsDistributionCard
            :items="distribution.data.value?.data || []"
            :loading="distribution.loading.value"
            :error="distribution.error.value"
            @retry="loadDistribution"
            @show-all="modals.distribution = true"
          />
        </aside>

        <DividendsEvolutionCard
          v-model:controls="evolutionControls"
          :points="evolution.data.value?.data || []"
          :loading="evolution.loading.value"
          :error="evolution.error.value"
          @retry="loadEvolution"
          @select-period="openPeriodModal"
        />
      </div>

      <DividendsMonthlyHistoryCard
        v-model:status="historyStatus"
        :rows="history.data.value?.data || []"
        :loading="history.loading.value"
        :error="history.error.value"
        @retry="loadHistory"
      />

      <DividendsTableCard
        v-model:year="listYear"
        :dividends="list.data.value?.data || []"
        :total="list.data.value?.total || null"
        :sort="listSort"
        :direction="listDirection"
        :loading="list.loading.value"
        :error="list.error.value"
        @retry="loadList"
        @sort="handleSort"
      />
    </div>

    <DividendsDistributionModal
      :is-open="modals.distribution"
      :items="distribution.data.value?.data || []"
      @close="modals.distribution = false"
    />

    <DividendsPeriodModal
      :is-open="modals.period"
      :title="periodTitle"
      :dividends="period.data.value?.data || []"
      :loading="period.loading.value"
      :error="period.error.value"
      @close="modals.period = false"
    />
  </MainLayout>
</template>

<script setup>
// ── Imports ──────────────────────────────────────────────────────────────────
import { reactive, ref, watch, onMounted } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import DividendsFilterBar from '@/components/molecules/DividendsFilterBar/index.vue'
import DividendsSummaryCard from '@/components/organisms/dividends/DividendsSummaryCard/index.vue'
import DividendsDistributionCard from '@/components/organisms/dividends/DividendsDistributionCard/index.vue'
import DividendsDistributionModal from '@/components/organisms/dividends/DividendsDistributionModal/index.vue'
import DividendsEvolutionCard from '@/components/organisms/dividends/DividendsEvolutionCard/index.vue'
import DividendsMonthlyHistoryCard from '@/components/organisms/dividends/DividendsMonthlyHistoryCard/index.vue'
import DividendsTableCard from '@/components/organisms/dividends/DividendsTableCard/index.vue'
import DividendsPeriodModal from '@/components/organisms/dividends/DividendsPeriodModal/index.vue'
import { useAuthStore } from '@/stores/auth'
import { useDividendsStore } from '@/stores/dividends'
import { useAsyncCard } from '@/hooks/useAsyncCard'
import dividendService from '@/services/dividendService'
import { formatEvolutionPeriod } from '@/utils/dividendLabels'

// ── State ────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const dividendsStore = useDividendsStore()

const summary = useAsyncCard()
const distribution = useAsyncCard()
const evolution = useAsyncCard()
const history = useAsyncCard()
const list = useAsyncCard()
const period = useAsyncCard()

const evolutionControls = ref({
  group: 'month',
  period: '12m',
  from: '',
  to: ''
})
const historyStatus = ref('all')
const listYear = ref('')
const listSort = ref('payment_date')
const listDirection = ref('desc')
const periodTitle = ref('')
const modals = reactive({ distribution: false, period: false })

// ── Watchers ─────────────────────────────────────────────────────────────────
watch(() => dividendsStore.params, reloadCards, { deep: true })
watch(evolutionControls, loadEvolution, { deep: true })
watch(historyStatus, loadHistory)
watch(listYear, loadList)

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(loadPage)

// ── Functions ────────────────────────────────────────────────────────────────
async function fetchSummary() {
  const res = await dividendService.getSummary(dividendsStore.params)
  return res.data
}

async function fetchDistribution() {
  const res = await dividendService.getDistribution(dividendsStore.params)
  return res.data
}

async function fetchEvolution() {
  const { group, period: range, from, to } = evolutionControls.value
  const params = { ...dividendsStore.params, group, period: range }

  if (range === 'custom') {
    params.from = from
    params.to = to
  }

  const res = await dividendService.getEvolution(params)
  return res.data
}

async function fetchHistory() {
  const res = await dividendService.getMonthlyHistory({
    ...dividendsStore.params,
    status: historyStatus.value
  })
  return res.data
}

async function fetchList() {
  const res = await dividendService.getDividends({
    ...dividendsStore.params,
    ...(listYear.value ? { year: listYear.value } : {}),
    sort: listSort.value,
    direction: listDirection.value
  })
  return res.data
}

async function fetchSync() {
  // Sincronização em segundo plano: erro tratado em silêncio, não bloqueia a tela.
  try {
    const res = await dividendService.sync()
    return Boolean(res.data?.synced)
  } catch (err) {
    console.error('[Dividends] Erro ao sincronizar proventos:', err)
    return false
  }
}

async function fetchOptions() {
  try {
    await dividendsStore.fetchOptions()
  } catch (err) {
    console.error('[Dividends] Erro ao carregar filtros:', err)
  }
}

function loadSummary() {
  return summary.run(fetchSummary, 'Erro ao carregar o resumo.')
}

function loadDistribution() {
  return distribution.run(fetchDistribution, 'Erro ao carregar a distribuição.')
}

function loadEvolution() {
  const { period: range, from, to } = evolutionControls.value
  if (range === 'custom' && (!from || !to)) return Promise.resolve()
  return evolution.run(fetchEvolution, 'Erro ao carregar a evolução.')
}

function loadHistory() {
  return history.run(fetchHistory, 'Erro ao carregar o histórico.')
}

function loadList() {
  return list.run(fetchList, 'Erro ao carregar os proventos.')
}

async function loadPage() {
  if (!authStore.user?.id) return

  fetchOptions()

  // O sync roda sem bloquear: os cards carregam o que já existe e são
  // recarregados quando ele termina.
  fetchSync().then(synced => {
    if (synced) reloadCards()
  })

  await reloadCards()
}

function reloadCards() {
  return Promise.all([
    loadSummary(),
    loadDistribution(),
    loadEvolution(),
    loadHistory(),
    loadList()
  ])
}

function handleSort(column) {
  if (listSort.value === column) {
    listDirection.value = listDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    listSort.value = column
    listDirection.value = column === 'asset' ? 'asc' : 'desc'
  }
  loadList()
}

async function openPeriodModal(periodKey) {
  const [year, month] = periodKey.split('-')

  periodTitle.value = formatEvolutionPeriod(periodKey)
  modals.period = true

  await period.run(async () => {
    const res = await dividendService.getDividends({
      ...dividendsStore.params,
      year,
      ...(month ? { month: Number(month) } : {}),
      sort: 'payment_date',
      direction: 'asc'
    })
    return res.data
  }, 'Erro ao carregar os proventos do período.')
}
</script>

<style scoped>
.dividends-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dividends-page__grid {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.dividends-page__side {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 992px) {
  .dividends-page__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
