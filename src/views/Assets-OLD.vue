<template>
  <MainLayout page-title="Gerenciar Ativos">
    <div class="assets-page">
      <!-- Header Moderno -->
      <div class="page-header">
        <div class="header-left">
          <h2>
            <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Meus Ativos
          </h2>
          <p class="subtitle">Gerencie sua carteira de investimentos</p>
        </div>
        <div class="header-actions">
          <button @click="filterOpen = !filterOpen" class="btn-filter">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filtros
            <span class="badge-count" v-if="activeFiltersCount > 0">{{ activeFiltersCount }}</span>
          </button>
          <button @click="openAddModal" class="btn btn-primary">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Adicionar Ativos
          </button>
        </div>
      </div>

      <!-- Filters Component -->
      <AssetsFilter 
        :is-open="filterOpen"
        :filters="filters"
        :categorias="categorias"
        @close="closeFilters"
        @apply="applyFilters"
      />

      <!-- Content -->
      <div class="assets-content">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Carregando ativos...</p>
        </div>

          <div v-else-if="filteredAssets.length === 0" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <h3>Nenhum ativo encontrado</h3>
            <p>Adicione ativos à sua carteira ou ajuste os filtros</p>
            <button @click="openAddModal" class="btn btn-primary">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Adicionar Primeiro Ativo
            </button>
          </div>

          <div v-else class="assets-table-container">
            <table class="assets-table">
              <thead>
                <tr>
                  <th class="th-code">Código</th>
                  <th class="th-name">Nome</th>
                  <th class="th-category">Categoria</th>
                  <th class="th-status">Status</th>
                  <th class="th-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="asset in filteredAssets" :key="asset.id" class="asset-row">
                  <td class="td-code">
                    <div class="code-cell">
                      <svg class="icon-asset" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                      </svg>
                      <span class="asset-code">{{ asset.codigo }}</span>
                    </div>
                  </td>
                  <td class="td-name">{{ asset.nome || '-' }}</td>
                  <td class="td-category">
                    <span 
                      class="badge-categoria" 
                      :style="{ 
                        backgroundColor: getCategoryColor(asset.categoria) + '15',
                        color: getCategoryColor(asset.categoria),
                        borderColor: getCategoryColor(asset.categoria) + '40'
                      }"
                    >
                      {{ asset.categoria }}
                    </span>
                  </td>
                  <td class="td-status">
                    <span class="badge-status" :class="`status-${asset.status}`">
                      <svg class="status-icon" viewBox="0 0 8 8" fill="currentColor">
                        <circle cx="4" cy="4" r="3"></circle>
                      </svg>
                      {{ asset.status }}
                    </span>
                  </td>
                  <td class="td-actions">
                    <div class="action-buttons">
                      <button 
                        @click="openEditModal(asset)" 
                        class="action-btn edit-btn"
                        title="Editar ativo"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      
                      <button 
                        v-if="asset.status === 'ativo'"
                        @click="openDeactivateModal(asset)" 
                        class="action-btn pause-btn"
                        title="Pausar ativo"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      </button>
                      
                      <button 
                        v-else
                        @click="openActivateModal(asset)" 
                        class="action-btn play-btn"
                        title="Ativar ativo"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </button>
                      
                      <button 
                        @click="openObserveModal(asset)" 
                        class="action-btn observe-btn"
                        title="Observar ativo"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      
                      <button 
                        @click="openDeleteModal(asset)" 
                        class="action-btn delete-btn"
                        title="Deletar ativo"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
      <!-- Modal: Add Assets -->
      <div v-if="modals.add" class="modal-overlay" @click.self="closeModal('add')">
        <div class="modal card">
          <div class="modal-header">
            <h3>
              <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Adicionar Ativos
            </h3>
            <button class="close-btn" @click="closeModal('add')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div v-if="error" class="alert alert-error">{{ error }}</div>
          <div v-if="success" class="alert alert-success">{{ success }}</div>

          <form @submit.prevent="addAssets">
            <div class="form-group">
              <label>Ações (separadas por vírgula)</label>
              <input 
                v-model="formData.acoes" 
                type="text" 
                placeholder="Ex: PETR4, VALE3, ITUB4"
                class="form-control"
              />
              <div style="margin-top:0.5rem; display:flex; gap:0.5rem; align-items:center;">
                <select v-model="formData.acaoCategoria" class="form-control" style="max-width:220px;">
                  <option>Ações</option>
                  <option>FIIs</option>
                  <option v-for="c in categorias" :key="c">{{ c }}</option>
                  <option>Outra</option>
                </select>
                <input v-if="formData.acaoCategoria === 'Outra'" v-model="formData.acaoCategoriaOther" type="text" placeholder="Nome da categoria" class="form-control" style="max-width:220px;" />
                <small class="form-hint">Selecione a categoria que será atribuída às ações inseridas acima.</small>
              </div>
            </div>

            <div class="form-group">
              <label>FIIs (separados por vírgula)</label>
              <input 
                v-model="formData.fiis" 
                type="text" 
                placeholder="Ex: HGLG11, MXRF11"
                class="form-control"
              />
              <div style="margin-top:0.5rem; display:flex; gap:0.5rem; align-items:center;">
                <select v-model="formData.fiiCategoria" class="form-control" style="max-width:220px;">
                  <option>FIIs</option>
                  <option>Ações</option>
                  <option v-for="c in categorias" :key="'f-'+c">{{ c }}</option>
                  <option>Outra</option>
                </select>
                <input v-if="formData.fiiCategoria === 'Outra'" v-model="formData.fiiCategoriaOther" type="text" placeholder="Nome da categoria" class="form-control" style="max-width:220px;" />
                <small class="form-hint">Selecione a categoria que será atribuída aos FIIs inseridos acima.</small>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal('add')">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Salvando...' : 'Adicionar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Edit Asset -->
      <div v-if="modals.edit" class="modal-overlay" @click.self="closeModal('edit')">
        <div class="modal card">
          <div class="modal-header">
            <h3>
              <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar Ativo
            </h3>
            <button class="close-btn" @click="closeModal('edit')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div v-if="error" class="alert alert-error">{{ error }}</div>
          <div v-if="success" class="alert alert-success">{{ success }}</div>

          <form @submit.prevent="updateAsset">
            <div class="form-group">
              <label>Código</label>
              <input 
                v-model="selectedAsset.codigo" 
                type="text" 
                class="form-control"
                readonly
              />
            </div>

            <div class="form-group">
              <label>Nome</label>
              <input 
                v-model="selectedAsset.nome" 
                type="text" 
                placeholder="Nome do ativo"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Status</label>
              <select v-model="selectedAsset.status" class="form-control">
                <option value="ativo">Ativo</option>
                <option value="observando">Observando</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <!-- Personalização de Cor da Categoria -->
            <div class="form-group">
              <label class="category-color-label">
                <svg class="icon-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="21.17" y1="8" x2="12" y2="8"></line>
                  <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                  <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                </svg>
                Cor da Categoria: {{ selectedAsset.categoria }}
              </label>
              <div class="color-picker-wrapper">
                <input 
                  v-model="editCategoryColor" 
                  type="color" 
                  class="color-input"
                  :disabled="!selectedAsset.categoria"
                />
                <div class="color-preview" :style="{ backgroundColor: editCategoryColor }">
                  <span class="color-value">{{ editCategoryColor }}</span>
                </div>
                <button 
                  type="button" 
                  @click="resetCategoryColor" 
                  class="btn-reset-color"
                  :disabled="!selectedAsset.categoria"
                  title="Restaurar cor padrão"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                </button>
              </div>
              <small class="form-hint">Esta cor será aplicada a todos os ativos desta categoria</small>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal('edit')">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Activate Confirmation -->
      <div v-if="modals.activate" class="modal-overlay" @click.self="closeModal('activate')">
        <div class="modal card modal-sm">
          <div class="modal-header">
            <h3>
              <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Ativar Ativo
            </h3>
            <button class="close-btn" @click="closeModal('activate')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <p>Deseja ativar o ativo <strong>{{ selectedAsset.codigo }}</strong>?</p>
          <p class="text-muted">O ativo será marcado como ativo em sua carteira.</p>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal('activate')">
              Cancelar
            </button>
            <button @click="activateAsset" class="btn btn-success" :disabled="saving">
              {{ saving ? 'Ativando...' : 'Ativar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal: Deactivate Confirmation -->
      <div v-if="modals.deactivate" class="modal-overlay" @click.self="closeModal('deactivate')">
        <div class="modal card modal-sm">
          <div class="modal-header">
            <h3>
              <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
              Pausar Ativo
            </h3>
            <button class="close-btn" @click="closeModal('deactivate')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <p>Deseja pausar o ativo <strong>{{ selectedAsset.codigo }}</strong>?</p>
          <p class="text-muted">O ativo será marcado como inativo.</p>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal('deactivate')">
              Cancelar
            </button>
            <button @click="deactivateAsset" class="btn btn-warning" :disabled="saving">
              {{ saving ? 'Pausando...' : 'Pausar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal: Observe Asset -->
      <div v-if="modals.observe" class="modal-overlay" @click.self="closeModal('observe')">
        <div class="modal card modal-sm">
          <div class="modal-header">
            <h3>
              <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Observar Ativo
            </h3>
            <button class="close-btn" @click="closeModal('observe')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <p>Deseja marcar o ativo <strong>{{ selectedAsset.codigo }}</strong> como observando?</p>
          <p class="text-muted">Você receberá notificações sobre este ativo.</p>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal('observe')">
              Cancelar
            </button>
            <button @click="observeAsset" class="btn btn-info" :disabled="saving">
              {{ saving ? 'Salvando...' : 'Observar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal: Delete Confirmation -->
      <div v-if="modals.delete" class="modal-overlay" @click.self="closeModal('delete')">
        <div class="modal card modal-sm">
          <div class="modal-header">
            <h3>
              <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Deletar Ativo
            </h3>
            <button class="close-btn" @click="closeModal('delete')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <p>Deseja realmente deletar o ativo <strong>{{ selectedAsset.codigo }}</strong>?</p>
          <p class="text-danger"><strong>Atenção:</strong> Esta ação não pode ser desfeita.</p>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal('delete')">
              Cancelar
            </button>
            <button @click="deleteAsset" class="btn btn-danger" :disabled="saving">
              {{ saving ? 'Deletando...' : 'Deletar' }}
            </button>
          </div>
        </div>
      </div>
    </div> <!-- End assets-page -->
      </div> <!-- End assets-content -->
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout.vue'
import AssetsFilter from '../components/AssetsFilter.vue'
import { useAuthStore } from '../stores/auth'
import assetService from '../services/assetService'

export default {
  name: 'Assets',
  components: {
    MainLayout,
    AssetsFilter
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      assets: [],
      categorias: [],
      categoryColors: {},
      filters: {
        search: '',
        categoria: '',
        status: ''
      },
      filterOpen: false,
      modals: {
        add: false,
        edit: false,
        delete: false,
        activate: false,
        deactivate: false,
        observe: false
      },
      selectedAsset: {},
      editCategoryColor: '',
      formData: {
        acoes: '',
        fiis: '',
        acaoCategoria: 'Ações',
        fiiCategoria: 'FIIs',
        acaoCategoriaOther: '',
        fiiCategoriaOther: ''
      },
      loading: false,
      saving: false,
      error: '',
      success: ''
    }
  },
  computed: {
    filteredAssets() {
      let result = this.assets

      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        result = result.filter(asset => 
          asset.codigo.toLowerCase().includes(search) ||
          (asset.nome && asset.nome.toLowerCase().includes(search))
        )
      }

      if (this.filters.categoria) {
        result = result.filter(asset => asset.categoria === this.filters.categoria)
      }

      if (this.filters.status) {
        result = result.filter(asset => asset.status === this.filters.status)
      }

      return result
    },
    activeFiltersCount() {
      let count = 0
      if (this.filters.search) count++
      if (this.filters.categoria) count++
      if (this.filters.status) count++
      return count
    }
  },
  methods: {
    async fetchAssets() {
      this.loading = true
      try {
        const userId = this.authStore.user?.id
        if (!userId) {
          this.loading = false
          return
        }

        const response = await assetService.getAssets(userId)
        const ativosPorCategoria = response.data?.ativos_por_categoria || {}

        this.assets = []
        this.categorias = Object.keys(ativosPorCategoria)

        Object.keys(ativosPorCategoria).forEach(categoria => {
          ativosPorCategoria[categoria].forEach(ativo => {
            this.assets.push({
              ...ativo,
              categoria
            })
          })
        })

        try {
          const colorsResponse = await assetService.getCategoryColors(userId)
          this.categoryColors = colorsResponse.data?.colors || {}
        } catch (err) {
          this.categoryColors = {}
        }
      } catch (error) {
        console.error('Erro ao buscar ativos:', error)
        this.error = error.response?.data?.message || 'Erro ao carregar ativos'
      } finally {
        this.loading = false
      }
    },
    getCategoryColor(categoria) {
      if (this.categoryColors[categoria]) {
        return this.categoryColors[categoria]
      }
      const defaultColors = {
        'Ações': '#ff6b35',
        'FIIs': '#004e89'
      }
      return defaultColors[categoria] || '#6200EE'
    },
    openAddModal() {
      this.modals.add = true
      this.formData = { acoes: '', fiis: '' }
    },
    openEditModal(asset) {
      this.selectedAsset = { ...asset }
      this.editCategoryColor = this.getCategoryColor(asset.categoria)
      this.modals.edit = true
    },
    openDeleteModal(asset) {
      this.selectedAsset = asset
      this.modals.delete = true
    },
    openActivateModal(asset) {
      this.selectedAsset = asset
      this.modals.activate = true
    },
    openDeactivateModal(asset) {
      this.selectedAsset = asset
      this.modals.deactivate = true
    },
    openObserveModal(asset) {
      this.selectedAsset = asset
      this.modals.observe = true
    },
    resetCategoryColor() {
      const defaultColors = {
        'Ações': '#ff6b35',
        'FIIs': '#004e89'
      }
      this.editCategoryColor = defaultColors[this.selectedAsset.categoria] || '#6200EE'
    },
    closeModal(modalName) {
      this.modals[modalName] = false
      this.error = ''
      this.success = ''
    },
    async addAssets() {
      this.saving = true
      this.error = ''
      this.success = ''
      
      try {
        const userId = this.authStore.user?.id
        if (!userId) {
          this.error = 'Usuário não autenticado'
          return
        }

        // Processar ações e FIIs
        const acoes = this.formData.acoes
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)

        const fiis = this.formData.fiis
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)

        if (acoes.length === 0 && fiis.length === 0) {
          this.error = 'Adicione pelo menos um ativo'
          return
        }

        // Montar payload de ativos com categorias selecionadas
        const ativosPayload = []

        // função utilitária para resolver categoria 'Outra'
        const resolveCategory = (selected, other) => {
          if (!selected) return 'Ações'
          if (selected === 'Outra') return (other && other.trim()) || 'Outra'
          return selected
        }

        const acaoCategory = resolveCategory(this.formData.acaoCategoria, this.formData.acaoCategoriaOther)
        const fiiCategory = resolveCategory(this.formData.fiiCategoria, this.formData.fiiCategoriaOther)

        acoes.forEach(codigo => {
          ativosPayload.push({ codigo, categoria: acaoCategory })
        })

        fiis.forEach(codigo => {
          ativosPayload.push({ codigo, categoria: fiiCategory })
        })

        try {
          // Enviar para o backend
          await assetService.createUserAssets(userId, ativosPayload)

          this.success = 'Ativos adicionados com sucesso!'
          this.formData.acoes = ''
          this.formData.fiis = ''

          setTimeout(() => {
            this.closeModal('add')
            this.fetchAssets()
          }, 800)
        } catch (err) {
          console.error('Erro ao criar ativos:', err)
          this.error = err.response?.data?.message || 'Erro ao adicionar ativos'
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao adicionar ativos'
      } finally {
        this.saving = false
      }
    },
    async updateAsset() {
      this.saving = true
      this.error = ''
      this.success = ''
      
      try {
        const userId = this.authStore.user?.id
        if (!userId) {
          this.error = 'Usuário não autenticado'
          return
        }

        // Atualizar cor da categoria se foi alterada
        if (this.editCategoryColor && this.selectedAsset.categoria) {
          const currentColor = this.categoryColors[this.selectedAsset.categoria]
          
          if (this.editCategoryColor !== currentColor) {
            const newColors = {
              ...this.categoryColors,
              [this.selectedAsset.categoria]: this.editCategoryColor
            }
            
            try {
              await assetService.updateCategoryColors(userId, newColors)
              this.categoryColors = newColors
            } catch (err) {
              console.error('Erro ao atualizar cor da categoria:', err)
              this.error = 'Erro ao atualizar cor da categoria'
            }
          }
        }

        // Atualizar ativo
        
        // Atualizar localmente
        const index = this.assets.findIndex(a => a.id === this.selectedAsset.id)
        if (index !== -1) {
          this.assets[index] = { ...this.selectedAsset }
        }
        
        this.success = 'Ativo atualizado com sucesso!'
        
        setTimeout(() => {
          this.closeModal('edit')
        }, 1500)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao atualizar ativo'
      } finally {
        this.saving = false
      }
    },
    async activateAsset() {
      this.saving = true
      
      try {
        // Atualizar status do ativo
        const index = this.assets.findIndex(a => a.id === this.selectedAsset.id)
        if (index !== -1) {
          this.assets[index].status = 'ativo'
        }
        
        this.closeModal('activate')
      } catch (err) {
        console.error('Erro ao ativar ativo:', err)
      } finally {
        this.saving = false
      }
    },
    async deactivateAsset() {
      this.saving = true
      
      try {
        // Atualizar status do ativo
        const index = this.assets.findIndex(a => a.id === this.selectedAsset.id)
        if (index !== -1) {
          this.assets[index].status = 'inativo'
        }
        
        this.closeModal('deactivate')
      } catch (err) {
        console.error('Erro ao desativar ativo:', err)
      } finally {
        this.saving = false
      }
    },
    async observeAsset() {
      this.saving = true
      
      try {
        // Atualizar status do ativo
        const index = this.assets.findIndex(a => a.id === this.selectedAsset.id)
        if (index !== -1) {
          this.assets[index].status = 'observando'
        }
        
        this.closeModal('observe')
      } catch (err) {
        console.error('Erro ao observar ativo:', err)
      } finally {
        this.saving = false
      }
    },
    async deleteAsset() {
      this.saving = true
      
      try {
        // Remover ativo da lista
        this.assets = this.assets.filter(a => a.id !== this.selectedAsset.id)
        
        this.closeModal('delete')
      } catch (err) {
        console.error('Erro ao deletar ativo:', err)
      } finally {
        this.saving = false
      }
    },
    applyFilters(newFilters) {
      this.filters = { ...newFilters }
    },
    closeFilters() {
      this.filterOpen = false
    },
    resetFilters() {
      this.filters = {
        search: '',
        categoria: '',
        status: ''
      }
    }
  },
  mounted() {
    console.log('Assets component mounted')
    console.log('Auth store user:', this.authStore.user)
    console.log('Is authenticated:', this.authStore.isAuthenticated)
    this.fetchAssets()
  }
}
</script>

<style scoped>
.assets-page {
  max-width: 100%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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

/* ===== ASSETS CONTENT ===== */
.assets-content {
  flex: 1;
  min-width: 0;
}

/* ===== ASSETS TABLE ===== */
.assets-table-container {
  background: var(--surface);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.assets-table {
  width: 100%;
  border-collapse: collapse;
}

.assets-table thead {
  background: var(--background);
  border-bottom: 2px solid var(--border);
}

.assets-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.th-code { width: 20%; }
.th-name { width: 25%; }
.th-category { width: 18%; }
.th-status { width: 15%; }
.th-actions { width: 22%; }

.asset-row {
  border-bottom: 1px solid var(--border);
  transition: background-color 0.2s;
}

.asset-row:hover {
  background-color: var(--background);
}

.asset-row:last-child {
  border-bottom: none;
}

.assets-table td {
  padding: 1.25rem;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.code-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-asset {
  width: 20px;
  height: 20px;
  color: var(--primary);
  flex-shrink: 0;
}

.asset-code {
  font-weight: 600;
  font-family: 'Courier New', monospace;
  color: var(--text-primary);
  font-size: 1rem;
}

.td-name {
  color: var(--text-secondary);
}

.badge-categoria {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: 1px solid;
}

.badge-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-icon {
  width: 8px;
  height: 8px;
}

.status-ativo {
  background: #d4edda;
  color: #155724;
}

.status-ativo .status-icon {
  color: #28a745;
}

.status-observando {
  background: #fff3cd;
  color: #856404;
}

.status-observando .status-icon {
  color: #ffc107;
}

.status-inativo {
  background: #f8d7da;
  color: #721c24;
}

.status-inativo .status-icon {
  color: #dc3545;
}

/* ===== ACTION BUTTONS ===== */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.edit-btn:hover {
  border-color: #6200EE;
  background: #f3e8ff;
  color: #6200EE;
}

.delete-btn:hover {
  border-color: #dc3545;
  background: #ffe6e6;
  color: #dc3545;
}

.play-btn:hover {
  border-color: #28a745;
  background: #e6ffe6;
  color: #28a745;
}

.pause-btn:hover {
  border-color: #ffc107;
  background: #fffbe6;
  color: #ffc107;
}

.observe-btn:hover {
  border-color: #17a2b8;
  background: #e6f7ff;
  color: #17a2b8;
}

/* ===== BUTTONS ===== */
.btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(98, 0, 238, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(98, 0, 238, 0.4);
}

.btn-secondary {
  background-color: var(--surface);
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #000;
  font-weight: 700;
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
}

.btn-info:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(23, 162, 184, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* ===== MODAL TEXT STYLES ===== */
.modal p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
  color: var(--text-primary);
}

.text-muted {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.text-danger {
  color: #dc3545;
  font-size: 0.9rem;
}

/* ===== LOADING & EMPTY STATES ===== */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
}

.spinner {
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--surface);
  border-radius: 16px;
  border: 2px dashed var(--border);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  color: var(--text-secondary);
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.modal {
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-sm {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.close-btn {
  background: var(--background);
  border: 2px solid var(--border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.close-btn svg {
  width: 16px;
  height: 16px;
}

.close-btn:hover {
  background: var(--border);
  transform: rotate(90deg);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--background);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.1);
}

.form-control:read-only {
  background: var(--surface);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.form-control option {
  padding: 0.5rem;
}

/* Category Color Picker */
.category-color-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.icon-label {
  width: 18px;
  height: 18px;
  color: var(--primary);
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-input {
  width: 60px;
  height: 45px;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  padding: 4px;
  transition: all 0.2s;
}

.color-input:hover {
  border-color: var(--primary);
}

.color-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.color-preview {
  flex: 1;
  height: 45px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-value {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
}

.btn-reset-color {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 8px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  padding: 0;
}

.btn-reset-color svg {
  width: 20px;
  height: 20px;
}

.btn-reset-color:hover:not(:disabled) {
  background: var(--border);
  color: var(--primary);
  transform: rotate(-180deg);
}

.btn-reset-color:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
}

.alert-success {
  background: #d4edda;
  color: #155724;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn-filter,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .filter-sidebar {
    width: 85%;
    max-width: 320px;
    border-radius: 16px 0 0 16px;
  }

  .filter-sidebar.open {
    right: 0;
  }

  .assets-table-container {
    overflow-x: auto;
  }

  .assets-table {
    min-width: 700px;
  }

  .th-code { width: auto; }
  .th-name { width: auto; }
  .th-category { width: auto; }
  .th-status { width: auto; }
  .th-actions { width: auto; }

  .action-buttons {
    flex-wrap: nowrap;
  }

  .action-btn {
    min-width: 32px;
    width: 32px;
    height: 32px;
  }

  .action-btn svg {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .filter-sidebar {
    width: 100%;
    max-width: 100%;
    border-radius: 0;
  }

  .modal {
    margin: 0;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
}
</style>
