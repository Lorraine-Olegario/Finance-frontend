<template>
  <MainLayout page-title="Ativos Observados">
    <div class="observed-assets-page">
      <!-- Header Moderno -->
      <div class="page-header">
        <div class="header-left">
          <h2>
            <svg
              class="header-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle
                cx="12"
                cy="12"
                r="3"
              />
            </svg>
            Ativos Observados
          </h2>
          <p class="subtitle">
            Gerencie os alertas dos seus ativos observados
          </p>
        </div>
        <div class="header-actions">
          <button
            class="btn-filter"
            @click="filterOpen = !filterOpen"
          >
            <svg
              class="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filtros
            <span
              v-if="activeFiltersCount > 0"
              class="badge-count"
            >{{ activeFiltersCount }}</span>
          </button>
        </div>
      </div>

      <!-- Summary Cards no topo -->
      <div
        v-if="!loading && filteredAssets.length > 0"
        class="stats-grid"
      >
        <div class="stat-card">
          <div class="stat-icon total">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle
                cx="12"
                cy="12"
                r="3"
              />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ filteredAssets.length }}
            </div>
            <div class="stat-label">
              Total de ativos observados
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ assetsWithAlerts }}
            </div>
            <div class="stat-label">
              Com alertas configurados
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
              />
              <line
                x1="12"
                y1="16"
                x2="12.01"
                y2="16"
              />
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ assetsWithoutAlerts }}
            </div>
            <div class="stat-label">
              Sem alertas
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Component -->
      <ObservedAssetsFilter
        :is-open="filterOpen"
        :filters="filters"
        :categories="categories"
        :result-count="filteredAssets.length"
        @close="closeFilters"
        @apply="applyFilters"
      />

      <!-- Loading State -->
      <div
        v-if="loading"
        class="loading-container"
      >
        <div class="spinner" />
        <p>Carregando ativos observados...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="error-container"
      >
        <svg
          class="error-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="12"
          />
          <line
            x1="12"
            y1="16"
            x2="12.01"
            y2="16"
          />
        </svg>
        <h3>Erro ao carregar ativos observados</h3>
        <button
          class="btn btn-primary mt-2"
          @click="fetchData"
        >
          Tentar novamente
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredAssets.length === 0 && !loading"
        class="empty-state"
      >
        <svg
          class="empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle
            cx="12"
            cy="12"
            r="3"
          />
        </svg>
        <h3>Nenhum ativo observado</h3>
        <p v-if="activeFiltersCount > 0">
          Ajuste os filtros de busca ou adicione novos ativos
        </p>
        <p v-else>
          Adicione ativos à sua carteira e marque como "observando" para acompanhar alertas
        </p>
        <router-link
          to="/my-assets"
          class="btn"
        >
          <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
            />
            <line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
            />
          </svg>
          Ir para Meus Ativos
        </router-link>
      </div>

      <!-- Assets Table -->
      <div
        v-else
        class="table-container"
      >
        <table class="assets-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th class="text-center">
                Valor Atual
              </th>
              <th class="text-center">
                Valor Mínimo
              </th>
              <th class="text-center">
                Valor Máximo
              </th>
              <th class="text-center">
                Status Alerta
              </th>
              <th class="text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="asset in paginatedAssets"
              :key="asset.id"
              class="asset-row"
            >
              <td>
                <div class="asset-code">
                  <svg
                    class="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <line
                      x1="16.5"
                      y1="9.4"
                      x2="7.5"
                      y2="4.21"
                    />
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line
                      x1="12"
                      y1="22.08"
                      x2="12"
                      y2="12"
                    />
                  </svg>
                  <strong>{{ asset.codigo }}</strong>
                </div>
              </td>
              <td>
                <span class="asset-name">{{ asset.nome || 'N/A' }}</span>
              </td>
              <td>
                <span
                  class="badge"
                  :style="getCategoryStyle(asset.categoria)"
                >
                  {{ asset.categoria || 'N/A' }}
                </span>
              </td>
              <td class="text-center">
                <div
                  v-if="asset.currentPrice !== null"
                  class="current-price"
                >
                  <span class="price-value">R$ {{ formatPrice(asset.currentPrice) }}</span>
                  <span
                    v-if="asset.loadingPrice"
                    class="loading-price"
                  >...</span>
                </div>
                <span
                  v-else
                  class="text-muted"
                >-</span>
              </td>
              <td class="text-center">
                <span
                  v-if="asset.alert && asset.alert.valor_min"
                  class="price"
                >
                  R$ {{ formatPrice(asset.alert.valor_min) }}
                </span>
                <span
                  v-else
                  class="text-muted"
                >-</span>
              </td>
              <td class="text-center">
                <span
                  v-if="asset.alert && asset.alert.valor_max"
                  class="price"
                >
                  R$ {{ formatPrice(asset.alert.valor_max) }}
                </span>
                <span
                  v-else
                  class="text-muted"
                >-</span>
              </td>
              <td class="text-center">
                <span
                  v-if="asset.alert"
                  :class="['status-badge', asset.alert.status]"
                >
                  {{ asset.alert.status === 'ativo' ? 'Ativo' : 'Inativo' }}
                </span>
                <span
                  v-else
                  class="text-muted"
                >Sem alerta</span>
              </td>
              <td class="text-center">
                <div class="action-buttons">
                  <button
                    class="action-btn edit-btn"
                    :title="asset.alert ? 'Editar alerta' : 'Configurar alerta'"
                    @click="openEditModal(asset)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line
                        x1="12"
                        y1="9"
                        x2="12"
                        y2="13"
                      />
                      <line
                        x1="12"
                        y1="17"
                        x2="12.01"
                        y2="17"
                      />
                    </svg>
                  </button>
                  <button
                    class="action-btn delete-btn"
                    title="Parar de observar"
                    @click="openStopObservingModal(asset)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <path d="m1 1 22 22" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="pagination"
        >
          <button
            :disabled="currentPage === 1"
            class="pagination-btn"
            @click="previousPage"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Anterior
          </button>

          <div class="pagination-numbers">
            <button
              v-for="page in paginationRange"
              :key="page"
              :class="['pagination-number', { active: currentPage === page }]"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="currentPage === totalPages"
            class="pagination-btn"
            @click="nextPage"
          >
            Próxima
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div class="pagination-info">
          Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredAssets.length) }}
          de {{ filteredAssets.length }} ativos
        </div>
      </div>

      <!-- Edit Alert Modal -->
      <EditAlertModal
        v-if="showEditModal"
        :asset="selectedAsset"
        :alert="selectedAsset.alert"
        @close="closeEditModal"
        @save="handleSaveAlert"
      />

      <!-- Stop Observing Confirmation Modal -->
      <div
        v-if="showStopObservingModal"
        class="modal-overlay"
        @click.self="closeStopObservingModal"
      >
        <div class="modal-content small">
          <div class="modal-header">
            <h3>
              <svg
                class="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <path d="m1 1 22 22" />
              </svg>
              Parar de observar ativo
            </h3>
            <button
              class="close-btn"
              @click="closeStopObservingModal"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"
                />
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <p>Tem certeza que deseja parar de observar o ativo <strong>{{ selectedAsset.codigo }}</strong>?</p>
            <p class="text-muted">
              Esta ação irá desativar todos os alertas configurados para este ativo.
            </p>

            <div class="modal-actions">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeStopObservingModal"
              >
                Cancelar
              </button>
              <button
                class="btn btn-danger"
                :disabled="saving"
                @click="handleStopObserving"
              >
                <svg
                  v-if="!saving"
                  class="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                {{ saving ? 'Processando...' : 'Parar de observar' }}
              </button>
            </div>
          </div> <!-- End observed-assets-page -->
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import assetService from '../services/assetService'
import EditAlertModal from '../components/alert/EditAlertModal.vue'
import MainLayout from '../components/MainLayout.vue'
import ObservedAssetsFilter from '../components/observed-assets/ObservedAssetsFilter.vue'

export default {
  name: 'ObservedAssets',
  components: {
    EditAlertModal,
    MainLayout,
    ObservedAssetsFilter
  },
  data() {
    return {
      authStore: useAuthStore(),
      observedAssets: [],
      alerts: [],
      loading: false,
      saving: false,
      error: null,
      filterOpen: false,
      filters: {
        search: '',
        categoria: '',
        hasAlert: ''
      },
      showEditModal: false,
      showStopObservingModal: false,
      selectedAsset: null,
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    categories() {
      const cats = [...new Set(this.observedAssets.map(a => a.tipo || a.categoria).filter(Boolean))]
      return cats.sort()
    },
    mergedAssets() {
      // Remove duplicates by ID first
      const uniqueAssets = this.observedAssets.reduce((acc, asset) => {
        if (!acc.find(a => a.id === asset.id)) {
          acc.push(asset)
        }
        return acc
      }, [])

      return uniqueAssets.map(asset => {
        const alert = this.alerts.find(a => a.ativo_id === asset.id)
        return {
          ...asset,
          categoria: asset.tipo || asset.categoria,
          alert: alert || null
        }
      })
    },
    filteredAssets() {
      let result = this.mergedAssets

      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        result = result.filter(asset =>
          asset.codigo.toLowerCase().includes(search) ||
          (asset.nome && asset.nome.toLowerCase().includes(search))
        )
      }

      if (this.filters.categoria) {
        result = result.filter(asset =>
          (asset.tipo || asset.categoria) === this.filters.categoria
        )
      }

      if (this.filters.hasAlert === 'with') {
        result = result.filter(asset => asset.alert)
      } else if (this.filters.hasAlert === 'without') {
        result = result.filter(asset => !asset.alert)
      }

      return result
    },
    paginatedAssets() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredAssets.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredAssets.length / this.itemsPerPage)
    },
    paginationRange() {
      const range = []
      const delta = 2
      const left = this.currentPage - delta
      const right = this.currentPage + delta + 1

      for (let i = 1; i <= this.totalPages; i++) {
        if (i === 1 || i === this.totalPages || (i >= left && i < right)) {
          range.push(i)
        }
      }

      return range
    },
    assetsWithAlerts() {
      return this.mergedAssets.filter(a => a.alert).length
    },
    assetsWithoutAlerts() {
      return this.mergedAssets.filter(a => !a.alert).length
    },
    activeFiltersCount() {
      let count = 0
      if (this.filters.search) count++
      if (this.filters.categoria) count++
      if (this.filters.hasAlert) count++
      return count
    }
  },
  watch: {
    'filters.search'() {
      this.currentPage = 1
      this.fetchAssetPrices()
    },
    'filters.categoria'() {
      this.currentPage = 1
      this.fetchAssetPrices()
    },
    'filters.hasAlert'() {
      this.currentPage = 1
      this.fetchAssetPrices()
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.error = null

      try {
        const userId = this.authStore.user?.id
        if (!userId) {
          this.error = 'Usuário não autenticado. Por favor, faça login.'
          this.$router.push('/login')
          return
        }

        // Fetch observed assets and alerts in parallel
        const [assetsResponse, alertsResponse] = await Promise.all([
          assetService.getObservedAssets(userId),
          assetService.getAssetAlerts(userId)
        ])

        // Validate that assets belong to logged user and remove duplicates
        const rawAssets = assetsResponse.data.observados || []
        const uniqueAssetsMap = new Map()

        rawAssets.forEach(asset => {
          if (!uniqueAssetsMap.has(asset.id)) {
            uniqueAssetsMap.set(asset.id, asset)
          }
        })

        this.observedAssets = Array.from(uniqueAssetsMap.values())

        // Handle alerts response - can be array or object with observados property
        const alertsData = alertsResponse.data
        this.alerts = []

        if (Array.isArray(alertsData)) {
          this.alerts = alertsData
        } else if (alertsData && Array.isArray(alertsData.observados)) {
          this.alerts = alertsData.observados
        }

        // Fetch current prices only for paginated assets
        await this.fetchAssetPrices()
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        this.error = err.response?.data?.message || err.message || 'Erro ao carregar dados'
      } finally {
        this.loading = false
      }
    },
    async fetchAssetPrices() {
      if (this.paginatedAssets.length === 0) return

      try {
        // Get only the codes for current page assets
        const codigos = this.paginatedAssets.map(a => a.codigo)

        // Fetch quotes only for current page
        const response = await assetService.getAssetQuotes(codigos)
        const quotes = response.data || []

        // Update only the displayed assets with their current price
        this.paginatedAssets.forEach(asset => {
          const quote = quotes.find(q => q.symbol === asset.codigo)
          if (quote) {
            asset.currentPrice = quote.regularMarketPrice || null
          }
        })
      } catch (err) {
        console.error('Erro ao buscar cotações:', err)
        // Não mostrar erro para o usuário, apenas log
      }
    },
    openEditModal(asset) {
      this.selectedAsset = asset
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
      this.selectedAsset = null
    },
    async handleSaveAlert(alertData) {
      this.saving = true

      try {
        const userId = this.authStore.user?.id
        if (!userId) {
          throw new Error('Usuário não autenticado')
        }

        if (this.selectedAsset.alert) {
          // Update existing alert
          await assetService.updateAssetAlert(this.selectedAsset.alert.id, alertData)
        } else {
          // Create new alert
          await assetService.saveAssetAlert(userId, alertData)
        }

        // Refresh data
        await this.fetchData()
        this.closeEditModal()
      } catch (err) {
        console.error('Erro ao salvar alerta:', err)
        alert('Erro ao salvar alerta: ' + (err.response?.data?.message || err.message))
      } finally {
        this.saving = false
      }
    },
    openStopObservingModal(asset) {
      this.selectedAsset = asset
      this.showStopObservingModal = true
    },
    closeStopObservingModal() {
      this.showStopObservingModal = false
      this.selectedAsset = null
    },
    async handleStopObserving() {
      this.saving = true

      try {
        const userId = this.authStore.user?.id
        if (!userId) {
          throw new Error('Usuário não autenticado')
        }

        await assetService.stopObservingAsset(userId, this.selectedAsset.id)

        // Remove from list
        this.observedAssets = this.observedAssets.filter(a => a.id !== this.selectedAsset.id)
        this.closeStopObservingModal()
      } catch (err) {
        console.error('Erro ao parar de observar:', err)
        alert('Erro ao parar de observar ativo: ' + (err.response?.data?.message || err.message))
      } finally {
        this.saving = false
      }
    },
    applyFilters(newFilters) {
      this.filters = { ...newFilters }
      this.currentPage = 1
    },
    closeFilters() {
      this.filterOpen = false
    },
    resetFilters() {
      this.filters = {
        search: '',
        categoria: '',
        hasAlert: ''
      }
      this.currentPage = 1
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchAssetPrices()
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchAssetPrices()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchAssetPrices()
      }
    },
    formatPrice(value) {
      if (!value) return '0,00'
      return parseFloat(value).toFixed(2).replace('.', ',')
    },
    getCategoryStyle(categoria) {
      const colors = {
        'Ação': '#3b82f6',
        'FII': '#10b981',
        'ETF': '#f59e0b',
        'BDR': '#8b5cf6',
        'Cripto': '#ec4899'
      }
      const color = colors[categoria] || '#6b7280'
      return {
        backgroundColor: color,
        color: 'white'
      }
    }
  }
}
</script>

<style scoped>
.observed-assets-page {
  max-width: 100%;
}

/* ===== HEADER ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1.5rem;
}

.header-left h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: var(--text-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 28px;
  height: 28px;
  color: var(--primary);
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.icon {
  width: 18px;
  height: 18px;
}

.btn-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.2s;
  position: relative;
}

.btn-filter:hover {
  background: var(--background);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.badge-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid white;
}

/* ===== STATS GRID ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid var(--border);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  border-color: var(--primary);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-icon.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-icon.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* ===== ASSETS CONTENT ===== */
.assets-content {
  flex: 1;
}

.loading-container,
.error-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.error-container h3,
.empty-state h3 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.error-container p,
.empty-state p {
  color: var(--text-secondary);
  margin: 0 0 24px 0;
}

.table-container {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.assets-table {
  width: 100%;
  border-collapse: collapse;
}

.assets-table thead {
  background: var(--bg-secondary);
}

.assets-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  border-bottom: 2px solid var(--border-color);
}

.assets-table td {
  padding: 16px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.asset-row:hover {
  background: var(--bg-hover);
}

.asset-code {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-code .icon {
  width: 18px;
  height: 18px;
  color: var(--accent-blue);
}

.asset-name {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.price {
  font-weight: 500;
  color: var(--text-primary);
}

.text-muted {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.ativo {
  background: #10b981;
  color: white;
}

.status-badge.inativo {
  background: #6b7280;
  color: white;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.edit-btn {
  background: var(--accent-yellow);
  color: white;
}

.edit-btn:hover {
  background: #d97706;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

.current-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.price-value {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.loading-price {
  font-size: 0.75rem;
  color: var(--text-secondary);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.summary-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.summary-value {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  text-decoration: none;
}

.btn .icon {
  width: 18px;
  height: 18px;
}

.btn-primary {
  background: var(--accent-blue);
  color: white;
}

.btn-primary:hover {
  background: var(--accent-blue-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--bg-hover);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.8125rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-content.small {
  max-width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header .icon {
  width: 24px;
  height: 24px;
  color: var(--accent-yellow);
}

.close-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  margin: 0 0 16px 0;
  color: var(--text-primary);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

/* ===== PAGINATION ===== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  padding: 16px 0;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 16px;
  height: 16px;
}

.pagination-numbers {
  display: flex;
  gap: 4px;
}

.pagination-number {
  min-width: 40px;
  height: 40px;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-number:hover {
  background: var(--bg-hover);
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}

.pagination-number.active {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: white;
  font-weight: 600;
}

.pagination-info {
  text-align: center;
  padding: 12px 0;
  color: var(--text-secondary);
  font-size: 14px;
  border-top: 1px solid var(--border-color);
  margin-top: 16px;
}

@media (max-width: 768px) {
  .observed-assets-page {
    padding: 16px;
  }

  .filters-container {
    flex-direction: column;
  }

  .search-box,
  .filter-select {
    width: 100%;
  }

  .table-container {
    overflow-x: auto;
  }

  .assets-table {
    min-width: 800px;
  }

  .summary-card {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
