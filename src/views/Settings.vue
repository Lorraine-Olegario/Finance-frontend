<template>
  <MainLayout page-title="Configurações de Cores">
    <div class="settings-page">
      <h2>Personalizar Cores das Categorias</h2>
      <p>Escolha uma cor para cada tipo de ativo no seu dashboard</p>

      <div
        v-if="loading"
        class="loading"
      >
        <div class="spinner" />
      </div>

      <div
        v-else
        class="color-settings-grid"
      >
        <div
          v-for="(color, categoria) in categoryColors"
          :key="categoria"
          class="color-setting-card card"
        >
          <div class="color-setting-content">
            <h3>{{ categoria }}</h3>
            <div class="color-picker-container">
              <input 
                v-model="categoryColors[categoria]" 
                type="color" 
                class="color-picker"
                @change="markAsChanged"
              >
              <span class="color-value">{{ categoryColors[categoria] }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="hasChanges"
        class="action-buttons"
      >
        <button
          :disabled="saving"
          class="btn btn-primary"
          @click="saveColors"
        >
          {{ saving ? 'Salvando...' : 'Salvar Cores' }}
        </button>
        <button
          :disabled="saving"
          class="btn btn-secondary"
          @click="resetColors"
        >
          Resetar
        </button>
      </div>

      <div
        v-if="message"
        :class="['message', messageType]"
      >
        {{ message }}
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout.vue'
import { useAuthStore } from '../stores/auth'
import assetService from '../services/assetService'

export default {
  name: 'Settings',
  components: {
    MainLayout
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      categoryColors: {},
      originalColors: {},
      loading: true,
      saving: false,
      hasChanges: false,
      message: '',
      messageType: ''
    }
  },
  mounted() {
    this.fetchColors()
  },
  methods: {
    async fetchColors() {
      this.loading = true
      try {
        const userId = this.authStore.user?.id
        if (!userId) {
          this.showMessage('Usuário não identificado', 'error')
          return
        }

        // Buscar categorias dos ativos do usuário
        const assetsResponse = await assetService.getAssets(userId)
        const ativosPorCategoria = assetsResponse.data?.ativos_por_categoria || {}
        
        // Buscar cores salvas
        const colorsResponse = await assetService.getCategoryColors(userId)
        const savedColors = colorsResponse.data?.colors || {}

        // Cores padrão
        const defaultColors = {
          'Ações': '#FF8C00',
          'FIIs': '#6200EE',
          'Criptomoedas': '#03DAC6',
          'BDRs': '#BB86FC',
          'Stocks': '#3700B3',
          'ETFs': '#018786'
        }

        // Inicializar cores para cada categoria
        this.categoryColors = {}
        Object.keys(ativosPorCategoria).forEach(categoria => {
          this.categoryColors[categoria] = savedColors[categoria] || defaultColors[categoria] || '#CF6679'
        })

        this.originalColors = { ...this.categoryColors }
        this.hasChanges = false
      } catch (err) {
        console.error('Erro ao carregar cores:', err)
        this.showMessage('Erro ao carregar configurações', 'error')
      } finally {
        this.loading = false
      }
    },

    markAsChanged() {
      this.hasChanges = JSON.stringify(this.categoryColors) !== JSON.stringify(this.originalColors)
    },

    async saveColors() {
      this.saving = true
      try {
        const userId = this.authStore.user?.id
        if (!userId) {
          this.showMessage('Usuário não identificado', 'error')
          return
        }

        await assetService.updateCategoryColors(userId, this.categoryColors)
        this.originalColors = { ...this.categoryColors }
        this.hasChanges = false
        this.showMessage('Cores salvas com sucesso!', 'success')
      } catch (err) {
        console.error('Erro ao salvar cores:', err)
        this.showMessage('Erro ao salvar cores', 'error')
      } finally {
        this.saving = false
      }
    },

    resetColors() {
      this.categoryColors = { ...this.originalColors }
      this.hasChanges = false
      this.message = ''
    },

    showMessage(text, type) {
      this.message = text
      this.messageType = type
      setTimeout(() => {
        this.message = ''
      }, 3000)
    }
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
}

.settings-page h2 {
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.settings-page > p {
  margin-bottom: 2rem;
  color: var(--text-secondary);
}

.color-settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.color-setting-card {
  padding: 1.5rem;
}

.color-setting-content h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  color: var(--text-primary);
  font-weight: 600;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-picker {
  width: 80px;
  height: 50px;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-picker:hover {
  transform: scale(1.05);
}

.color-value {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--surface);
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--background);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
