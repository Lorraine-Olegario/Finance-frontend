<template>
  <MainLayout page-title="Histórico">
    <div class="history-page">
      <div class="page-header">
        <h2>Histórico de Ativos</h2>
      </div>

      <!-- Search Form -->
      <div class="card search-card">
        <div class="form-group">
          <label>Buscar Histórico</label>
          <div class="search-input-group">
            <input 
              v-model="searchCode" 
              type="text" 
              placeholder="Digite o código do ativo (ex: PETR4)"
              @keyup.enter="searchHistory"
            />
            <button @click="searchHistory" :disabled="!searchCode || loading">
              Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <!-- Error -->
      <div v-if="error" class="card error-card">
        <p class="error-message">{{ error }}</p>
      </div>

      <!-- History Results -->
      <div v-if="historyData.length" class="card">
        <h3>Histórico de {{ searchCode }}</h3>
        
        <div class="history-table-wrapper">
          <table>
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
              <tr v-for="(record, index) in historyData" :key="index">
                <td>{{ formatDate(record.created_at || record.timestamp) }}</td>
                <td>{{ record.symbol }}</td>
                <td>{{ record.shortName || record.name }}</td>
                <td>{{ record.currency }} {{ formatPrice(record.price || record.regularMarketPrice) }}</td>
                <td :class="getChangeClass(record.changePercent || record.regularMarketChangePercent)">
                  {{ formatChangePercent(record.changePercent || record.regularMarketChangePercent) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else-if="!loading && !error" class="card empty-state">
        <p>Digite um código de ativo para ver seu histórico</p>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout.vue'
import assetService from '../services/assetService'

export default {
  name: 'History',
  components: {
    MainLayout
  },
  data() {
    return {
      searchCode: '',
      historyData: [],
      loading: false,
      error: ''
    }
  },
  methods: {
    async searchHistory() {
      if (!this.searchCode) return
      
      this.loading = true
      this.error = ''
      this.historyData = []
      
      try {
        const response = await assetService.getAssetHistory(this.searchCode.toUpperCase())
        this.historyData = response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao buscar histórico'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR')
    },
    
    formatPrice(price) {
      return price ? price.toFixed(2) : '0.00'
    },
    
    formatChangePercent(changePercent) {
      if (!changePercent) return '-'
      const prefix = changePercent >= 0 ? '+' : ''
      return `${prefix}${changePercent.toFixed(2)}%`
    },
    
    getChangeClass(changePercent) {
      if (!changePercent) return ''
      return changePercent >= 0 ? 'positive' : 'negative'
    }
  }
}
</script>

<style scoped>
.history-page {
  max-width: 1200px;
}

.page-header h2 {
  margin-bottom: 2rem;
}

.search-card {
  margin-bottom: 2rem;
}

.search-input-group {
  display: flex;
  gap: 1rem;
}

.search-input-group input {
  flex: 1;
}

.search-input-group button {
  white-space: nowrap;
}

.history-table-wrapper {
  overflow-x: auto;
}

.positive {
  color: var(--success);
  font-weight: 600;
}

.negative {
  color: var(--error);
  font-weight: 600;
}

.error-card {
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .search-input-group {
    flex-direction: column;
  }
}
</style>
