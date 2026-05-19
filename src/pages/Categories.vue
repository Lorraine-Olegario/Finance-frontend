<template>
  <MainLayout page-title="Categorias">
    <div class="categories-page">
      <PageHeader
        title="Categorias de Ativos"
        subtitle="Gerencie os tipos de ativos do sistema"
      >
        <template #actions>
          <BaseButton @click="openAdd">
            <template #icon-left>
              <SvgIcon
                name="plus"
                :size="18"
              />
            </template>
            Nova Categoria
          </BaseButton>
        </template>
      </PageHeader>

      <AlertMessage
        v-if="alert.message"
        :type="alert.type"
        :message="alert.message"
        :dismissible="true"
        class="categories-page__alert"
        @dismiss="alert.message = ''"
      />

      <LoadingSpinner
        v-if="loading"
        message="Carregando categorias..."
      />

      <EmptyState
        v-else-if="categories.length === 0"
        title="Nenhuma categoria cadastrada"
        description="Adicione categorias para organizar seus ativos"
      >
        <template #icon>
          <SvgIcon
            name="pie-chart"
            :size="64"
            class="categories-page__empty-icon"
          />
        </template>
        <template #action>
          <BaseButton @click="openAdd">
            <template #icon-left>
              <SvgIcon
                name="plus"
                :size="18"
              />
            </template>
            Criar Primeira Categoria
          </BaseButton>
        </template>
      </EmptyState>

      <div
        v-else
        class="categories-page__grid"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          class="categories-page__card"
        >
          <div class="categories-page__card-header">
            <div
              class="categories-page__swatch"
              :style="{ backgroundColor: category.color || '#6200EE' }"
            >
              <SvgIcon
                name="trending-up"
                :size="22"
                class="categories-page__swatch-icon"
              />
            </div>
            <div class="categories-page__card-info">
              <h3 class="categories-page__card-name">
                {{ category.name }}
              </h3>
              <span class="categories-page__card-count">
                {{ category.assets_count || 0 }} ativo(s)
              </span>
            </div>
          </div>

          <div class="categories-page__card-actions">
            <ActionButton
              variant="edit"
              title="Editar"
              @click="openEdit(category)"
            >
              <SvgIcon
                name="edit"
                :size="16"
              />
            </ActionButton>
            <ActionButton
              variant="delete"
              :title="
                category.assets_count > 0
                  ? 'Não é possível excluir categoria com ativos'
                  : 'Excluir'
              "
              :disabled="category.assets_count > 0"
              @click="openDelete(category)"
            >
              <SvgIcon
                name="trash"
                :size="16"
              />
            </ActionButton>
          </div>
        </div>
      </div>

      <CategoryFormModal
        :is-open="showFormModal"
        :category="selectedCategory"
        @close="closeFormModal"
        @submit="handleSubmit"
      />

      <ConfirmationModal
        :is-open="showDeleteModal"
        type="danger"
        title="Confirmar Exclusão"
        :message="`Tem certeza que deseja excluir a categoria ${selectedCategory?.name || ''}?`"
        :warning-message="
          (selectedCategory?.assets_count || 0) > 0
            ? 'Esta categoria possui ativos vinculados e não pode ser excluída.'
            : 'Esta ação não pode ser desfeita.'
        "
        confirm-text="Excluir"
        loading-text="Excluindo..."
        @close="closeDeleteModal"
        @confirm="handleDelete"
      />
    </div>
  </MainLayout>
</template>

<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref, onMounted } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import ActionButton from '@/components/atoms/ActionButton/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import CategoryFormModal from '@/components/organisms/categories/CategoryFormModal/index.vue'
import categoryService from '@/services/categoryService'

const categories = ref([])
const loading = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const selectedCategory = ref(null)
const alert = ref({ type: 'success', message: '' })

onMounted(loadCategories)

function showAlert(type, message) {
  alert.value = { type, message }
  setTimeout(() => {
    alert.value.message = ''
  }, 3500)
}

function openAdd() {
  selectedCategory.value = null
  showFormModal.value = true
}

function openEdit(category) {
  selectedCategory.value = category
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  selectedCategory.value = null
}

function openDelete(category) {
  selectedCategory.value = category
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedCategory.value = null
}

async function loadCategories() {
  loading.value = true

  try {
    const response = await categoryService.getAll()
    categories.value = []

    if (response.data?.categories && Array.isArray(response.data.categories)) {
      categories.value = response.data.categories
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Erro ao carregar categorias'
    )
  } finally {
    loading.value = false
  }
}

async function handleSubmit({ id, name, default_color, resolve, reject }) {
  try {
    if (selectedCategory.value) {
      await categoryService.update(selectedCategory.value.id, { id, name, default_color })
      showAlert('success', 'Categoria atualizada com sucesso!')
    } else {
      await categoryService.create({ name, default_color })
      showAlert('success', 'Categoria criada com sucesso!')
    }
    await loadCategories()
    resolve()
  } catch (err) {
    if (err.response?.data?.errors) {
      const msg = Object.values(err.response.data.errors).flat().join(', ')
      reject(new Error(msg))
      return
    }
    reject(new Error(err.response?.data?.message || 'Erro ao salvar categoria'))
  }
}

async function handleDelete({ resolve, reject }) {
  try {
    await categoryService.delete(selectedCategory.value.id)
    closeDeleteModal()
    showAlert('success', 'Categoria excluída com sucesso!')
    await loadCategories()
    resolve()
  } catch (err) {
    reject(
      new Error(err.response?.data?.message || 'Erro ao excluir categoria')
    )
  }
}
</script>

<style scoped>
.categories-page {
  padding: 0;
}

.categories-page__alert {
  margin-bottom: 1.5rem;
}

.categories-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.categories-page__card {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.categories-page__card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.categories-page__card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.categories-page__swatch {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.categories-page__swatch-icon {
  color: white;
  opacity: 0.9;
}

.categories-page__card-info {
  min-width: 0;
}

.categories-page__card-name {
  margin: 0 0 0.25rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.categories-page__card-count {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.categories-page__card-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  margin-left: 1rem;
}

.categories-page__empty-icon {
  color: var(--text-secondary);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .categories-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
