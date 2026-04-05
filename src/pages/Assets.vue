<template>
  <MainLayout page-title="Meus Ativos">
    <div class="assets-page">
      <PageHeader
        title="Meus Ativos"
        subtitle="Gerencie sua carteira de investimentos"
      >
        <template #actions>
          <div class="assets-page__filter-wrapper">
            <BaseButton
              variant="secondary"
              @click="filterOpen = !filterOpen"
            >
              <template #icon-left>
                <SvgIcon
                  name="filter"
                  :size="16"
                />
              </template>
              Filtros
            </BaseButton>
            <span
              v-if="activeFiltersCount > 0"
              class="assets-page__filter-count"
            >{{ activeFiltersCount }}</span>
          </div>

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
            Adicionar Ativos
          </BaseButton>
        </template>
      </PageHeader>

      <AssetsFilterDrawer
        :is-open="filterOpen"
        :filters="filters"
        :categorias="categorias"
        @close="filterOpen = false"
        @apply="applyFilters"
        @reset="resetFilters"
      />

      <LoadingSpinner
        v-if="loading"
        message="Carregando ativos..."
      />

      <EmptyState
        v-else-if="filteredAssets.length === 0"
        title="Nenhum ativo encontrado"
        description="Adicione ativos à sua carteira ou ajuste os filtros"
      >
        <template #icon>
          <SvgIcon
            name="activity"
            class="assets-page__empty-icon"
          />
        </template>
        <template #action>
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
            Adicionar Primeiro Ativo
          </BaseButton>
        </template>
      </EmptyState>

      <div
        v-else
        class="assets-page__table-wrapper"
      >
        <table class="assets-page__table">
          <thead>
            <tr>
              <th class="assets-page__th assets-page__th--code">Código</th>
              <th class="assets-page__th assets-page__th--name">Nome</th>
              <th class="assets-page__th assets-page__th--category">Categoria</th>
              <th class="assets-page__th assets-page__th--status">Status</th>
              <th class="assets-page__th assets-page__th--actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="asset in paginatedAssets"
              :key="asset.id"
              class="assets-page__row"
              :class="{ 'assets-page__row--observing': asset.status === 'observando' }"
            >
              <td class="assets-page__td">
                <div class="assets-page__code-cell">
                  <SvgIcon
                    name="grid"
                    class="assets-page__code-icon"
                    :size="18"
                  />
                  <span class="assets-page__code">{{ asset.codigo }}</span>
                  <span
                    v-if="asset.status === 'observando'"
                    class="assets-page__observing-badge"
                    title="Ativo está sendo observado"
                  >
                    <SvgIcon
                      name="eye"
                      :size="13"
                    />
                  </span>
                </div>
              </td>
              <td class="assets-page__td assets-page__td--name">
                {{ asset.nome || '-' }}
              </td>
              <td class="assets-page__td">
                <Badge
                  :label="asset.categoria"
                  :color="getCategoryColor(asset.categoria)"
                />
              </td>
              <td class="assets-page__td">
                <StatusBadge :status="asset.status" />
              </td>
              <td class="assets-page__td">
                <div class="assets-page__actions">
                  <ActionButton
                    variant="edit"
                    title="Editar ativo"
                    @click="openEditModal(asset)"
                  >
                    <SvgIcon
                      name="edit"
                      :size="16"
                    />
                  </ActionButton>

                  <ActionButton
                    v-if="asset.status === 'ativo'"
                    variant="pause"
                    title="Pausar ativo"
                    @click="openDeactivateModal(asset)"
                  >
                    <SvgIcon
                      name="pause"
                      :size="16"
                    />
                  </ActionButton>

                  <ActionButton
                    v-else
                    variant="play"
                    title="Ativar ativo"
                    @click="openActivateModal(asset)"
                  >
                    <SvgIcon
                      name="play"
                      :size="16"
                    />
                  </ActionButton>

                  <ActionButton
                    variant="observe"
                    title="Observar ativo"
                    @click="openObserveModal(asset)"
                  >
                    <SvgIcon
                      name="eye"
                      :size="16"
                    />
                  </ActionButton>

                  <ActionButton
                    variant="delete"
                    title="Deletar ativo"
                    @click="openDeleteModal(asset)"
                  >
                    <SvgIcon
                      name="trash"
                      :size="16"
                    />
                  </ActionButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="assets-page__pagination">
          <Pagination
            :current-page="currentPage"
            :last-page="totalPages"
            :total="filteredAssets.length"
            :per-page="perPage"
            :show-total="true"
            :show-page-info="false"
            @page-change="p => (currentPage = p)"
          >
            <template #totalLabel="{ total }">
              Total de ativos: <strong>{{ total }}</strong>
            </template>
          </Pagination>
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
        :message="`Deseja ativar o ativo ${selectedAsset?.codigo || ''}?`"
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
        :message="`Deseja pausar o ativo ${selectedAsset?.codigo || ''}?`"
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
        :message="`Deseja marcar o ativo ${selectedAsset?.codigo || ''} como observando?`"
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
        :message="`Deseja realmente deletar o ativo ${selectedAsset?.codigo || ''}?`"
        warning-message="Esta ação não pode ser desfeita."
        confirm-text="Deletar"
        loading-text="Deletando..."
        @close="closeModal('delete')"
        @confirm="handleDeleteAsset"
      />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import MainLayout from '@/components/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import AssetsFilterDrawer from '@/components/organisms/assets/AssetsFilterDrawer.vue'
import AddAssetModal from '@/components/organisms/assets/AddAssetModal.vue'
import EditAssetModal from '@/components/my-assets/EditAssetModal.vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import SvgIcon from '@/components/atoms/SvgIcon.vue'
import ActionButton from '@/components/atoms/ActionButton.vue'
import Badge from '@/components/atoms/Badge.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import EmptyState from '@/components/atoms/EmptyState.vue'
import Pagination from '@/components/atoms/Pagination.vue'
import { useAuthStore } from '@/stores/auth'
import assetService from '@/services/assetService'
import categoryService from '@/services/categoryService'

const authStore = useAuthStore()

const assets = ref([])
const categorias = ref([])
const categoryColors = ref({})
const loading = ref(false)
const filterOpen = ref(false)
const currentPage = ref(1)
const perPage = 10

const filters = ref({
  search: '',
  categoria: '',
  status: ''
})

const modals = ref({
  add: false,
  edit: false,
  delete: false,
  activate: false,
  deactivate: false,
  observe: false
})

const selectedAsset = ref(null)
const editCategoryColor = ref('')

const filteredAssets = computed(() => {
  let result = assets.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(
      a =>
        a.codigo.toLowerCase().includes(search) ||
        (a.nome && a.nome.toLowerCase().includes(search))
    )
  }

  if (filters.value.categoria) {
    result = result.filter(a => a.categoria === filters.value.categoria)
  }

  if (filters.value.status) {
    result = result.filter(a => a.status === filters.value.status)
  }

  return result
})

const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredAssets.value.slice(start, start + perPage)
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredAssets.value.length / perPage))
)

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.search) count++
  if (filters.value.categoria) count++
  if (filters.value.status) count++
  return count
})

watch(filters, () => { currentPage.value = 1 }, { deep: true })

async function fetchAssets() {
  loading.value = true
  try {
    const response = await assetService.getUserAssets()
    const data = response.data

    if (data?.ativos_por_categoria?.data) {
      const ativosPorCategoria = data.ativos_por_categoria.data
      assets.value = []
      Object.keys(ativosPorCategoria).forEach(categoria => {
        ativosPorCategoria[categoria].forEach(ativo => {
          assets.value.push({ ...ativo, categoria })
        })
      })
    } else if (Array.isArray(data?.data)) {
      assets.value = data.data
    } else if (Array.isArray(data)) {
      assets.value = data
    } else {
      assets.value = []
    }
  } catch {
    assets.value = []
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const response = await categoryService.getAll()
    if (response.data && Array.isArray(response.data.data)) {
      categorias.value = response.data.data.map(cat => ({
        id: cat.id,
        nome: cat.nome || cat.name || String(cat)
      }))
    }
  } catch {
    // silently fail
  }
}

async function fetchCategoryColors() {
  try {
    const userId = authStore.user?.id
    if (userId) {
      const res = await assetService.getCategoryColors(userId)
      categoryColors.value = res.data?.colors || {}
    }
  } catch {
    categoryColors.value = {}
  }
}

async function loadPage() {
  await Promise.all([fetchAssets(), fetchCategories()])
  await fetchCategoryColors()
}

function getCategoryColor(categoria) {
  if (categoryColors.value[categoria]) {
    return categoryColors.value[categoria]
  }
  const defaults = {
    Ações: '#ff6b35',
    FIIs: '#004e89'
  }
  return defaults[categoria] || '#6200EE'
}

function openAddModal() {
  modals.value.add = true
}

function openEditModal(asset) {
  selectedAsset.value = { ...asset }
  editCategoryColor.value = getCategoryColor(asset.categoria)
  modals.value.edit = true
}

function openDeleteModal(asset) {
  selectedAsset.value = { ...asset }
  modals.value.delete = true
}

function openActivateModal(asset) {
  selectedAsset.value = { ...asset }
  modals.value.activate = true
}

function openDeactivateModal(asset) {
  selectedAsset.value = { ...asset }
  modals.value.deactivate = true
}

function openObserveModal(asset) {
  selectedAsset.value = { ...asset }
  modals.value.observe = true
}

function closeModal(name) {
  modals.value[name] = false
}

async function handleAddAssets({ categoria, codigos }) {
  try {
    await assetService.createUserAssets({ [categoria]: codigos })
    await fetchAssets()
  } catch (err) {
    console.error('Erro ao adicionar ativos:', err)
  }
}

async function handleUpdateAsset(assetData) {
  const userId = authStore.user?.id
  if (!userId) return

  if (assetData.categoryColor && assetData.categoria) {
    const currentColor = categoryColors.value[assetData.categoria]
    if (assetData.categoryColor !== currentColor) {
      const newColors = {
        ...categoryColors.value,
        [assetData.categoria]: assetData.categoryColor
      }
      await assetService.updateCategoryColors(userId, newColors)
      categoryColors.value = newColors
    }
  }

  const index = assets.value.findIndex(a => a.id === assetData.id)
  if (index !== -1) {
    assets.value[index] = { ...assets.value[index], ...assetData }
  }
}

async function handleActivateAsset({ resolve, reject }) {
  try {
    await assetService.updateAssetStatus({
      ativo_id: selectedAsset.value.id,
      status: 'ativo'
    })
    const index = assets.value.findIndex(a => a.id === selectedAsset.value.id)
    if (index !== -1) assets.value[index].status = 'ativo'
    resolve()
  } catch (err) {
    reject(err)
  }
}

async function handleDeactivateAsset({ resolve, reject }) {
  try {
    await assetService.updateAssetStatus({
      ativo_id: selectedAsset.value.id,
      status: 'inativo'
    })
    const index = assets.value.findIndex(a => a.id === selectedAsset.value.id)
    if (index !== -1) assets.value[index].status = 'inativo'
    resolve()
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Erro ao desativar o ativo'
    reject(new Error(msg))
  }
}

async function handleObserveAsset({ resolve, reject }) {
  try {
    await assetService.updateAssetStatus({
      ativo_id: selectedAsset.value.id,
      status: 'observando'
    })
    const index = assets.value.findIndex(a => a.id === selectedAsset.value.id)
    if (index !== -1) assets.value[index].status = 'observando'
    resolve()
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Erro ao marcar ativo como observando'
    reject(new Error(msg))
  }
}

async function handleDeleteAsset({ resolve, reject }) {
  try {
    await assetService.deleteAsset(selectedAsset.value.id)
    assets.value = assets.value.filter(a => a.id !== selectedAsset.value.id)
    resolve()
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Erro ao deletar o ativo'
    reject(new Error(msg))
  }
}

function applyFilters(newFilters) {
  filters.value = { ...newFilters }
}

function resetFilters() {
  filters.value = { search: '', categoria: '', status: '' }
}

onMounted(() => {
  loadPage()
})
</script>

<style scoped>
.assets-page {
  max-width: 100%;
  animation: assets-fade-in 0.3s ease;
}

@keyframes assets-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.assets-page__filter-wrapper {
  position: relative;
  display: inline-flex;
}

.assets-page__filter-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  border: 2px solid white;
  z-index: 1;
  pointer-events: none;
}

.assets-page__empty-icon {
  width: 64px;
  height: 64px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.assets-page__table-wrapper {
  background: var(--surface);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.assets-page__table {
  width: 100%;
  border-collapse: collapse;
}

.assets-page__table thead {
  background: var(--bg-secondary);
  border-bottom: 2px solid var(--border);
}

.assets-page__th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.assets-page__th--code { width: 20%; }
.assets-page__th--name { width: 25%; }
.assets-page__th--category { width: 18%; }
.assets-page__th--status { width: 15%; }
.assets-page__th--actions { width: 22%; }

.assets-page__row {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}

.assets-page__row:hover {
  background: var(--bg-secondary);
}

.assets-page__row:last-child {
  border-bottom: none;
}

.assets-page__row--observing {
  background: linear-gradient(
    90deg,
    rgba(23, 162, 184, 0.05) 0%,
    transparent 100%
  );
  border-left: 3px solid #17a2b8;
}

.assets-page__row--observing:hover {
  background: linear-gradient(
    90deg,
    rgba(23, 162, 184, 0.1) 0%,
    transparent 100%
  );
}

.assets-page__td {
  padding: 1.125rem 1.25rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.assets-page__td--name {
  color: var(--text-secondary);
}

.assets-page__code-cell {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.assets-page__code-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.assets-page__code {
  font-weight: 600;
  font-family: 'Courier New', monospace;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.assets-page__observing-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  min-width: 24px;
  background: linear-gradient(135deg, #17a2b8, #138496);
  border-radius: 50%;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(23, 162, 184, 0.4);
  animation: assets-pulse 2s infinite;
}

@keyframes assets-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(23, 162, 184, 0.7);
  }

  50% {
    box-shadow: 0 0 0 5px rgba(23, 162, 184, 0);
  }
}

.assets-page__actions {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.assets-page__pagination {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border);
  background: var(--bg-secondary);
}

@media (max-width: 768px) {
  .assets-page__table-wrapper {
    overflow-x: auto;
  }

  .assets-page__table {
    min-width: 700px;
  }

  .assets-page__actions {
    flex-wrap: nowrap;
  }
}
</style>
