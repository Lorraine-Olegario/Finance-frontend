<template>
  <MainLayout page-title="Gerenciar Ativos">
    <div class="assets-page">
      <!-- Header -->
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
              <rect
                x="2"
                y="7"
                width="20"
                height="14"
                rx="2"
                ry="2"
              />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Meus Ativos
          </h2>
          <p class="subtitle">
            Gerencie sua carteira de investimentos
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
          <button
            class="btn btn-primary"
            @click="openAddModal"
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
            Adicionar Ativos
          </button>
        </div>
      </div>

      <!-- Filters -->
      <AssetsFilter 
        :is-open="filterOpen" 
        :filters="filters" 
        :categorias="categorias"
        @close="closeFilters"
        @apply="applyFilters"
      />

      <!-- Content -->
      <div class="assets-content">
        <div
          v-if="loading"
          class="loading"
        >
          <div class="spinner" />
          <p>Carregando ativos...</p>
        </div>

        <div
          v-else-if="filteredAssets.length === 0"
          class="empty-state"
        >
          <svg
            class="empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <h3>Nenhum ativo encontrado</h3>
          <p>Adicione ativos à sua carteira ou ajuste os filtros</p>
          <button
            class="btn btn-primary"
            @click="openAddModal"
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
            Adicionar Primeiro Ativo
          </button>
        </div>

        <div
          v-else
          class="assets-table-container"
        >
          <table class="assets-table">
            <thead>
              <tr>
                <th class="th-code">
                  Código
                </th>
                <th class="th-name">
                  Nome
                </th>
                <th class="th-category">
                  Categoria
                </th>
                <th class="th-status">
                  Status
                </th>
                <th class="th-actions">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="asset in filteredAssets"
                :key="asset.id"
                class="asset-row"
                :class="{ 'observing': asset.status === 'observando' }"
              >
                <td class="td-code">
                  <div class="code-cell">
                    <svg
                      class="icon-asset"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <div class="asset-code-wrapper">
                      <span class="asset-code">{{ asset.codigo }}</span>
                      <!-- Badge de Observando - TESTE VISUAL -->
                      <span
                        v-if="asset.status === 'observando'"
                        class="observing-badge"
                        title="Ativo está sendo observado"
                      >
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
                      </span>
                      <!-- Badge de TESTE - aparece para todos os ativos (REMOVER DEPOIS) -->
                      <span
                        v-else
                        class="observing-badge-test"
                        :title="`Status atual: ${asset.status}`"
                      >
                        {{ asset.status?.substring(0, 1).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="td-name">
                  {{ asset.nome || '-' }}
                </td>
                <td class="td-category">
                  <span
                    class="badge badge-categoria"
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
                  <span
                    class="badge badge-status"
                    :class="`status-${asset.status}`"
                  >
                    <svg
                      class="status-icon"
                      viewBox="0 0 8 8"
                      fill="currentColor"
                    >
                      <circle
                        cx="4"
                        cy="4"
                        r="3"
                      />
                    </svg>
                    {{ asset.status }}
                  </span>
                </td>
                <td class="td-actions">
                  <div class="action-buttons">
                    <button
                      class="action-btn edit-btn"
                      title="Editar ativo"
                      @click="openEditModal(asset)"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    <button
                      v-if="asset.status === 'ativo'"
                      class="action-btn pause-btn"
                      title="Pausar ativo"
                      @click="openDeactivateModal(asset)"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <rect
                          x="6"
                          y="4"
                          width="4"
                          height="16"
                        />
                        <rect
                          x="14"
                          y="4"
                          width="4"
                          height="16"
                        />
                      </svg>
                    </button>

                    <button
                      v-else
                      class="action-btn play-btn"
                      title="Ativar ativo"
                      @click="openActivateModal(asset)"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>

                    <button
                      class="action-btn observe-btn"
                      title="Observar ativo"
                      @click="openObserveModal(asset)"
                    >
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
                    </button>

                    <button
                      class="action-btn delete-btn"
                      title="Deletar ativo"
                      @click="openDeleteModal(asset)"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modals -->
      <AddAssetModal
        :is-open="modals.add"
        :categorias="categorias"
        @close="closeModal('add')"
        @submit="handleAddAssets"
      />

      <EditAssetModal
        :is-open="modals.edit"
        :asset="selectedAsset"
        :category-color="editCategoryColor"
        @close="closeModal('edit')"
        @submit="handleUpdateAsset"
      />

      <ConfirmationModal
        :is-open="modals.activate"
        type="success"
        title="Ativar Ativo"
        :message="`Deseja ativar o ativo ${selectedAsset.codigo}?`"
        warning-message="O ativo será marcado como ativo em sua carteira."
        confirm-text="Ativar"
        loading-text="Ativando..."
        @close="closeModal('activate')"
        @confirm="handleActivateAsset"
      />

      <ConfirmationModal
        :is-open="modals.deactivate"
        type="warning"
        title="Pausar Ativo"
        :message="`Deseja pausar o ativo ${selectedAsset.codigo}?`"
        warning-message="O ativo será marcado como inativo."
        confirm-text="Pausar"
        loading-text="Pausando..."
        @close="closeModal('deactivate')"
        @confirm="handleDeactivateAsset"
      />

      <ConfirmationModal
        :is-open="modals.observe"
        type="info"
        title="Observar Ativo"
        :message="`Deseja marcar o ativo ${selectedAsset.codigo} como observando?`"
        warning-message="O ativo será destacado e você poderá configurar alertas na página de Ativos Observados."
        confirm-text="Observar"
        loading-text="Salvando..."
        @close="closeModal('observe')"
        @confirm="handleObserveAsset"
      />

      <ConfirmationModal
        :is-open="modals.delete"
        type="danger"
        title="Deletar Ativo"
        :message="`Deseja realmente deletar o ativo ${selectedAsset.codigo}?`"
        warning-message="Esta ação não pode ser desfeita."
        confirm-text="Deletar"
        loading-text="Deletando..."
        @close="closeModal('delete')"
        @confirm="handleDeleteAsset"
      />
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout.vue'
import AssetsFilter from '../components/my-assets/AssetsFilter.vue'
import AddAssetModal from '../components/my-assets/AddAssetModal.vue'
import EditAssetModal from '../components/my-assets/EditAssetModal.vue'
import ConfirmationModal from '../components/my-assets/ConfirmationModal.vue'
import { useAuthStore } from '../stores/auth'
import assetService from '../services/assetService'
import categoryService from '../services/categoryService'

export default {
    name: 'Assets',
    components: {
        MainLayout,
        AssetsFilter,
        AddAssetModal,
        EditAssetModal,
        ConfirmationModal
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
            loading: false
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
    mounted() {
        this.fetchAssets()
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
                const categoriasSet = new Set()

                Object.keys(ativosPorCategoria).forEach(categoria => {
                    categoriasSet.add(categoria)
                    ativosPorCategoria[categoria].forEach(ativo => {
                        this.assets.push({
                            ...ativo,
                            categoria
                        })
                    })
                })

                await this.fetchCategorias()

                try {
                    const colorsResponse = await assetService.getCategoryColors(userId)
                    this.categoryColors = colorsResponse.data?.colors || {}
                } catch (err) {
                    this.categoryColors = {}
                }
            } catch (error) {
                this.categoryColors = {}
            } finally {
                this.loading = false
            }
        },
        async fetchCategorias() {
            try {
                const response = await categoryService.getAll()
                if (response.data) {
                    if (Array.isArray(response.data)) {
                        this.categorias = response.data.map(cat => cat.nome || cat.name || cat)
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        this.categorias = response.data.data.map(cat => cat.nome || cat.name || cat)
                    }
                }

                const categoriasFromAssets = [...new Set(this.assets.map(a => a.categoria).filter(Boolean))]
                this.categorias = [...new Set([...this.categorias, ...categoriasFromAssets])]

            } catch (error) {
                const categoriasFromAssets = [...new Set(this.assets.map(a => a.categoria).filter(Boolean))]
                this.categorias = categoriasFromAssets.length > 0 ? categoriasFromAssets : ['Ações', 'FIIs', 'Criptomoedas']
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
        closeModal(modalName) {
            this.modals[modalName] = false
        },
        async handleAddAssets({ categoria, codigos }) {
            const userId = this.authStore.user?.id
            if (!userId) {
                throw new Error('Usuário não autenticado')
            }

            const ativosPayload = codigos.map(codigo => ({
                codigo,
                categoria
            }))

            await assetService.createUserAssets(userId, ativosPayload)
            await this.fetchAssets()
        },
        async handleUpdateAsset(assetData) {
            const userId = this.authStore.user?.id
            if (!userId) {
                throw new Error('Usuário não autenticado')
            }

            if (assetData.categoryColor && assetData.categoria) {
                const currentColor = this.categoryColors[assetData.categoria]

                if (assetData.categoryColor !== currentColor) {
                    const newColors = {
                        ...this.categoryColors,
                        [assetData.categoria]: assetData.categoryColor
                    }

                    await assetService.updateCategoryColors(userId, newColors)
                    this.categoryColors = newColors
                }
            }

            const index = this.assets.findIndex(a => a.id === assetData.id)
            if (index !== -1) {
                this.assets[index] = { ...assetData }
            }
        },
        async handleActivateAsset({ resolve, reject }) {
            try {
                const userId = this.authStore.user?.id
                if (!userId) {
                    throw new Error('Usuário não autenticado')
                }

                // Chama o backend para atualizar o status
                await assetService.updateAssetStatus(userId, [{
                    ativo_id: this.selectedAsset.id,
                    status: 'ativo'
                }])

                // Atualiza o estado local
                const index = this.assets.findIndex(a => a.id === this.selectedAsset.id)
                if (index !== -1) {
                    this.assets[index].status = 'ativo'
                }

                resolve()
            } catch (error) {
                console.error('Erro ao ativar ativo:', error)
                reject(error)
            }
        },
        async handleDeactivateAsset({ resolve, reject }) {
            try {
                const userId = this.authStore.user?.id
                if (!userId) {
                    throw new Error('Usuário não autenticado')
                }

                // Chama o backend para atualizar o status
                await assetService.updateAssetStatus(userId, [{
                    ativo_id: this.selectedAsset.id,
                    status: 'inativo'
                }])

                // Atualiza o estado local
                const index = this.assets.findIndex(a => a.id === this.selectedAsset.id)
                if (index !== -1) {
                    this.assets[index].status = 'inativo'
                }

                resolve()
            } catch (error) {
                console.error('Erro ao desativar ativo:', error)
                reject(error)
            }
        },
        async handleObserveAsset({ resolve, reject }) {
            try {
                const userId = this.authStore.user?.id
                if (!userId) {
                    throw new Error('Usuário não autenticado')
                }

                // Chama o backend para atualizar o status
                await assetService.updateAssetStatus(userId, [{
                    ativo_id: this.selectedAsset.id,
                    status: 'observando'
                }])

                // Atualiza o estado local
                const index = this.assets.findIndex(a => a.id === this.selectedAsset.id)
                if (index !== -1) {
                    this.assets[index].status = 'observando'
                }

                resolve()
            } catch (error) {
                console.error('Erro ao marcar ativo como observando:', error)
                reject(error)
            }
        },
        async handleDeleteAsset({ resolve, reject }) {
            try {
                const userId = this.authStore.user?.id
                if (!userId) {
                    throw new Error('Usuário não autenticado')
                }

                // Chama o backend para deletar o ativo
                // Nota: você pode precisar ajustar isso se houver um endpoint específico de delete
                await assetService.updateAssetStatus(userId, [{
                    ativo_id: this.selectedAsset.id,
                    status: 'deletado'
                }])

                // Remove do estado local
                this.assets = this.assets.filter(a => a.id !== this.selectedAsset.id)

                resolve()
            } catch (error) {
                console.error('Erro ao deletar ativo:', error)
                reject(error)
            }
        },
        applyFilters(newFilters) {
            this.filters = { ...newFilters }
        },
        closeFilters() {
            this.filterOpen = false
        }
    }
}
</script>

<style scoped>
.assets-page {
    max-width: 100%;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Header */
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

/* Content */
.assets-content {
    flex: 1;
    min-width: 0;
}

/* Table */
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

.th-code {
    width: 20%;
}

.th-name {
    width: 25%;
}

.th-category {
    width: 18%;
}

.th-status {
    width: 15%;
}

.th-actions {
    width: 22%;
}

.asset-row {
    border-bottom: 1px solid var(--border);
    transition: all 0.2s;
}

.asset-row:hover {
    background-color: var(--background);
}

.asset-row:last-child {
    border-bottom: none;
}

/* Destaque para ativos sendo observados */
.asset-row.observing {
    background: linear-gradient(90deg, rgba(23, 162, 184, 0.05) 0%, transparent 100%);
    border-left: 3px solid #17a2b8;
}

.asset-row.observing:hover {
    background: linear-gradient(90deg, rgba(23, 162, 184, 0.1) 0%, transparent 100%);
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
    position: relative;
}

.asset-code-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Badge de Observando */
.observing-badge {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    min-width: 32px;
    background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
    border-radius: 50%;
    color: white;
    animation: pulse 2s infinite;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(23, 162, 184, 0.4);
    position: relative;
    z-index: 1;
}

.observing-badge svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.5;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* Badge de TESTE - mostra a primeira letra do status */
.observing-badge-test {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    min-width: 24px;
    background: #e0e0e0;
    border-radius: 50%;
    color: #666;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0;
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(23, 162, 184, 0.7);
    }

    50% {
        box-shadow: 0 0 0 6px rgba(23, 162, 184, 0);
    }
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

.badge {
    display: inline-block;
    padding: 0.375rem 0.875rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid;
}

.badge-categoria {
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.badge-status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-transform: capitalize;
}

.status-icon {
    width: 8px;
    height: 8px;
}

.status-ativo {
    background: #d4edda;
    color: #155724;
    border-color: #c3e6cb;
}

.status-ativo .status-icon {
    color: #28a745;
}

.status-observando {
    background: #fff3cd;
    color: #856404;
    border-color: #ffeaa7;
}

.status-observando .status-icon {
    color: #ffc107;
}

.status-inativo {
    background: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
}

.status-inativo .status-icon {
    color: #dc3545;
}

/* Action Buttons */
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

/* Buttons */
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

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
}

/* Loading & Empty States */
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
    to {
        transform: rotate(360deg);
    }
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

/* Responsive */
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

    .assets-table-container {
        overflow-x: auto;
    }

    .assets-table {
        min-width: 700px;
    }

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
</style>
