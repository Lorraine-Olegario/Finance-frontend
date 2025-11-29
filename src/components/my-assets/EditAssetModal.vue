<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">
            <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar Ativo
          </h3>
          <button type="button" class="btn-close" @click="close" aria-label="Fechar"></button>
        </div>
        
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
          <div v-if="success" class="alert alert-success" role="alert">{{ success }}</div>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="codigo" class="form-label">Código</label>
              <input 
                id="codigo"
                v-model="formData.codigo" 
                type="text" 
                class="form-control"
                readonly
              />
            </div>

            <div class="mb-3">
              <label for="nome" class="form-label">Nome</label>
              <input 
                id="nome"
                v-model="formData.nome" 
                type="text" 
                class="form-control"
                placeholder="Nome do ativo"
              />
            </div>

            <div class="mb-3">
              <label for="status" class="form-label">Status</label>
              <select 
                id="status"
                v-model="formData.status" 
                class="form-select"
              >
                <option value="ativo">Ativo</option>
                <option value="observando">Observando</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">
                <svg class="icon-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="21.17" y1="8" x2="12" y2="8"></line>
                  <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                  <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                </svg>
                Cor da Categoria: {{ formData.categoria }}
              </label>
              <div class="color-picker-wrapper">
                <input 
                  v-model="formData.categoryColor" 
                  type="color" 
                  class="color-input"
                  :disabled="!formData.categoria"
                />
                <div class="color-preview" :style="{ backgroundColor: formData.categoryColor }">
                  <span class="color-value">{{ formData.categoryColor }}</span>
                </div>
                <button 
                  type="button" 
                  @click="resetColor" 
                  class="btn-reset-color"
                  :disabled="!formData.categoria"
                  title="Restaurar cor padrão"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                </button>
              </div>
              <small class="form-text">Esta cor será aplicada a todos os ativos desta categoria</small>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="close">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditAssetModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    asset: {
      type: Object,
      default: () => ({})
    },
    categoryColor: {
      type: String,
      default: '#6200EE'
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      formData: {
        id: null,
        codigo: '',
        nome: '',
        status: 'ativo',
        categoria: '',
        categoryColor: '#6200EE'
      },
      saving: false,
      error: '',
      success: ''
    }
  },
  methods: {
    close() {
      this.resetForm()
      this.$emit('close')
    },
    resetForm() {
      this.error = ''
      this.success = ''
      this.saving = false
    },
    resetColor() {
      const defaultColors = {
        'Ações': '#ff6b35',
        'FIIs': '#004e89'
      }
      this.formData.categoryColor = defaultColors[this.formData.categoria] || '#6200EE'
    },
    async handleSubmit() {
      this.error = ''
      this.success = ''
      this.saving = true
      
      try {
        await this.$emit('submit', {
          ...this.formData
        })
        
        this.success = 'Ativo atualizado com sucesso!'
        
        setTimeout(() => {
          this.close()
        }, 1500)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao atualizar ativo'
      } finally {
        this.saving = false
      }
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal && this.asset) {
        this.formData = {
          id: this.asset.id,
          codigo: this.asset.codigo,
          nome: this.asset.nome || '',
          status: this.asset.status || 'ativo',
          categoria: this.asset.categoria || '',
          categoryColor: this.categoryColor
        }
      } else {
        this.resetForm()
      }
    },
    categoryColor(newVal) {
      if (newVal) {
        this.formData.categoryColor = newVal
      }
    }
  }
}
</script>

<style scoped>
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-dialog {
  max-width: 500px;
  width: 100%;
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

.modal-content {
  background: var(--surface, #fff);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border, #e0e0e0);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary, #212529);
}

.modal-icon {
  width: 20px;
  height: 20px;
  color: var(--primary, #6200EE);
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-close::before {
  content: "×";
  font-size: 2rem;
  line-height: 1;
  color: var(--text-secondary, #6c757d);
}

.btn-close:hover {
  background-color: var(--background, #f5f5f5);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid var(--border, #e0e0e0);
}

.mb-3 {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary, #212529);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-label {
  width: 18px;
  height: 18px;
  color: var(--primary, #6200EE);
}

.form-select,
.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border, #e0e0e0);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--background, #fff);
  color: var(--text-primary, #212529);
  transition: all 0.2s;
}

.form-control:read-only {
  background: var(--surface, #f5f5f5);
  color: var(--text-secondary, #6c757d);
  cursor: not-allowed;
}

.form-select:focus,
.form-control:focus {
  outline: none;
  border-color: var(--primary, #6200EE);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.1);
}

.form-text {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary, #6c757d);
  margin-top: 0.5rem;
  font-style: italic;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-input {
  width: 60px;
  height: 45px;
  border: 2px solid var(--border, #e0e0e0);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  padding: 4px;
  transition: all 0.2s;
}

.color-input:hover {
  border-color: var(--primary, #6200EE);
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
  border: 2px solid var(--border, #e0e0e0);
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
  background: var(--surface, #f5f5f5);
  border: 2px solid var(--border, #e0e0e0);
  border-radius: 8px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary, #6c757d);
  transition: all 0.2s;
  padding: 0;
}

.btn-reset-color svg {
  width: 20px;
  height: 20px;
}

.btn-reset-color:hover:not(:disabled) {
  background: var(--border, #e0e0e0);
  color: var(--primary, #6200EE);
  transform: rotate(-180deg);
}

.btn-reset-color:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary, #6200EE) 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(98, 0, 238, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(98, 0, 238, 0.4);
}

.btn-secondary {
  background-color: var(--surface, #f5f5f5);
  color: var(--text-primary, #212529);
  border: 2px solid var(--border, #e0e0e0);
}

.btn-secondary:hover {
  background-color: var(--background, #e0e0e0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
  border-width: 0.2em;
}

.me-2 {
  margin-right: 0.5rem;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

@media (max-width: 576px) {
  .modal-dialog {
    max-width: 100%;
    margin: 0;
  }
  
  .modal-content {
    border-radius: 0;
    max-height: 100vh;
  }
}
</style>
