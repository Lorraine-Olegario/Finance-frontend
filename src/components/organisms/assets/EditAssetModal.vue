<template>
  <ConfirmationModal
    :is-open="isOpen"
    type="primary"
    title="Editar Ativo"
    :message="''"
    warning-message=""
    confirm-text="Salvar Alterações"
    loading-text="Salvando..."
    @close="close"
  >
    <template #default>
      <div
        v-if="error"
        class="edit-asset-modal__alert edit-asset-modal__alert--error"
        role="alert"
      >
        {{ error }}
        <button
          type="button"
          class="edit-asset-modal__alert-close"
          aria-label="Close"
          @click="error = ''"
        />
      </div>
      <div
        v-if="success"
        class="edit-asset-modal__alert edit-asset-modal__alert--success"
        role="alert"
      >
        {{ success }}
        <button
          type="button"
          class="edit-asset-modal__alert-close"
          aria-label="Close"
          @click="success = ''"
        />
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="edit-asset-modal__field">
          <label
            for="codigo"
            class="edit-asset-modal__label"
          >
            Código
          </label>
          <input
            id="codigo"
            v-model="formData.codigo"
            type="text"
            class="edit-asset-modal__input"
            readonly
          />
        </div>

        <div class="edit-asset-modal__field">
          <label
            for="nome"
            class="edit-asset-modal__label"
          >
            Nome
          </label>
          <input
            id="nome"
            v-model="formData.nome"
            type="text"
            class="edit-asset-modal__input"
            readonly
          />
        </div>

        <!-- Status não editável neste modal; permitimos apenas alteração da cor da categoria -->
        <div class="edit-asset-modal__field">
          <label class="edit-asset-modal__label edit-asset-modal__label--with-icon">
            <!-- prettier-ignore -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="4" /> <line x1="21.17" y1="8" x2="12" y2="8" /> <line x1="3.95" y1="6.06" x2="8.54" y2="14" /> <line x1="10.88" y1="21.94" x2="15.46" y2="14" /> </svg>
            Cor da Categoria: {{ formData.categoria }}
          </label>
          <div class="edit-asset-modal__color-row">
            <input
              v-model="formData.categoryColor"
              type="color"
              class="edit-asset-modal__color-picker"
              :disabled="!formData.categoria"
            />
            <div
              class="edit-asset-modal__color-preview"
              :style="{
                backgroundColor: formData.categoryColor,
                color: 'white',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }"
            >
              {{ formData.categoryColor }}
            </div>
            <button
              type="button"
              class="edit-asset-modal__reset-btn"
              :disabled="!formData.categoria"
              title="Restaurar cor padrão"
              @click="resetColor"
            >
              <!-- prettier-ignore -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <polyline points="1 4 1 10 7 10" /> <polyline points="23 20 23 14 17 14" /> <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /> </svg>
            </button>
          </div>
          <small class="edit-asset-modal__hint">
            Esta cor será aplicada a todos os ativos desta categoria
          </small>
        </div>
      </form>
    </template>

    <template #footer>
      <button
        type="button"
        class="edit-asset-modal__btn edit-asset-modal__btn--cancel"
        @click="close"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="edit-asset-modal__btn edit-asset-modal__btn--submit"
        :disabled="saving"
        @click="handleSubmit"
      >
        <span
          v-if="saving"
          class="edit-asset-modal__spinner"
          role="status"
          aria-hidden="true"
        />
        {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
      </button>
    </template>
  </ConfirmationModal>
</template>

<script>
import ConfirmationModal from '@/components/organisms/ConfirmationModal.vue'

export default {
  name: 'EditAssetModal',
  components: {
    ConfirmationModal
  },
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
      this.formData.categoryColor = '#6200EE'
    },
    async handleSubmit() {
      this.error = ''
      this.success = ''
      this.saving = true

      try {
        this.$emit('submit', {
          categoria: this.formData.categoria,
          categoryColor: this.formData.categoryColor
        })

        this.success = 'Cor atualizada com sucesso!'

        setTimeout(() => {
          this.close()
        }, 1500)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao atualizar cor'
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.edit-asset-modal__field {
  margin-bottom: 1rem;
}

.edit-asset-modal__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.edit-asset-modal__label--with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-asset-modal__input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.edit-asset-modal__color-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-asset-modal__color-picker {
  width: 60px;
  height: 45px;
  padding: 2px 4px;
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.edit-asset-modal__color-preview {
  flex: 1;
  border-radius: 6px;
  border: 1px solid var(--border);
  padding: 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.edit-asset-modal__reset-btn {
  width: 45px;
  height: 45px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.edit-asset-modal__reset-btn:hover {
  transform: rotate(-180deg);
}

.edit-asset-modal__hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

.edit-asset-modal__alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.edit-asset-modal__alert--error {
  background: rgba(176, 0, 32, 0.08);
  border: 1px solid rgba(176, 0, 32, 0.25);
  color: var(--error);
}

.edit-asset-modal__alert--success {
  background: rgba(0, 200, 83, 0.1);
  border: 1px solid rgba(0, 200, 83, 0.3);
  color: var(--success);
}

.edit-asset-modal__alert-close {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: currentColor;
  border-radius: 4px;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1;
  flex-shrink: 0;
}

.edit-asset-modal__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: inherit;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-asset-modal__btn--cancel {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.edit-asset-modal__btn--submit {
  background-color: var(--primary);
  color: white;
}

.edit-asset-modal__btn--submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(98, 0, 238, 0.3);
}

.edit-asset-modal__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.edit-asset-modal__spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
