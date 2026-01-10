<template>
  <MainLayout page-title="Categorias">
    <div class="categories-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h2>Categorias de Ativos</h2>
          <p class="subtitle">
            Gerencie os tipos de ativos do sistema
          </p>
        </div>
        <button
          class="btn btn-add"
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
          Nova Categoria
        </button>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="loading-container"
      >
        <div class="spinner" />
        <p>Carregando categorias...</p>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="error-message"
      >
        <svg
          class="icon"
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
        <p>{{ error }}</p>
        <button
          class="btn"
          @click="fetchCategories"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Success Message -->
      <div
        v-if="success"
        class="success-message"
      >
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <p>{{ success }}</p>
      </div>

      <!-- Categories Grid -->
      <div
        v-else-if="categories.length > 0"
        class="categories-grid"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
        >
          <div class="category-header">
            <div
              class="category-color"
              :style="{ backgroundColor: category.color || '#6200EE' }"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <div class="category-info">
              <h3>{{ category.nome }}</h3>
              <p class="category-count">
                {{ category.ativos_count || 0 }} ativo(s)
              </p>
            </div>
          </div>
          <div class="category-actions">
            <button
              class="btn-icon"
              title="Editar"
              @click="openEditModal(category)"
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
              class="btn-icon btn-danger" 
              :disabled="category.ativos_count > 0"
              :title="category.ativos_count > 0 ? 'Não é possível excluir categoria com ativos' : 'Excluir'"
              @click="openDeleteModal(category)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="empty-state"
      >
        <div class="empty-icon-wrapper">
          <svg
            class="empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>
        <h3>Nenhuma categoria cadastrada</h3>
        <p>Adicione categorias para organizar seus ativos</p>
        <button
          class="btn"
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
          Criar Primeira Categoria
        </button>
      </div>

      <!-- Add/Edit Modal -->
      <div
        v-if="showModal"
        class="modal-overlay"
        @click="closeModal"
      >
        <div
          class="modal"
          @click.stop
        >
          <div class="modal-header">
            <h3>{{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}</h3>
            <button
              class="btn-close"
              @click="closeModal"
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
            <div class="form-group">
              <label>Nome da Categoria *</label>
              <input 
                v-model="formData.nome" 
                type="text" 
                placeholder="Ex: Ações, FIIs, Criptomoedas"
                class="form-input"
                @keyup.enter="saveCategory"
              >
            </div>
            <div class="form-group">
              <label>Cor</label>
              <div class="color-picker-group">
                <input 
                  v-model="formData.color" 
                  type="color" 
                  class="color-input"
                >
                <input 
                  v-model="formData.color" 
                  type="text" 
                  placeholder="#6200EE"
                  class="form-input"
                  maxlength="7"
                >
              </div>
            </div>
            <div
              v-if="error"
              class="modal-error"
            >
              {{ error }}
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn secondary"
              @click="closeModal"
            >
              Cancelar
            </button>
            <button
              class="btn"
              :disabled="saving || !formData.nome"
              @click="saveCategory"
            >
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        v-if="showDeleteModal"
        class="modal-overlay"
        @click="closeDeleteModal"
      >
        <div
          class="modal modal-small"
          @click.stop
        >
          <div class="modal-header">
            <h3>Confirmar Exclusão</h3>
            <button
              class="btn-close"
              @click="closeDeleteModal"
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
            <p>Tem certeza que deseja excluir a categoria <strong>{{ selectedCategory?.nome }}</strong>?</p>
            <p class="warning-text">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div class="modal-footer">
            <button
              class="btn secondary"
              @click="closeDeleteModal"
            >
              Cancelar
            </button>
            <button
              class="btn danger"
              :disabled="saving"
              @click="deleteCategory"
            >
              {{ saving ? 'Excluindo...' : 'Excluir' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout.vue'
import categoryService from '../services/categoryService'

export default {
  name: 'Categories',
  components: {
    MainLayout
  },
  data() {
    return {
      categories: [],
      loading: false,
      saving: false,
      error: '',
      success: '',
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedCategory: null,
      formData: {
        nome: '',
        color: '#6200EE'
      }
    }
  },
  mounted() {
    this.fetchCategories()
  },
  methods: {
    async fetchCategories() {
      this.loading = true
      this.error = ''
      try {
        const response = await categoryService.getAll()
        console.log('Response:', response.data) // Debug
        this.categories = response.data.data || response.data || []
      } catch (err) {
        console.error('Error fetching categories:', err) // Debug
        this.error = err.response?.data?.message || 'Erro ao carregar categorias'
      } finally {
        this.loading = false
      }
    },
    openAddModal() {
      this.isEditing = false
      this.selectedCategory = null
      this.formData = {
        nome: '',
        color: '#6200EE'
      }
      this.showModal = true
    },
    openEditModal(category) {
      this.isEditing = true
      this.selectedCategory = category
      this.formData = {
        nome: category.nome,
        color: category.color || '#6200EE'
      }
      this.showModal = true
    },
    openDeleteModal(category) {
      this.selectedCategory = category
      this.showDeleteModal = true
    },
    closeModal() {
      this.showModal = false
      this.error = ''
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.selectedCategory = null
    },
    async saveCategory() {
      if (!this.formData.nome.trim()) {
        this.error = 'O nome da categoria é obrigatório'
        return
      }

      this.saving = true
      this.error = ''
      this.success = ''
      try {
        console.log('Saving category:', this.formData) // Debug
        if (this.isEditing) {
          const response = await categoryService.update(this.selectedCategory.id, this.formData)
          console.log('Update response:', response.data) // Debug
          this.closeModal()
          this.success = 'Categoria atualizada com sucesso!'
        } else {
          const response = await categoryService.create(this.formData)
          console.log('Create response:', response.data) // Debug
          this.closeModal()
          this.success = 'Categoria criada com sucesso!'
        }
        await this.fetchCategories()
        setTimeout(() => { this.success = '' }, 5000)
      } catch (err) {
        console.error('Error saving category:', err) // Debug
        console.error('Error response:', err.response) // Debug
        if (err.response?.data?.errors) {
          // Erros de validação do Laravel
          const errors = Object.values(err.response.data.errors).flat()
          this.error = errors.join(', ')
        } else {
          this.error = err.response?.data?.message || 'Erro ao salvar categoria'
        }
      } finally {
        this.saving = false
      }
    },
    async deleteCategory() {
      this.saving = true
      this.error = ''
      this.success = ''
      try {
        await categoryService.delete(this.selectedCategory.id)
        this.closeDeleteModal()
        this.success = 'Categoria excluída com sucesso!'
        await this.fetchCategories()
        setTimeout(() => { this.success = '' }, 5000)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao excluir categoria'
        this.closeDeleteModal()
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.categories-page {
  padding: 0;
}

/* ===== HEADER ===== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--border);
}

.header-content h2 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(98, 0, 238, 0.2);
}

.btn-add .icon {
  width: 18px;
  height: 18px;
}

/* ===== MESSAGES ===== */
.error-message,
.success-message {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: var(--error);
}

.success-message {
  background: #efe;
  border: 1px solid #cfc;
  color: var(--success);
}

.error-message .icon,
.success-message .icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* ===== LOADING ===== */
.loading,
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== CATEGORIES GRID ===== */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.category-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.category-color {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-color svg {
  width: 24px;
  height: 24px;
  opacity: 0.9;
}

.category-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.category-count {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
}

.btn-icon:hover:not(:disabled) {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn-icon.btn-danger:hover:not(:disabled) {
  background: var(--danger);
  border-color: var(--danger);
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-icon svg {
  width: 18px;
  height: 18px;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
}

.empty-icon-wrapper {
  margin-bottom: 1.5rem;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.empty-state p {
  margin: 0 0 2rem 0;
  color: var(--text-secondary);
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
  z-index: 10000;
}

.modal {
  background: var(--surface);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-small {
  max-width: 400px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-close {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
}

.btn-close:hover {
  background: var(--background);
  color: var(--text-primary);
}

.btn-close svg {
  width: 18px;
  height: 18px;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.warning-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.modal-error {
  padding: 0.75rem 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: var(--danger);
  font-size: 0.875rem;
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  background: var(--background);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.1);
}

.color-picker-group {
  display: flex;
  gap: 0.75rem;
}

.color-input {
  width: 60px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  padding: 4px;
}

.color-picker-group .form-input {
  flex: 1;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.icon {
  width: 20px;
  height: 20px;
}

.btn.secondary {
  background: var(--background);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn.secondary:hover {
  background: var(--border);
  box-shadow: none;
}

.btn.danger {
  background: var(--danger);
}

.btn.danger:hover {
  background: #b91c1c;
}

@media (max-width: 768px) {
  .categories-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
