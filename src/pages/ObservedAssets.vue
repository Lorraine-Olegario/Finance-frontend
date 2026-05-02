<template>
  <MainLayout page-title="Ativos Observados">
    <div class="observed-assets-page">
      <PageHeader
        title="Ativos Observados"
        subtitle="Gerencie os alertas dos seus ativos observados"
      >
        <template #actions>
          <button
            type="button"
            class="observed-assets-page__filter-btn"
            @click="filterOpen = true"
          >
            <SvgIcon
              name="filter"
              :size="18"
            />
            Filtros
            <span
              v-if="activeFiltersCount > 0"
              class="observed-assets-page__filter-badge"
            >
              {{ activeFiltersCount }}
            </span>
          </button>
        </template>
      </PageHeader>

      <StatsGrid
        v-if="!loading && filteredAssets.length > 0"
        style="margin-bottom: 2rem"
      >
        <StatCard
          label="Total Observados"
          :value="mergedAssets.length"
          variant="primary"
        >
          <template #icon>
            <SvgIcon name="eye" />
          </template>
        </StatCard>

        <StatCard
          label="Com Alertas"
          :value="assetsWithAlerts"
          variant="success"
        >
          <template #icon>
            <SvgIcon name="bell" />
          </template>
        </StatCard>

        <StatCard
          label="Sem Alertas"
          :value="assetsWithoutAlerts"
          variant="warning"
        >
          <template #icon>
            <SvgIcon name="alert-triangle" />
          </template>
        </StatCard>
      </StatsGrid>

      <ObservedAssetsFilterDrawer
        :is-open="filterOpen"
        :filters="filters"
        :categories="categories"
        @close="filterOpen = false"
        @apply="applyFilters"
      />

      <LoadingSpinner
        v-if="loading"
        message="Carregando ativos observados..."
      />

      <AlertMessage
        v-else-if="error"
        type="error"
        :message="error"
        class="observed-assets-page__error"
      />

      <EmptyState
        v-else-if="filteredAssets.length === 0"
        title="Nenhum ativo observado"
        :description="
          activeFiltersCount > 0
            ? 'Ajuste os filtros de busca ou adicione novos ativos'
            : 'Adicione ativos à sua carteira e marque como observando para acompanhar alertas'
        "
      >
        <template #icon>
          <SvgIcon
            name="eye"
            :size="64"
          />
        </template>
        <template #action>
          <RouterLink
            to="/my-assets"
            class="observed-assets-page__empty-link"
          >
            <SvgIcon
              name="plus"
              :size="18"
            />
            Ir para Meus Ativos
          </RouterLink>
        </template>
      </EmptyState>

      <template v-else>
        <div class="observed-assets-page__table-wrapper">
          <table class="observed-assets-page__table">
            <thead class="observed-assets-page__thead">
              <tr>
                <th class="observed-assets-page__th">Código</th>
                <th class="observed-assets-page__th">Nome</th>
                <th class="observed-assets-page__th">Categoria</th>
                <th
                  class="observed-assets-page__th observed-assets-page__th--center"
                >
                  Preço Atual
                </th>
                <th
                  class="observed-assets-page__th observed-assets-page__th--center"
                >
                  Alerta Min
                </th>
                <th
                  class="observed-assets-page__th observed-assets-page__th--center"
                >
                  Alerta Max
                </th>
                <th
                  class="observed-assets-page__th observed-assets-page__th--center"
                >
                  Status
                </th>
                <th
                  class="observed-assets-page__th observed-assets-page__th--center"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="asset in paginatedAssets"
                :key="asset.id"
                class="observed-assets-page__row"
              >
                <td class="observed-assets-page__td">
                  <strong class="observed-assets-page__code">
                    {{ asset.codigo }}
                  </strong>
                </td>
                <td class="observed-assets-page__td">
                  <span class="observed-assets-page__name">
                    {{ asset.nome || 'N/A' }}
                  </span>
                </td>
                <td class="observed-assets-page__td">
                  <Badge :label="asset.categoria || 'N/A'" />
                </td>
                <td
                  class="observed-assets-page__td observed-assets-page__td--center"
                >
                  <span
                    v-if="prices[asset.codigo] != null"
                    class="observed-assets-page__price"
                  >
                    R$ {{ formatPrice(prices[asset.codigo]) }}
                  </span>
                  <span
                    v-else
                    class="observed-assets-page__muted"
                  >
                    —
                  </span>
                </td>
                <td
                  class="observed-assets-page__td observed-assets-page__td--center"
                >
                  <span
                    v-if="asset.alert?.valor_min"
                    class="observed-assets-page__price"
                  >
                    R$ {{ formatPrice(asset.alert.valor_min) }}
                  </span>
                  <span
                    v-else
                    class="observed-assets-page__muted"
                  >
                    —
                  </span>
                </td>
                <td
                  class="observed-assets-page__td observed-assets-page__td--center"
                >
                  <span
                    v-if="asset.alert?.valor_max"
                    class="observed-assets-page__price"
                  >
                    R$ {{ formatPrice(asset.alert.valor_max) }}
                  </span>
                  <span
                    v-else
                    class="observed-assets-page__muted"
                  >
                    —
                  </span>
                </td>
                <td
                  class="observed-assets-page__td observed-assets-page__td--center"
                >
                  <StatusBadge
                    v-if="asset.alert"
                    :status="asset.alert.status"
                  />
                  <span
                    v-else
                    class="observed-assets-page__muted"
                  >
                    Sem alerta
                  </span>
                </td>
                <td
                  class="observed-assets-page__td observed-assets-page__td--center"
                >
                  <div class="observed-assets-page__actions">
                    <ActionButton
                      variant="edit"
                      :title="
                        asset.alert ? 'Editar alerta' : 'Configurar alerta'
                      "
                      @click="openEditModal(asset)"
                    >
                      <SvgIcon name="bell" />
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      title="Parar de observar"
                      @click="openStopObservingModal(asset)"
                    >
                      <SvgIcon name="eye-off" />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :last-page="totalPages"
          :total="filteredAssets.length"
          :per-page="itemsPerPage"
          :show-page-info="true"
          class="observed-assets-page__pagination"
          @page-change="handlePageChange"
        />
      </template>

      <EditAlertModal
        :is-open="showEditModal"
        :asset="selectedAsset"
        @close="closeEditModal"
        @save="handleSaveAlert"
      />

      <ConfirmationModal
        :is-open="showStopObservingModal"
        type="warning"
        :title="
          selectedAsset
            ? `Parar de observar ${selectedAsset.codigo}`
            : 'Parar de observar ativo'
        "
        message="Tem certeza que deseja parar de observar este ativo?"
        warning-message="Esta ação irá desativar todos os alertas configurados para este ativo."
        confirm-text="Parar de observar"
        loading-text="Processando..."
        @close="closeStopObservingModal"
        @confirm="handleStopObservingConfirm"
      />
    </div>
  </MainLayout>
</template>

<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import MainLayout from '@/components/templates/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader/index.vue'
import StatsGrid from '@/components/molecules/StatsGrid/index.vue'
import StatCard from '@/components/atoms/StatCard/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import Badge from '@/components/atoms/Badge/index.vue'
import StatusBadge from '@/components/atoms/StatusBadge/index.vue'
import ActionButton from '@/components/atoms/ActionButton/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import Pagination from '@/components/atoms/Pagination/index.vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import ObservedAssetsFilterDrawer from '@/components/organisms/observed/ObservedAssetsFilterDrawer/index.vue'
import EditAlertModal from '@/components/organisms/observed/EditAlertModal/index.vue'
import assetService from '@/services/assetService'
import categoryService from '@/services/categoryService'
import { useAuthStore } from '@/stores/auth'

// ── State ──────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const observedAssets = ref([])
const alerts = ref([])
const categories = ref([])
const prices = ref({})
const loading = ref(false)
const error = ref('')
const filterOpen = ref(false)
const filters = ref({ search: '', categoria: '', hasAlert: '' })
const showEditModal = ref(false)
const showStopObservingModal = ref(false)
const selectedAsset = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

// ── Computed ───────────────────────────────────────────────────────────────────
const mergedAssets = computed(() => {
  const uniqueMap = new Map()
  observedAssets.value.forEach(asset => {
    if (!uniqueMap.has(asset.id)) uniqueMap.set(asset.id, asset)
  })
  return Array.from(uniqueMap.values()).map(asset => {
    const alert = alerts.value.find(a => a.ativo_id === asset.id)
    return {
      ...asset,
      categoria: asset.tipo || asset.categoria,
      alert: alert ?? null
    }
  })
})

const filteredAssets = computed(() => {
  let result = mergedAssets.value

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(
      a =>
        a.codigo.toLowerCase().includes(q) ||
        (a.nome && a.nome.toLowerCase().includes(q))
    )
  }

  if (filters.value.categoria) {
    result = result.filter(a => a.categoria === filters.value.categoria)
  }

  if (filters.value.hasAlert === 'with') {
    result = result.filter(a => a.alert)
  } else if (filters.value.hasAlert === 'without') {
    result = result.filter(a => !a.alert)
  }

  return result
})

const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredAssets.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() =>
  Math.ceil(filteredAssets.value.length / itemsPerPage)
)

const assetsWithAlerts = computed(
  () => mergedAssets.value.filter(a => a.alert).length
)

const assetsWithoutAlerts = computed(
  () => mergedAssets.value.filter(a => !a.alert).length
)

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.search) count++
  if (filters.value.categoria) count++
  if (filters.value.hasAlert) count++
  return count
})

// ── Watchers ───────────────────────────────────────────────────────────────────
watch(
  filters,
  () => {
    currentPage.value = 1
    fetchAssetPrices()
  },
  { deep: true }
)

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(loadPage)

// ── Functions ──────────────────────────────────────────────────────────────────
async function fetchObservedAssets() {
  const res = await assetService.getObservedAssets()
  const raw = res.data.observados || []
  const map = new Map()
  raw.forEach(asset => {
    if (!map.has(asset.id)) map.set(asset.id, asset)
  })
  observedAssets.value = Array.from(map.values())
}

async function fetchAlerts() {
  const res = await assetService.getAssetAlerts()
  const data = res.data.data
  if (Array.isArray(data)) {
    alerts.value = data
  } else if (data && Array.isArray(data.observados)) {
    alerts.value = data.observados
  } else {
    alerts.value = []
  }
}

async function fetchCategories() {
  try {
    const res = await categoryService.getAll()
    if (res.data && Array.isArray(res.data.data)) {
      categories.value = res.data.data.map(cat => cat.nome || cat.name || String(cat))
    }
  } catch {
    // erro opcional — categorias derivam do fallback vazio
  }
}

async function loadPage() {
  if (!authStore.user?.id) return
  loading.value = true
  error.value = ''
  try {
    await Promise.all([fetchObservedAssets(), fetchAlerts(), fetchCategories()])
    await fetchAssetPrices()
  } catch {
    error.value = 'Erro ao carregar ativos observados. Tente novamente.'
  } finally {
    loading.value = false
  }
}

async function fetchAssetPrices() {
  if (paginatedAssets.value.length === 0) return
  try {
    const codigos = paginatedAssets.value.map(a => a.codigo)
    const res = await assetService.getAssetQuotes(codigos)
    const quotes = res.data || []
    quotes.forEach(quote => {
      if (quote.symbol && quote.price != null) {
        prices.value[quote.symbol] = quote.price
      }
    })
  } catch (err) {
    console.error('[ObservedAssets] Erro ao buscar cotações:', err)
  }
}

function handlePageChange(page) {
  currentPage.value = page
  fetchAssetPrices()
}

function openEditModal(asset) {
  selectedAsset.value = asset
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  selectedAsset.value = null
}

async function handleSaveAlert(alertData) {
  try {
    if (selectedAsset.value?.alert) {
      await assetService.updateAssetAlert(
        selectedAsset.value.alert.id,
        alertData
      )
    } else {
      await assetService.saveAssetAlert(alertData)
    }
    await loadPage()
    closeEditModal()
  } catch {
    alert('Erro ao salvar alerta. Tente novamente.')
  }
}

function openStopObservingModal(asset) {
  selectedAsset.value = asset
  showStopObservingModal.value = true
}

function closeStopObservingModal() {
  showStopObservingModal.value = false
  selectedAsset.value = null
}

async function handleStopObservingConfirm({ resolve, reject }) {
  try {
    await assetService.stopObservingAsset({
      ativo_id: selectedAsset.value.id,
      status: 'ativo'
    })
    observedAssets.value = observedAssets.value.filter(
      a => a.id !== selectedAsset.value.id
    )
    resolve()
  } catch (err) {
    reject(
      new Error(
        err.response?.data?.message ||
          err.message ||
          'Erro ao parar de observar'
      )
    )
  }
}

function applyFilters(newFilters) {
  filters.value = { ...newFilters }
}

function formatPrice(value) {
  if (!value) return '0,00'
  return parseFloat(value).toFixed(2).replace('.', ',')
}
</script>

<style scoped>
.observed-assets-page {
  max-width: 100%;
}

/* ── Filter button ───────────────────────────────────────────────────────────── */
.observed-assets-page__filter-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.2s;
}

.observed-assets-page__filter-btn:hover {
  background: var(--bg-hover);
  border-color: var(--primary);
  color: var(--primary);
}

.observed-assets-page__filter-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid white;
}

/* ── Error / Empty ───────────────────────────────────────────────────────────── */
.observed-assets-page__error {
  margin-bottom: 1.5rem;
}

.observed-assets-page__empty-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.observed-assets-page__empty-link:hover {
  box-shadow: 0 4px 12px rgba(98, 0, 238, 0.35);
  transform: translateY(-1px);
}

/* ── Table ───────────────────────────────────────────────────────────────────── */
.observed-assets-page__table-wrapper {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.observed-assets-page__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.observed-assets-page__thead {
  background: var(--bg-secondary);
}

.observed-assets-page__th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  border-bottom: 2px solid var(--border);
  white-space: nowrap;
}

.observed-assets-page__th--center {
  text-align: center;
}

.observed-assets-page__td {
  padding: 1rem;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.observed-assets-page__td--center {
  text-align: center;
}

.observed-assets-page__row:hover {
  background: var(--bg-hover);
}

.observed-assets-page__row:last-child .observed-assets-page__td {
  border-bottom: none;
}

.observed-assets-page__code {
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.observed-assets-page__name {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.observed-assets-page__price {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.observed-assets-page__muted {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.observed-assets-page__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.observed-assets-page__pagination {
  margin-top: 1rem;
}
</style>
