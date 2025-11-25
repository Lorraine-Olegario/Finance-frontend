<template>
  <MainLayout page-title="Cotações">
    <div class="quotes-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h2>
            <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Cotações dos Meus Ativos
          </h2>
          <p class="subtitle">{{ filteredQuotes.length }} ativo{{ filteredQuotes.length !== 1 ? 's' : '' }} em tempo real</p>
        </div>
        <div class="header-actions">
          <button @click="openFilters" class="btn-filter">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filtros
          </button>
          <button @click="fetchAllQuotes" class="btn-refresh" :disabled="loading">
            <svg class="icon" :class="{ 'spinning': loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Atualizar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" message="Carregando cotações..." />

      <!-- Error -->
      <ErrorAlert 
        v-if="error" 
        type="error"
        :message="error"
        dismissible
        @dismiss="error = ''"
      />

      <!-- Quotes Grid -->
      <div v-if="!loading && filteredQuotes.length" class="quotes-grid">
        <QuoteCard 
          v-for="quote in filteredQuotes" 
          :key="quote.symbol" 
          :quote="quote" 
        />
      </div>
      
      <!-- Empty State: No Assets -->
      <EmptyState
        v-else-if="!loading && !error && userAssets.length === 0"
        title="Nenhum ativo encontrado"
        description="Você ainda não tem ativos observados. Adicione ativos para acompanhar suas cotações."
      >
        <template #icon>
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </template>
        <template #action>
          <router-link to="/assets" class="btn">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Adicionar Ativos
          </router-link>
        </template>
      </EmptyState>
      
      <!-- Empty State: No Quotes -->
      <EmptyState
        v-else-if="!loading && !error && quotes.length === 0 && userAssets.length > 0"
        title="Cotações indisponíveis"
        description="Não foi possível carregar as cotações dos seus ativos no momento."
      >
        <template #icon>
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </template>
        <template #action>
          <button @click="fetchAllQuotes" class="btn">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Tentar Novamente
          </button>
        </template>
      </EmptyState>
    </div>
    
    <!-- Filters Sidebar -->
    <QuotesFilter
      :is-open="isFilterOpen"
      :filters="filters"
      @apply="applyFilters"
      @close="closeFilters"
    />
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout.vue'
import QuoteCard from '../components/QuoteCard.vue'
import QuotesFilter from '../components/QuotesFilter.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import EmptyState from '../components/EmptyState.vue'
import assetService from '../services/assetService'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Quotes',
  components: {
    MainLayout,
    QuoteCard,
    QuotesFilter,
    LoadingSpinner,
    ErrorAlert,
    EmptyState
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      userAssets: [],
      quotes: [],
      loading: false,
      error: '',
      isFilterOpen: false,
      filters: {
        search: '',
        variation: '',
        sortBy: 'symbol',
        sortOrder: 'asc'
      }
    }
  },
  computed: {
    filteredQuotes() {
      let result = [...this.quotes]
      
      // Aplicar busca
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        result = result.filter(q => 
          q.symbol?.toLowerCase().includes(search) ||
          q.shortName?.toLowerCase().includes(search) ||
          q.longName?.toLowerCase().includes(search)
        )
      }
      
      // Aplicar filtro de variação
      if (this.filters.variation === 'positive') {
        result = result.filter(q => (q.regularMarketChangePercent || 0) >= 0)
      } else if (this.filters.variation === 'negative') {
        result = result.filter(q => (q.regularMarketChangePercent || 0) < 0)
      }
      
      // Aplicar ordenação
      result.sort((a, b) => {
        let aVal, bVal
        
        switch (this.filters.sortBy) {
          case 'price':
            aVal = a.regularMarketPrice || a.price || 0
            bVal = b.regularMarketPrice || b.price || 0
            break
          case 'change':
            aVal = a.regularMarketChangePercent || a.changePercent || 0
            bVal = b.regularMarketChangePercent || b.changePercent || 0
            break
          case 'volume':
            aVal = a.regularMarketVolume || a.volume || 0
            bVal = b.regularMarketVolume || b.volume || 0
            break
          default: // symbol
            aVal = a.symbol || ''
            bVal = b.symbol || ''
        }
        
        if (this.filters.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
      
      return result
    }
  },
  methods: {
    async fetchAllQuotes() {
      this.loading = true
      this.error = ''
      this.quotes = []
      
      try {
        // Verificar se usuário está logado
        const userId = this.authStore.user?.id
        if (!userId) {
          this.error = 'Usuário não autenticado'
          this.loading = false
          return
        }

        // 1. Buscar TODOS os ativos do usuário (não apenas observados)
        const assetsResponse = await assetService.getAllUserAssets(userId)
        
        // A resposta vem como { user_id: X, total: Y, ativos: [...] }
        const responseData = assetsResponse.data
        this.userAssets = responseData.ativos || responseData.data || responseData || []
        
        
        if (this.userAssets.length === 0) {
          this.loading = false
          return
        }
        
        // 2. Buscar cotação de cada ativo individualmente (sequencial)
        const quotesArray = []
        let successCount = 0
        let errorCount = 0
        
        for (let i = 0; i < this.userAssets.length; i++) {
          const asset = this.userAssets[i]
          
          try {
            
            const response = await assetService.getAssetQuote(asset.codigo)
            
            if (response?.data) {
              let quoteData = null
              
              // Handle different response formats
              if (Array.isArray(response.data)) {
                quoteData = response.data[0] // Pega o primeiro item do array
              } else if (response.data.data) {
                quoteData = response.data.data
              } else {
                quoteData = response.data
              }
              
              // Combinar dados do ativo com dados da cotação
              if (quoteData && quoteData.symbol) {
                quotesArray.push({
                  ...quoteData,
                  status: asset.status,
                  observa: asset.observa,
                  tipo: asset.tipo,
                  assetId: asset.id
                })
                successCount++
              } else {
                errorCount++
                console.warn(`  ⚠️ ${asset.codigo}: Dados de cotação inválidos`)
              }
            } else {
              errorCount++
              console.warn(`  ⚠️ ${asset.codigo}: Resposta vazia`)
            }
          } catch (err) {
            errorCount++
            console.error(`  ❌ ${asset.codigo}: ${err.response?.data?.message || err.message}`)
          }
        }
        
        this.quotes = quotesArray
        
        if (this.quotes.length === 0 && errorCount > 0) {
          this.error = 'Não foi possível carregar nenhuma cotação. Tente novamente.'
        }
        
      } catch (err) {
        this.error = err.response?.data?.error || err.response?.data?.message || 'Erro ao carregar ativos'
        console.error('❌ Erro geral:', err)
        console.error('Resposta completa:', err.response?.data)
      } finally {
        this.loading = false
      }
    },
    
    openFilters() {
      this.isFilterOpen = true
    },
    
    closeFilters() {
      this.isFilterOpen = false
    },
    
    applyFilters(newFilters) {
      this.filters = { ...newFilters }
    }
  },
  mounted() {
    this.fetchAllQuotes()
  }
}
</script>

<style scoped>
.quotes-page {
  max-width: 1400px;
  animation: fadeIn 0.3s ease;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-left h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.header-icon {
  width: 32px;
  height: 32px;
  color: var(--primary);
}

.subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-filter,
.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-filter {
  background: var(--surface);
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.btn-filter:hover {
  background: var(--background);
  border-color: var(--primary);
}

.btn-refresh {
  background: var(--primary);
  color: white;
}

.btn-refresh:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-filter svg,
.btn-refresh svg {
  width: 18px;
  height: 18px;
}

/* Quotes Grid */
.quotes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.75rem;
  animation: slideUp 0.4s ease;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-family: inherit;
  background: var(--primary);
  color: white;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn .icon {
  width: 20px;
  height: 20px;
}

/* Animations */
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

.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .btn-filter,
  .btn-refresh {
    flex: 1;
  }
  
  .quotes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .header-left h2 {
    font-size: 1.5rem;
  }
  
  .header-icon {
    width: 24px;
    height: 24px;
  }
  
  .header-actions {
    flex-direction: column;
  }
}
</style>
