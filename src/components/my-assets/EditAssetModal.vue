<template>
  <div v-if="isOpen" class="modal fade show d-block" tabindex="-1" @click.self="close">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-bottom">
          <h5 class="modal-title d-flex align-items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar Ativo
          </h5>
          <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ error }}
            <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
          </div>
          <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
            {{ success }}
            <button type="button" class="btn-close" @click="success = ''" aria-label="Close"></button>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="codigo" class="form-label fw-semibold">Código</label>
              <input 
                id="codigo"
                v-model="formData.codigo" 
                type="text" 
                class="form-control"
                readonly
              />
            </div>

            <div class="mb-3">
              <label for="nome" class="form-label fw-semibold">Nome</label>
              <input 
                id="nome"
                v-model="formData.nome" 
                type="text" 
                class="form-control"
                placeholder="Nome do ativo"
              />
            </div>

            <div class="mb-3">
              <label for="status" class="form-label fw-semibold">Status</label>
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
              <label class="form-label fw-semibold d-flex align-items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="21.17" y1="8" x2="12" y2="8"></line>
                  <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                  <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                </svg>
                Cor da Categoria: {{ formData.categoria }}
              </label>
              <div class="d-flex align-items-center gap-2">
                <input 
                  v-model="formData.categoryColor" 
                  type="color" 
                  class="form-control form-control-color"
                  :disabled="!formData.categoria"
                  style="width: 60px; height: 45px;"
                />
                <div class="flex-grow-1 rounded-2 border p-2 text-center fw-semibold" 
                     :style="{ backgroundColor: formData.categoryColor, color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }">
                  {{ formData.categoryColor }}
                </div>
                <button 
                  type="button" 
                  @click="resetColor" 
                  class="btn btn-outline-secondary"
                  :disabled="!formData.categoria"
                  title="Restaurar cor padrão"
                  style="width: 45px; height: 45px; padding: 0;"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <polyline points="23 20 23 14 17 14"></polyline>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                  </svg>
                </button>
              </div>
              <small class="form-text text-muted fst-italic">Esta cor será aplicada a todos os ativos desta categoria</small>
            </div>

            <div class="modal-footer border-top pt-3 mt-3 px-0">
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
  <div v-if="isOpen" class="modal-backdrop fade show"></div>
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
/* Minimal custom CSS - using Bootstrap classes */
.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title svg {
  color: var(--bs-primary, #0d6efd);
}

.gap-2 {
  gap: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
}

.btn-outline-secondary:hover {
  transform: rotate(-180deg);
  transition: transform 0.3s ease;
}
</style>
