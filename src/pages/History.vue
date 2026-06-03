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

      <LoadingSpinner v-if="loading" message="Buscando histórico..." />

      <AlertMessage
        v-if="error"
        type="error"
        :message="error"
        dismissible
        @dismiss="error = ''"
      />

      <template v-if="stockData && !loading">
        <div class="history-page__header">
          <div class="history-page__asset-info">
            <img
              v-if="stockData.logoUrl"
              :src="stockData.logoUrl"
              :alt="stockData.symbol"
              class="history-page__logo"
            />
            <div>
              <h3 class="history-page__symbol">{{ stockData.symbol }}</h3>
              <span class="history-page__name">{{ stockData.shortName }}</span>
            </div>
          </div>

          <div class="history-page__metrics">
            <div class="history-page__metric">
              <span class="history-page__metric-label">Preço atual</span>
              <span class="history-page__metric-value">
                {{ stockData.currency }} {{ formatPrice(stockData.currentPrice) }}
              </span>
            </div>
            <div class="history-page__metric">
              <span class="history-page__metric-label">Variação</span>
              <span
                class="history-page__metric-value"
                :class="getChangeClass(stockData.currentChangePercent)"
              >
                {{ formatChangePercent(stockData.currentChangePercent) }}
              </span>
            </div>
            <div class="history-page__metric">
              <span class="history-page__metric-label">Mín. 52 sem.</span>
              <span class="history-page__metric-value">
                {{ formatPrice(stockData.fiftyTwoWeekLow) }}
              </span>
            </div>
            <div class="history-page__metric">
              <span class="history-page__metric-label">Máx. 52 sem.</span>
              <span class="history-page__metric-value">
                {{ formatPrice(stockData.fiftyTwoWeekHigh) }}
              </span>
            </div>
          </div>
        </div>

        <div class="history-page__table-wrapper">
          <table class="history-page__table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Abertura</th>
                <th>Máxima</th>
                <th>Mínima</th>
                <th>Fechamento</th>
                <th>Aj. Fechamento</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in stockData.history"
                :key="index"
              >
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ formatPrice(item.open) }}</td>
                <td>{{ formatPrice(item.high) }}</td>
                <td>{{ formatPrice(item.low) }}</td>
                <td>
                  <span :class="getChangeClass(item.close - item.open)">
                    {{ formatPrice(item.close) }}
                  </span>
                </td>
                <td>{{ formatPrice(item.adjustedClose) }}</td>
                <td>{{ formatVolume(item.volume) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <EmptyState
        v-else-if="!loading && !error && hasSearched"
        title="Nenhum resultado encontrado"
        description="Não foram encontrados registros para este ativo"
      >
        <template #icon>
          <SvgIcon name="search" :size="48" />
        </template>
      </EmptyState>

      <EmptyState
        v-else-if="!loading && !hasSearched"
        title="Nenhuma busca realizada"
        description="Digite um código de ativo para ver seu histórico"
      >
        <template #icon>
          <SvgIcon name="activity" :size="48" />
        </template>
      </EmptyState>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader/index.vue'
import SearchBar from '@/components/molecules/SearchBar/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import assetService from '@/services/assetService'

const searchCode   = ref('')
const loading      = ref(false)
const error        = ref('')
const hasSearched  = ref(false)
const stockData    = ref(null)

async function handleSearch() {
  if (!searchCode.value) return

  loading.value    = true
  error.value      = ''
  stockData.value  = null
  hasSearched.value = true

  try {
    const response = await assetService.getAssetHistory(searchCode.value.toUpperCase())
    stockData.value = response.data[0] ?? null
  } catch (err) {
    error.value = 'Erro ao buscar histórico. Tente novamente.'
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

function formatPrice(price) {
  if (price == null) return '-'
  return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatVolume(volume) {
  if (volume == null) return '-'
  return volume.toLocaleString('pt-BR')
}

function formatChangePercent(value) {
  if (value == null) return '-'
  const prefix = value >= 0 ? '+' : ''
  return `${prefix}${value.toFixed(2)}%`
}

function getChangeClass(value) {
  if (!value) return ''
  return value >= 0 ? 'history-page__change--positive' : 'history-page__change--negative'
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

.history-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.history-page__asset-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.history-page__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.history-page__symbol {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.history-page__name {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.history-page__metrics {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.history-page__metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.history-page__metric-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.history-page__metric-value {
  font-size: 0.9375rem;
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

  .history-page__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>