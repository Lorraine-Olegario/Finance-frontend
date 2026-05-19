<template>
  <MainLayout page-title="Cotações">
    <div class="quotes-page">
      <PageHeader
        title="Cotações"
        :subtitle="`${filteredQuotes.length} ativo${filteredQuotes.length !== 1 ? 's' : ''} em tempo real`"
      >
        <template #actions>
          <BaseButton
            variant="secondary"
            @click="isFilterOpen = true"
          >
            <template #icon-left>
              <SvgIcon
                name="filter"
                :size="16"
              />
            </template>
            Filtros
            <template
              v-if="activeFiltersCount > 0"
              #icon-right
            >
              <span class="quotes-page__filter-count">
                {{ activeFiltersCount }}
              </span>
            </template>
          </BaseButton>

          <BaseButton
            variant="primary"
            :disabled="loading"
            @click="loadPage(pagination.currentPage)"
          >
            <template #icon-left>
              <SvgIcon
                name="refresh"
                :size="16"
                :class="{ 'quotes-page__spin': loading }"
              />
            </template>
            Atualizar
          </BaseButton>
        </template>
      </PageHeader>

      <LoadingSpinner
        v-if="loading"
        message="Carregando cotações..."
      />

      <AlertMessage
        v-if="error"
        type="error"
        :message="error"
        dismissible
        @dismiss="error = ''"
      />

      <div
        v-if="!loading && filteredQuotes.length"
        class="quotes-page__grid"
      >
        <QuoteCard
          v-for="quote in filteredQuotes"
          :key="quote.symbol"
          :quote="quote"
        />
      </div>

      <Pagination
        v-if="!loading && pagination.total > 0"
        :current-page="pagination.currentPage"
        :last-page="pagination.lastPage"
        :total="pagination.total"
        :per-page="pagination.perPage"
        :show-total="true"
        :show-page-info="false"
        @page-change="loadPage"
      >
        <template #totalLabel="{ total }">
          Total de cotações:
          <strong>{{ total }}</strong>
        </template>
      </Pagination>

      <EmptyState
        v-else-if="!loading && !error && userAssets.length === 0"
        title="Nenhum ativo encontrado"
        description="Você ainda não tem ativos observados. Adicione ativos para acompanhar suas cotações."
      >
        <template #icon>
          <SvgIcon
            name="activity"
            :size="64"
          />
        </template>
        <template #action>
          <RouterLink
            to="/my-assets"
            class="quotes-page__cta"
          >
            <SvgIcon
              name="plus"
              :size="18"
            />
            Adicionar Ativos
          </RouterLink>
        </template>
      </EmptyState>

      <EmptyState
        v-else-if="
          !loading && !error && quotes.length === 0 && userAssets.length > 0
        "
        title="Cotações indisponíveis"
        description="Não foi possível carregar as cotações dos seus ativos no momento."
      >
        <template #icon>
          <SvgIcon
            name="alert-triangle"
            :size="64"
          />
        </template>
        <template #action>
          <BaseButton
            variant="primary"
            @click="loadPage(1)"
          >
            <template #icon-left>
              <SvgIcon
                name="refresh"
                :size="16"
              />
            </template>
            Tentar Novamente
          </BaseButton>
        </template>
      </EmptyState>
    </div>

    <QuotesFilterDrawer
      :is-open="isFilterOpen"
      :filters="filters"
      @close="isFilterOpen = false"
      @apply="applyFilters"
    />
  </MainLayout>
</template>

<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref, computed, onMounted } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import Pagination from '@/components/atoms/Pagination/index.vue'
import QuoteCard from '@/components/organisms/quotes/QuoteCard/index.vue'
import QuotesFilterDrawer from '@/components/organisms/quotes/QuotesFilterDrawer/index.vue'
import assetService from '@/services/assetService'
import { useAuthStore } from '@/stores/auth'

// ── State ─────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()

const userAssets = ref([])
const quotes = ref([])
const loading = ref(false)
const error = ref('')
const isFilterOpen = ref(false)

const filters = ref({
  search: '',
  variacao: '',
  sortBy: 'codigo',
  sortOrder: 'asc'
})

const pagination = ref({
  currentPage: 1,
  perPage: 12,
  total: 0,
  lastPage: 1
})

// ── Computed ──────────────────────────────────────────────────────────────────
const filteredQuotes = computed(() => {
  let result = [...quotes.value]

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(
      q =>
        q.symbol?.toLowerCase().includes(search) ||
        q.shortName?.toLowerCase().includes(search) ||
        q.longName?.toLowerCase().includes(search)
    )
  }

  if (filters.value.variacao === 'positive') {
    result = result.filter(q => (q.regularMarketChangePercent || 0) >= 0)
  } else if (filters.value.variacao === 'negative') {
    result = result.filter(q => (q.regularMarketChangePercent || 0) < 0)
  }

  result.sort((a, b) => {
    let aVal, bVal

    switch (filters.value.sortBy) {
      case 'preco':
        aVal = a.regularMarketPrice || a.price || 0
        bVal = b.regularMarketPrice || b.price || 0
        break
      case 'variacao':
        aVal = a.regularMarketChangePercent || a.changePercent || 0
        bVal = b.regularMarketChangePercent || b.changePercent || 0
        break
      case 'volume':
        aVal = a.regularMarketVolume || a.volume || 0
        bVal = b.regularMarketVolume || b.volume || 0
        break
      default: // codigo
        aVal = a.symbol || ''
        bVal = b.symbol || ''
    }

    return filters.value.sortOrder === 'asc'
      ? aVal > bVal
        ? 1
        : -1
      : aVal < bVal
        ? 1
        : -1
  })

  return result
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.search) count++
  if (filters.value.variacao) count++
  if (filters.value.sortBy !== 'codigo') count++
  if (filters.value.sortOrder !== 'asc') count++
  return count
})

// ── Watchers ──────────────────────────────────────────────────────────────────

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => loadPage(1))

// ── Functions ─────────────────────────────────────────────────────────────────
async function fetchQuotes(page = 1) {
  quotes.value = []

  const assetsResponse = await assetService.getAllUserAssets(
    page,
    pagination.value.perPage
  )

  const responseData = assetsResponse.data.ativos.data
  const paginationData = assetsResponse.data.ativos || {}

  userAssets.value = responseData

  pagination.value = {
    currentPage: paginationData.current_page || 1,
    perPage: paginationData.per_page || 12,
    total: paginationData.total || 0,
    lastPage: paginationData.last_page || 1
  }

  if (userAssets.value.length === 0) return

  const quotesArray = []
  let errorCount = 0

  for (const asset of userAssets.value) {
    try {
      const response = await assetService.getAssetQuote(asset.codigo)

      if (response?.data) {
        let quoteData = null

        if (Array.isArray(response.data)) {
          quoteData = response.data[0]
        } else if (response.data.data) {
          quoteData = response.data.data
        } else {
          quoteData = response.data
        }

        if (quoteData?.symbol) {
          quotesArray.push({
            ...quoteData,
            status: asset.status,
            observa: asset.observa,
            tipo: asset.tipo,
            assetId: asset.id
          })
        } else {
          errorCount++
        }
      } else {
        errorCount++
      }
    } catch (err) {
      errorCount++
      console.error(
        `[Quotes] ${asset.codigo}: ${err.response?.data?.message || err.message}`
      )
    }
  }

  quotes.value = quotesArray

  if (quotes.value.length === 0 && errorCount > 0) {
    error.value =
      'Não foi possível carregar nenhuma cotação. Tente novamente.'
  }
}

async function loadPage(page) {
  loading.value = true
  error.value = ''
  try {
    await fetchQuotes(page)
  } catch (err) {
    error.value = 'Erro ao carregar cotações. Tente novamente.'
    console.error('[Quotes] Erro geral:', err)
  } finally {
    loading.value = false
  }
}

function applyFilters(newFilters) {
  filters.value = { ...newFilters }
}
</script>

<style scoped>
.quotes-page {
  max-width: 1400px;
  animation: fadeIn 0.3s ease;
}

.quotes-page__filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--primary);
  color: white;
  border-radius: 9px;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
}

.quotes-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  animation: slideUp 0.4s ease;
  margin-bottom: 2rem;
}

.quotes-page__loading-item {
  background: var(--bg-primary);
  border-radius: 12px;
  border: 2px solid var(--border);
  height: 130px;
  animation: shimmer 1.4s ease-in-out infinite;
}

.quotes-page__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.quotes-page__cta:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.quotes-page__spin {
  animation: spin 0.8s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .quotes-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
