<template>
  <div
    v-if="isOpen"
    class="modal fade show d-block"
    tabindex="-1"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-bottom">
          <h5 class="modal-title d-flex align-items-center gap-2">
            <svg
              width="20"
              height="20"
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
          </h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="close"
          />
        </div>

        <div class="modal-body">
          <div
            v-if="error"
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {{ error }}
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="error = ''"
            />
          </div>
          <div
            v-if="success"
            class="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {{ success }}
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="success = ''"
            />
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label
                for="categoria"
                class="form-label fw-semibold"
              >Categoria</label>
              <select
                id="categoria"
                v-model="formData.categoria"
                class="form-select"
                required
              >
                <option value="">
                  Selecione uma categoria
                </option>
                <option
                  v-for="cat in categorias"
                  :key="cat"
                  :value="cat"
                >
                  {{ cat }}
                </option>
              </select>
              <div
                v-if="categorias.length === 0"
                class="form-text text-warning"
              >
                ⚠️ Nenhuma categoria disponível. Verifique a conexão com o servidor.
              </div>
            </div>

            <div class="mb-3">
              <label
                for="codigos"
                class="form-label fw-semibold"
              >
                Códigos dos Ativos
                <small class="text-muted fw-normal">(separados por vírgula)</small>
              </label>
              <input
                id="codigos"
                v-model="formData.codigos"
                type="text"
                class="form-control"
                placeholder="Ex: PETR4, VALE3, ITUB4"
                required
              >
              <div class="form-text">
                Digite os códigos dos ativos separados por vírgula
              </div>
            </div>

            <div class="modal-footer border-top pt-3 mt-3 px-0">
              <button
                type="button"
                class="btn btn-secondary"
                @click="close"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="saving"
              >
                <span
                  v-if="saving"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                {{ saving ? 'Salvando...' : 'Adicionar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="isOpen"
    class="modal-backdrop fade show"
  />
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
  watch: {
    isOpen(newVal) {
      if (!newVal) {
        this.resetForm()
      }
    },
    categorias: {
      handler(newVal) {
        // Categorias atualizadas
      },
      immediate: true
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
</style>
