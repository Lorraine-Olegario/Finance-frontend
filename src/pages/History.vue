<template>
  <MainLayout page-title="Histórico">
    <div class="history-page">
      <PageHeader
        title="Histórico de Ativos"
        subtitle="Consulte o histórico de preços de um ativo pelo seu código"
      />

      <div class="history-page__form">
        <div class="history-page__search">
          <SearchBar
            v-model="searchCode"
            placeholder="Digite o código do ativo (ex: PETR4)"
            :disabled="loading"
            @search="handleSearch"
          />
          <BaseButton
            variant="primary"
            :disabled="!searchCode || loading"
            :loading="loading"
            @click="handleSearch"
          >
            Buscar
          </BaseButton>
        </div>
      </div>

      <LoadingSpinner
        v-if="loading"
        message="Buscando histórico..."
      />

      <AlertMessage
        v-if="error"
        type="error"
        :message="error"
        dismissible
        @dismiss="error = ''"
      />

      <div
        v-if="historyData.length"
        class="history-page__results"
      >
        <h3 class="history-page__results-title">
          Histórico de {{ lastSearchCode }}
        </h3>

        <div class="history-page__table-wrapper">
          <table class="history-page__table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Símbolo</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Variação %</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(record, index) in historyData"
                :key="index"
              >
                <td>{{ formatDate(record.created_at || record.timestamp) }}</td>
                <td>{{ record.symbol }}</td>
                <td>{{ record.shortName || record.name }}</td>
                <td>
                  {{ record.currency }}
                  {{ formatPrice(record.price || record.regularMarketPrice) }}
                </td>
                <td
                  :class="
                    getChangeClass(
                      record.changePercent || record.regularMarketChangePercent
                    )
                  "
                >
                  {{
                    formatChangePercent(
                      record.changePercent || record.regularMarketChangePercent
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <EmptyState
        v-else-if="!loading && !error && hasSearched"
        title="Nenhum resultado encontrado"
        description="Não foram encontrados registros para este ativo"
      >
        <template #icon>
          <SvgIcon
            name="search"
            :size="48"
          />
        </template>
      </EmptyState>

      <EmptyState
        v-else-if="!loading && !hasSearched"
        title="Nenhuma busca realizada"
        description="Digite um código de ativo para ver seu histórico"
      >
        <template #icon>
          <SvgIcon
            name="activity"
            :size="48"
          />
        </template>
      </EmptyState>
    </div>
  </MainLayout>
</template>

<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import SearchBar from '@/components/molecules/SearchBar.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import EmptyState from '@/components/atoms/EmptyState.vue'
import AlertMessage from '@/components/atoms/AlertMessage.vue'
import SvgIcon from '@/components/atoms/SvgIcon.vue'
import assetService from '@/services/assetService'

// ── State ─────────────────────────────────────────────────────────────────────
const searchCode = ref('')
const lastSearchCode = ref('')
const historyData = ref([])
const loading = ref(false)
const error = ref('')
const hasSearched = ref(false)

// ── Computed ───────────────────────────────────────────────────────────────────

// ── Watchers ──────────────────────────────────────────────────────────────────

// ── Lifecycle ─────────────────────────────────────────────────────────────────

// ── Functions ─────────────────────────────────────────────────────────────────
async function fetchHistory(codigo) {
  const response = await assetService.getAssetHistory(codigo)
  historyData.value = response.data
}

async function handleSearch() {
  if (!searchCode.value) return

  loading.value = true
  error.value = ''
  historyData.value = []
  hasSearched.value = true
  lastSearchCode.value = searchCode.value.toUpperCase()

  try {
    await fetchHistory(searchCode.value.toUpperCase())
  } catch (err) {
    error.value = 'Erro ao buscar histórico. Tente novamente.'
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR')
}

function formatPrice(price) {
  return price ? price.toFixed(2) : '0.00'
}

function formatChangePercent(changePercent) {
  if (!changePercent) return '-'
  const prefix = changePercent >= 0 ? '+' : ''
  return `${prefix}${changePercent.toFixed(2)}%`
}

function getChangeClass(changePercent) {
  if (!changePercent) return ''
  return changePercent >= 0
    ? 'history-page__change--positive'
    : 'history-page__change--negative'
}
</script>

<style scoped>

.history-page__form {
  margin-bottom: 1.5rem;
}

.history-page__search {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.history-page__search .search-bar {
  flex: 1;
}

.history-page__results {
  margin-top: 1.5rem;
}

.history-page__results-title {
  margin: 0 0 1.25rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.history-page__table-wrapper {
  overflow-x: auto;
}

.history-page__table {
  width: 100%;
  border-collapse: collapse;
}

.history-page__table th,
.history-page__table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
  font-size: 0.875rem;
}

.history-page__table th {
  font-weight: 600;
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
}

.history-page__table tbody tr:hover {
  background-color: var(--bg-hover);
}

.history-page__change--positive {
  color: var(--success);
  font-weight: 600;
}

.history-page__change--negative {
  color: var(--error);
  font-weight: 600;
}

@media (max-width: 768px) {
  .history-page__search {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
