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
            Cor da Categoria: {{ formData.categoria.nome }}
          </label>
          <div class="edit-asset-modal__color-row">
            <input
              v-model="formData.color"
              type="color"
              class="edit-asset-modal__color-picker"
              :disabled="!formData.categoria"
            />
            <div
              class="edit-asset-modal__color-preview"
              :style="{
                backgroundColor: formData.color,
                color: 'white',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }"
            >
              {{ formData.color }}
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
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'

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
        color: '#6200EE'
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
          color: this.asset.color || '#6200EE'
        }
      } else {
        this.resetForm()
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
      this.formData.color = '#6200EE'
    },
    async handleSubmit() {
      this.error = ''
      this.success = ''
      this.saving = true

      try {
        this.$emit('submit', {
          category_id: this.formData.categoria?.id,
          color: this.formData.color
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

<style scoped lang="scss">
@use './styles.module';
</style>
