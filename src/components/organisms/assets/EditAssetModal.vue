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
            for="codigo"
            class="form-label fw-semibold"
          >
            Código
          </label>
          <input
            id="codigo"
            v-model="formData.codigo"
            type="text"
            class="form-control"
            readonly
          />
        </div>

        <div class="mb-3">
          <label
            for="nome"
            class="form-label fw-semibold"
          >
            Nome
          </label>
          <input
            id="nome"
            v-model="formData.nome"
            type="text"
            class="form-control"
            readonly
          />
        </div>

        <!-- Status não editável neste modal; permitimos apenas alteração da cor da categoria -->
        <div class="mb-3">
          <label class="form-label fw-semibold d-flex align-items-center gap-2">
            <!-- prettier-ignore -->
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="4" /> <line x1="21.17" y1="8" x2="12" y2="8" /> <line x1="3.95" y1="6.06" x2="8.54" y2="14" /> <line x1="10.88" y1="21.94" x2="15.46" y2="14" /> </svg>
            Cor da Categoria: {{ formData.categoria }}
          </label>
          <div class="d-flex align-items-center gap-2">
            <input
              v-model="formData.categoryColor"
              type="color"
              class="form-control form-control-color"
              :disabled="!formData.categoria"
              style="width: 60px; height: 45px"
            />
            <div
              class="flex-grow-1 rounded-2 border p-2 text-center fw-semibold"
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
              class="btn btn-outline-secondary"
              :disabled="!formData.categoria"
              title="Restaurar cor padrão"
              style="width: 45px; height: 45px; padding: 0"
              @click="resetColor"
            >
              <!-- prettier-ignore -->
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <polyline points="1 4 1 10 7 10" /> <polyline points="23 20 23 14 17 14" /> <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /> </svg>
            </button>
          </div>
          <small class="form-text text-muted fst-italic">
            Esta cor será aplicada a todos os ativos desta categoria
          </small>
        </div>
      </form>
    </template>

    <template #footer>
      <button
        type="button"
        class="btn btn-secondary"
        @click="close"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="saving"
        @click="handleSubmit"
      >
        <span
          v-if="saving"
          class="spinner-border spinner-border-sm me-2"
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
