<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">
            <svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Adicionar Ativos
          </h3>
          <button type="button" class="btn-close" @click="close" aria-label="Fechar"></button>
        </div>
        
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
          <div v-if="success" class="alert alert-success" role="alert">{{ success }}</div>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="categoria" class="form-label">Categoria</label>
              <select 
                id="categoria" 
                v-model="formData.categoria" 
                class="form-select"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="codigos" class="form-label">
                Códigos dos Ativos 
                <small class="text-muted">(separados por vírgula)</small>
              </label>
              <input 
                id="codigos"
                v-model="formData.codigos" 
                type="text" 
                class="form-control"
                placeholder="Ex: PETR4, VALE3, ITUB4"
                required
              />
              <div class="form-text">
                Digite os códigos dos ativos separados por vírgula
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="close">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ saving ? 'Salvando...' : 'Adicionar' }}
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
  name: 'AddAssetModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    categorias: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      formData: {
        categoria: '',
        codigos: ''
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
      this.formData = {
        categoria: '',
        codigos: ''
      }
      this.error = ''
      this.success = ''
      this.saving = false
    },
    async handleSubmit() {
      this.error = ''
      this.success = ''
      
      if (!this.formData.categoria) {
        this.error = 'Selecione uma categoria'
        return
      }

      if (!this.formData.codigos.trim()) {
        this.error = 'Digite pelo menos um código de ativo'
        return
      }

      const codigos = this.formData.codigos
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(s => s.length > 0)

      if (codigos.length === 0) {
        this.error = 'Digite pelo menos um código de ativo válido'
        return
      }

      this.saving = true
      
      try {
        await this.$emit('submit', {
          categoria: this.formData.categoria,
          codigos
        })
        
        this.success = 'Ativos adicionados com sucesso!'
        
        setTimeout(() => {
          this.close()
        }, 1500)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao adicionar ativos'
      } finally {
        this.saving = false
      }
    }
  },
  watch: {
    isOpen(newVal) {
      if (!newVal) {
        this.resetForm()
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

.form-select:focus,
.form-control:focus {
  outline: none;
  border-color: var(--primary, #6200EE);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.1);
}

.form-text {
  font-size: 0.875rem;
  color: var(--text-secondary, #6c757d);
  margin-top: 0.25rem;
}

.text-muted {
  color: var(--text-secondary, #6c757d);
  font-weight: 400;
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
