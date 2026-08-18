<template>
  <MainLayout page-title="Carteira">
    <div class="portfolio-page">
      <PageHeader
        title="Carteira"
        subtitle="Acompanhe suas posições, transações e patrimônio"
      >
        <template #actions>
          <BaseButton
            variant="primary"
            @click="openAddModal"
          >
            <template #icon-left>
              <SvgIcon
                name="plus"
                :size="16"
              />
            </template>
            Nova Transação
          </BaseButton>
        </template>
      </PageHeader>

      <StatsGrid
        :cols="3"
        style="margin-bottom: 1.5rem"
      >
        <StatCard
          label="Patrimônio Total"
          :value="
            formatCurrency(
              summary.total_current_value,
              visibilityStore.valuesHidden
            )
          "
          variant="primary"
          :subtitle="patrimonioSubtitle"
        >
          <template #icon>
            <SvgIcon name="dollar" />
          </template>
        </StatCard>

        <StatCard
          label="Lucro Total"
          :value="
            formatCurrency(summary.profit_loss, visibilityStore.valuesHidden)
          "
          :variant="profitVariant"
          :subtitle="formatPercent(summary.profit_loss_percent)"
          :is-positive="summary.profit_loss >= 0"
        >
          <template #icon>
            <SvgIcon
              :name="summary.profit_loss >= 0 ? 'trending-up' : 'trending-down'"
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

      <div class="portfolio-page__toolbar">
        <div class="portfolio-page__tabs">
          <button
            type="button"
            class="portfolio-page__tab"
            :class="{
              'portfolio-page__tab--active': activeTab === 'positions'
            }"
            @click="activeTab = 'positions'"
          >
            <SvgIcon
              name="bar-chart"
              :size="16"
            />
            Posições
          </button>
          <button
            type="button"
            class="portfolio-page__tab"
            :class="{ 'portfolio-page__tab--active': activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            <SvgIcon
              name="calendar"
              :size="16"
            />
            Extrato
          </button>
        </div>

        <div class="portfolio-page__filters">
          <BaseSelect
            v-model="categoryFilter"
            class="portfolio-page__category-select"
            :options="categoryOptions"
            placeholder="Todas as categorias"
          />
          <SearchBar
            v-model="search"
            placeholder="Buscar por código..."
          />
        </div>
      </div>

      <LoadingSpinner
        v-if="loading"
        message="Carregando carteira..."
      />

      <AlertMessage
        v-else-if="fetchError"
        type="error"
        :message="fetchError"
        class="portfolio-page__error"
      />

      <template v-else-if="activeTab === 'positions'">
        <EmptyState
          v-if="filteredPositions.length === 0"
          :title="positionsEmptyMessage.title"
          :description="positionsEmptyMessage.description"
        >
          <template #icon>
            <SvgIcon
              name="bar-chart"
              class="portfolio-page__empty-icon"
            />
          </template>
          <template #action>
            <BaseButton
              v-if="hasActiveFilters && positions.length > 0"
              variant="secondary"
              @click="clearFilters"
            >
              <template #icon-left>
                <SvgIcon
                  name="refresh"
                  :size="16"
                />
              </template>
              Limpar filtros
            </BaseButton>
            <BaseButton
              v-else
              variant="primary"
              @click="openAddModal"
            >
              <template #icon-left>
                <SvgIcon
                  name="plus"
                  :size="16"
                />
              </template>
              Registrar Transação
            </BaseButton>
          </template>
        </EmptyState>

        <div
          v-else
          class="portfolio-page__table-wrapper"
        >
          <table class="portfolio-page__table">
            <thead>
              <tr>
                <th class="portfolio-page__th">Código</th>
                <th class="portfolio-page__th">Nome</th>
                <th class="portfolio-page__th">Categoria</th>
                <th class="portfolio-page__th portfolio-page__th--right">
                  Qtd.
                </th>
                <th class="portfolio-page__th portfolio-page__th--right">
                  Preço Médio
                </th>
                <th class="portfolio-page__th portfolio-page__th--right">
                  Preço Atual
                </th>
                <th class="portfolio-page__th portfolio-page__th--right">
                  Valor Total
                </th>
                <th class="portfolio-page__th portfolio-page__th--right">
                  Variação
                </th>
                <th class="portfolio-page__th portfolio-page__th--right">
                  Rentabilidade
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="position in paginatedPositions"
                :key="position.asset_id"
                class="portfolio-page__row"
              >
                <td class="portfolio-page__td portfolio-page__td--code">
                  {{ position.code }}
                </td>
                <td class="portfolio-page__td portfolio-page__td--muted">
                  {{ position.name || '-' }}
                </td>
                <td class="portfolio-page__td">
                  <Badge
                    v-if="resolveCategory(position.code).nome"
                    :label="resolveCategory(position.code).nome"
                    :color="resolveCategory(position.code).color"
                  />
                  <span v-else>-</span>
                </td>
                <td class="portfolio-page__td portfolio-page__td--right num">
                  {{ formatQuantity(position.quantity) }}
                </td>
                <td class="portfolio-page__td portfolio-page__td--right money">
                  {{
                    formatCurrency(
                      position.average_price,
                      visibilityStore.valuesHidden
                    )
                  }}
                </td>
                <td class="portfolio-page__td portfolio-page__td--right money">
                  {{
                    position.current_price != null
                      ? formatCurrency(
                          position.current_price,
                          visibilityStore.valuesHidden
                        )
                      : '—'
                  }}
                </td>
                <td class="portfolio-page__td portfolio-page__td--right money">
                  {{
                    formatCurrency(
                      position.current_value,
                      visibilityStore.valuesHidden
                    )
                  }}
                </td>
                <td class="portfolio-page__td portfolio-page__td--right">
                  <span
                    v-if="hasValue(position.daily_variation_percent)"
                    class="pill"
                    :class="trendPillClass(position.daily_variation_percent)"
                  >
                    <SvgIcon
                      :name="trendIcon(position.daily_variation_percent)"
                      :size="10"
                    />
                    {{ formatPercent(position.daily_variation_percent) }}
                  </span>
                  <span v-else>—</span>
                </td>
                <td class="portfolio-page__td portfolio-page__td--right">
                  <span
                    v-if="hasValue(position.profit_loss_percent)"
                    class="pill"
                    :class="trendPillClass(position.profit_loss_percent)"
                  >
                    <SvgIcon
                      :name="trendIcon(position.profit_loss_percent)"
                      :size="10"
                    />
                    {{ formatPercent(position.profit_loss_percent) }}
                  </span>
                  <span v-else>—</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="portfolio-page__pagination">
            <Pagination
              :current-page="positionsPage"
              :last-page="positionsTotalPages"
              :total="filteredPositions.length"
              :per-page="perPage"
              :show-total="true"
              :show-page-info="false"
              @page-change="p => (positionsPage = p)"
            >
              <template #totalLabel="{ total }">
                Total de posições:
                <strong>{{ total }}</strong>
              </template>
            </Pagination>
          </div>
        </div>
      </template>

      <template v-else>
        <EmptyState
          v-if="filteredTransactions.length === 0"
          :title="transactionsEmptyMessage.title"
          :description="transactionsEmptyMessage.description"
        >
          <template #icon>
            <SvgIcon
              name="calendar"
              class="portfolio-page__empty-icon"
            />
          </template>
          <template #action>
            <BaseButton
              v-if="hasActiveFilters && transactions.length > 0"
              variant="secondary"
              @click="clearFilters"
            >
              <template #icon-left>
                <SvgIcon
                  name="refresh"
                  :size="16"
                />
              </template>
              Limpar filtros
            </BaseButton>
            <BaseButton
              v-else
              variant="primary"
              @click="openAddModal"
            >
              <template #icon-left>
                <SvgIcon
                  name="plus"
                  :size="16"
                />
              </template>
              Registrar Transação
            </BaseButton>
          </template>
        </EmptyState>

        <div
          v-else
          class="portfolio-page__table-wrapper"
        >
          <table class="portfolio-page__table">
            <thead>
              <tr>
                <th class="portfolio-page__th">Data</th>
                <th class="portfolio-page__th">Código</th>
                <th class="portfolio-page__th">Tipo</th>
                <th class="portfolio-page__th portfolio-page__th--right">
                  Qtd.
                </th>
                <th class="portfolio-page__th portfolio-page__th--right">
                  Preço Unit.
                </th>
                <th class="portfolio-page__th portfolio-page__th--right">
                  Valor Total
                </th>
                <th class="portfolio-page__th portfolio-page__th--actions">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in paginatedTransactions"
                :key="transaction.id"
                class="portfolio-page__row"
              >
                <td class="portfolio-page__td portfolio-page__td--muted num">
                  {{ formatDate(transaction.transaction_date) }}
                </td>
                <td class="portfolio-page__td portfolio-page__td--code">
                  {{ transaction.asset_code }}
                </td>
                <td class="portfolio-page__td">
                  <Badge
                    :label="transaction.type === 'buy' ? 'Compra' : 'Venda'"
                    :color="
                      transaction.type === 'buy'
                        ? 'var(--status-success)'
                        : 'var(--status-danger)'
                    "
                  />
                </td>
                <td class="portfolio-page__td portfolio-page__td--right num">
                  {{ formatQuantity(transaction.quantity) }}
                </td>
                <td class="portfolio-page__td portfolio-page__td--right money">
                  {{
                    formatCurrency(
                      transaction.unit_price,
                      visibilityStore.valuesHidden
                    )
                  }}
                </td>
                <td class="portfolio-page__td portfolio-page__td--right money">
                  {{
                    formatCurrency(
                      transaction.total_value,
                      visibilityStore.valuesHidden
                    )
                  }}
                </td>
                <td class="portfolio-page__td">
                  <TableActions>
                    <ActionButton
                      variant="edit"
                      title="Editar transação"
                      @click="openEditModal(transaction)"
                    >
                      <SvgIcon
                        name="edit"
                        :size="16"
                      />
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      title="Excluir transação"
                      @click="openDeleteModal(transaction)"
                    >
                      <SvgIcon
                        name="trash"
                        :size="16"
                      />
                    </ActionButton>
                  </TableActions>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="portfolio-page__pagination">
            <Pagination
              :current-page="transactionsPage"
              :last-page="transactionsTotalPages"
              :total="filteredTransactions.length"
              :per-page="perPage"
              :show-total="true"
              :show-page-info="false"
              @page-change="p => (transactionsPage = p)"
            >
              <template #totalLabel="{ total }">
                Total de transações:
                <strong>{{ total }}</strong>
              </template>
            </Pagination>
          </div>
        </div>
      </template>

      <!-- Modals -->
      <AddTransactionModal
        :is-open="modals.add"
        :transaction="editingTransaction"
        :positions="positions"
        @close="closeModal('add')"
        @submit="handleSubmitTransaction"
      />

      <ConfirmationModal
        :is-open="modals.delete"
        type="danger"
        title="Excluir Transação"
        :message="`Deseja realmente excluir esta transação de ${selectedTransaction?.asset_code || ''}?`"
        warning-message="A posição será recalculada a partir do histórico restante. Esta ação não pode ser desfeita."
        confirm-text="Excluir"
        loading-text="Excluindo..."
        @close="closeModal('delete')"
        @confirm="handleDeleteTransaction"
      />
    </div>
  </MainLayout>
</template>

<script setup>
// ── Imports ──────────────────────────────────────────────────────────────────
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader/index.vue'
import StatsGrid from '@/components/molecules/StatsGrid/index.vue'
import SearchBar from '@/components/molecules/SearchBar/index.vue'
import TableActions from '@/components/molecules/TableActions/index.vue'
import AddTransactionModal from '@/components/organisms/portfolio/AddTransactionModal/index.vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import StatCard from '@/components/atoms/StatCard/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import ActionButton from '@/components/atoms/ActionButton/index.vue'
import Badge from '@/components/atoms/Badge/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import Pagination from '@/components/atoms/Pagination/index.vue'
import { useAuthStore } from '@/stores/auth'
import { useVisibilityStore } from '@/stores/visibility'
import { useToastStore } from '@/stores/toast'
import portfolioService from '@/services/portfolioService'
import categoryService from '@/services/categoryService'
import { useAssetCategoryMap } from '@/hooks/useAssetCategoryMap'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatPercent } from '@/utils/formatPercent'

// ── State ────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const visibilityStore = useVisibilityStore()
const toastStore = useToastStore()

const summary = ref({
  total_invested: 0,
  total_current_value: 0,
  profit_loss: 0,
  profit_loss_percent: null,
  assets_count: 0
})
const positions = ref([])
const transactions = ref([])
const categories = ref([])
const { assetCategoryMap, fetchAssetCategoryMap, resolveCategory } =
  useAssetCategoryMap()

const loading = ref(false)
const fetchError = ref('')
const activeTab = ref('positions')
const search = ref('')
const debouncedSearch = ref('')
const categoryFilter = ref('')
const SEARCH_DEBOUNCE_MS = 300
let searchDebounceTimer = null

const positionsPage = ref(1)
const transactionsPage = ref(1)
const perPage = 10

const selectedTransaction = ref(null)
const editingTransaction = ref(null)
const modals = ref({ add: false, delete: false })

// ── Computed ─────────────────────────────────────────────────────────────────
const profitVariant = computed(() =>
  summary.value.profit_loss >= 0 ? 'success' : 'danger'
)

const patrimonioSubtitle = computed(
  () =>
    `Investido: ${formatCurrency(summary.value.total_invested, visibilityStore.valuesHidden)} · ${formatPercent(summary.value.profit_loss_percent)}`
)

const categoryOptions = computed(() =>
  categories.value.map(cat => ({ value: cat.name, label: cat.name }))
)

const hasActiveFilters = computed(
  () => !!debouncedSearch.value || !!categoryFilter.value
)

const positionsEmptyMessage = computed(() => {
  if (hasActiveFilters.value && positions.value.length > 0) {
    return {
      title: 'Nenhum resultado encontrado',
      description: 'Tente ajustar a busca ou a categoria selecionada.'
    }
  }
  return {
    title: 'Nenhuma posição encontrada',
    description:
      'Registre uma transação de compra para começar a montar sua carteira'
  }
})

const transactionsEmptyMessage = computed(() => {
  if (hasActiveFilters.value && transactions.value.length > 0) {
    return {
      title: 'Nenhum resultado encontrado',
      description: 'Tente ajustar a busca ou a categoria selecionada.'
    }
  }
  return {
    title: 'Nenhuma transação encontrada',
    description: 'Registre uma compra ou venda para ver o extrato aqui'
  }
})

const filteredPositions = computed(() => {
  let result = positions.value

  if (debouncedSearch.value) {
    const q = debouncedSearch.value.toLowerCase()
    result = result.filter(
      p =>
        p.code.toLowerCase().includes(q) ||
        (p.name && p.name.toLowerCase().includes(q))
    )
  }

  if (categoryFilter.value) {
    result = result.filter(
      p => resolveCategory(p.code).nome === categoryFilter.value
    )
  }

  return result
})

const sortedTransactions = computed(() =>
  [...transactions.value].sort((a, b) => {
    if (a.transaction_date !== b.transaction_date) {
      return b.transaction_date.localeCompare(a.transaction_date)
    }
    return b.id - a.id
  })
)

const filteredTransactions = computed(() => {
  let result = sortedTransactions.value

  if (debouncedSearch.value) {
    const q = debouncedSearch.value.toLowerCase()
    result = result.filter(t => t.asset_code.toLowerCase().includes(q))
  }

  if (categoryFilter.value) {
    result = result.filter(
      t => resolveCategory(t.asset_code).nome === categoryFilter.value
    )
  }

  return result
})

const paginatedPositions = computed(() => {
  const start = (positionsPage.value - 1) * perPage
  return filteredPositions.value.slice(start, start + perPage)
})

const paginatedTransactions = computed(() => {
  const start = (transactionsPage.value - 1) * perPage
  return filteredTransactions.value.slice(start, start + perPage)
})

const positionsTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPositions.value.length / perPage))
)

const transactionsTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTransactions.value.length / perPage))
)

// ── Watchers ─────────────────────────────────────────────────────────────────
// Debounce da busca por código: evita recalcular os computeds filtrados a
// cada tecla digitada, aplicando o termo apenas após uma pausa na digitação.
watch(search, value => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    debouncedSearch.value = value
  }, SEARCH_DEBOUNCE_MS)
})

watch([debouncedSearch, categoryFilter], () => {
  positionsPage.value = 1
  transactionsPage.value = 1
})

watch(activeTab, () => {
  search.value = ''
  debouncedSearch.value = ''
})

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(loadPage)

onBeforeUnmount(() => {
  clearTimeout(searchDebounceTimer)
})

// ── Functions ────────────────────────────────────────────────────────────────
async function fetchSummary() {
  const res = await portfolioService.getSummary()
  summary.value = {
    total_invested: res.data?.total_invested ?? 0,
    total_current_value: res.data?.total_current_value ?? 0,
    profit_loss: res.data?.profit_loss ?? 0,
    profit_loss_percent: res.data?.profit_loss_percent ?? null,
    assets_count: res.data?.assets_count ?? 0
  }
  positions.value = Array.isArray(res.data?.positions) ? res.data.positions : []
}

async function fetchTransactions() {
  try {
    const res = await portfolioService.getTransactions()
    transactions.value = Array.isArray(res.data?.transactions)
      ? res.data.transactions
      : []
  } catch {
    transactions.value = []
  }
}

/** Busca as categorias disponíveis para popular o filtro */
async function fetchCategories() {
  try {
    const res = await categoryService.getAll()
    if (Array.isArray(res.data?.categories)) {
      categories.value = res.data.categories
    }
  } catch {
    categories.value = []
  }
}

async function loadPage() {
  if (!authStore.user?.id) return

  loading.value = true
  fetchError.value = ''
  try {
    await Promise.all([
      fetchSummary(),
      fetchTransactions(),
      fetchCategories(),
      fetchAssetCategoryMap()
    ])
  } catch (err) {
    console.error('[Portfolio] Erro ao carregar carteira:', err)
    fetchError.value =
      err?.response?.data?.message ||
      'Erro ao carregar carteira. Tente novamente.'
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  editingTransaction.value = null
  modals.value.add = true
}

function openEditModal(transaction) {
  editingTransaction.value = transaction
  modals.value.add = true
}

function openDeleteModal(transaction) {
  selectedTransaction.value = transaction
  modals.value.delete = true
}

function closeModal(name) {
  modals.value[name] = false
  selectedTransaction.value = null
  editingTransaction.value = null
}

function clearFilters() {
  search.value = ''
  debouncedSearch.value = ''
  categoryFilter.value = ''
}

function hasValue(value) {
  return value !== null && value !== undefined && !Number.isNaN(Number(value))
}

function trendPillClass(value) {
  return Number(value) >= 0 ? 'pill--up' : 'pill--down'
}

function trendIcon(value) {
  return Number(value) >= 0 ? 'trending-up' : 'trending-down'
}

function formatQuantity(value) {
  return Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 4 })
}

function formatDate(value) {
  if (!value) return '-'
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

async function handleSubmitTransaction(payload, resolve, reject) {
  try {
    // Cria a nova transação antes de excluir a antiga (modo edição) — evita
    // perda de dados caso o registro falhe (ex: 422 de quantidade insuficiente).
    // Nota (FIN-11): o AddTransactionModal já avisa e exige confirmação
    // extra quando a venda excede a posição conhecida no frontend, mas o
    // backend pode ainda assim rejeitar com 422 (regra de negócio dele) —
    // esse erro cai neste catch e é tratado normalmente (fieldErrors/toast).
    await portfolioService.registerTransaction(payload)
    if (editingTransaction.value) {
      await portfolioService.deleteTransaction(editingTransaction.value.id)
    }
    await Promise.all([fetchSummary(), fetchTransactions()])
    toastStore.success(
      editingTransaction.value
        ? 'Transação atualizada com sucesso!'
        : 'Transação registrada com sucesso!'
    )
    resolve()
  } catch (err) {
    console.error('[Portfolio] Erro ao salvar transação:', err)
    const data = err.response?.data
    const fieldErrors = data?.errors
      ? Object.fromEntries(
          Object.entries(data.errors).map(([field, msgs]) => [field, msgs[0]])
        )
      : null
    const message = data?.message || 'Erro ao salvar transação.'
    toastStore.error(message)
    const wrapped = new Error(message)
    wrapped.fieldErrors = fieldErrors
    reject(wrapped)
  }
}

async function handleDeleteTransaction({ resolve, reject }) {
  try {
    await portfolioService.deleteTransaction(selectedTransaction.value.id)
    await Promise.all([fetchSummary(), fetchTransactions()])
    toastStore.success('Transação excluída com sucesso!')
    resolve()
  } catch (err) {
    console.error('[Portfolio] Erro ao excluir transação:', err)
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Erro ao excluir a transação'
    toastStore.error(msg)
    reject(new Error(msg))
  }
}
</script>

<style scoped>
.portfolio-page {
  max-width: 100%;
  animation: portfolio-fade-in 0.3s ease;
}

@keyframes portfolio-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.portfolio-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.portfolio-page__filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.portfolio-page__category-select {
  width: auto;
  min-width: 180px;
}

.portfolio-page__tabs {
  display: inline-flex;
  gap: 0.375rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 0.25rem;
}

.portfolio-page__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.portfolio-page__tab:hover {
  color: var(--text-primary);
}

.portfolio-page__tab--active {
  background: var(--primary-muted);
  color: var(--primary);
}

.portfolio-page__empty-icon {
  width: 64px;
  height: 64px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.portfolio-page__error {
  margin-bottom: 1.5rem;
}

.portfolio-page__table-wrapper {
  background: var(--bg-elevated);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-default);
}

.portfolio-page__table {
  width: 100%;
  border-collapse: collapse;
}

.portfolio-page__table thead {
  background: var(--bg-secondary);
  border-bottom: 2px solid var(--border-default);
}

.portfolio-page__th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.portfolio-page__th--right {
  text-align: right;
}

.portfolio-page__th--actions {
  width: 1%;
  text-align: center;
}

.portfolio-page__row {
  border-bottom: 1px solid var(--border-default);
  transition: background 0.15s;
}

.portfolio-page__row:hover {
  background: var(--bg-secondary);
}

.portfolio-page__row:last-child {
  border-bottom: none;
}

.portfolio-page__td {
  padding: 1rem 1.25rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
  white-space: nowrap;
}

.portfolio-page__td--right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.portfolio-page__td--code {
  font-weight: 600;
  font-family: var(--font-mono);
  color: var(--text-primary);
}

.portfolio-page__td--muted {
  color: var(--text-secondary);
  white-space: normal;
}

.portfolio-page__pagination {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border-default);
  background: var(--bg-secondary);
}

@media (max-width: 768px) {
  .portfolio-page__table-wrapper {
    overflow-x: auto;
  }

  .portfolio-page__table {
    min-width: 900px;
  }
}
</style>
