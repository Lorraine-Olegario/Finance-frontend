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
      <AlertMessage
        v-if="error"
        type="error"
        :message="error"
        :dismissible="true"
        class="edit-asset-modal__alert"
        @dismiss="error = ''"
      />
      <AlertMessage
        v-if="success"
        type="success"
        :message="success"
        :dismissible="true"
        class="edit-asset-modal__alert"
        @dismiss="success = ''"
      />

      <form
        class="edit-asset-modal__form"
        @submit.prevent="handleSubmit"
      >
        <FormField
          label="Código"
          field-id="edit-asset-codigo"
        >
          <BaseInput
            id="edit-asset-codigo"
            v-model="formData.codigo"
            type="text"
            readonly
          />
        </FormField>

        <FormField
          label="Nome"
          field-id="edit-asset-nome"
        >
          <BaseInput
            id="edit-asset-nome"
            v-model="formData.nome"
            type="text"
            readonly
          />
        </FormField>

        <FormField
          :label="`Cor da Categoria: ${formData.categoria?.nome || ''}`"
          hint="Esta cor será aplicada a todos os ativos desta categoria."
        >
          <template #icon>
            <!-- prettier-ignore -->
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="4" /> <line x1="21.17" y1="8" x2="12" y2="8" /> <line x1="3.95" y1="6.06" x2="8.54" y2="14" /> <line x1="10.88" y1="21.94" x2="15.46" y2="14" /> </svg>
          </template>

          <div class="edit-asset-modal__color-row">
            <span
              class="edit-asset-modal__swatch"
              :style="{ backgroundColor: formData.color }"
            />
            <input
              v-model="formData.color"
              type="color"
              class="edit-asset-modal__color-picker"
              :disabled="!formData.categoria"
              aria-label="Selecionar cor da categoria"
            />
            <span class="edit-asset-modal__color-value">
              {{ formData.color }}
            </span>
            <button
              type="button"
              class="edit-asset-modal__reset-btn"
              :disabled="!formData.categoria"
              title="Restaurar cor padrão"
              @click="resetColor"
            >
              <SvgIcon
                name="refresh"
                :size="16"
              />
            </button>
          </div>
        </FormField>
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

<script setup lang="ts">
// ── Imports ──────────────────────────────────────────────────────────────────
import { ref, watch } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import FormField from '@/components/molecules/FormField/index.vue'
import BaseInput from '@/components/atoms/BaseInput/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'

const DEFAULT_COLOR = '#6200EE'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  asset: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits<{
  close: []
  submit: [payload: { category_id: number | string | undefined; color: string }]
}>()

// ── State ────────────────────────────────────────────────────────────────────
const formData = ref({
  id: null,
  codigo: '',
  nome: '',
  status: 'ativo',
  categoria: '',
  color: DEFAULT_COLOR
})
const saving = ref(false)
const error = ref('')
const success = ref('')

// ── Watchers ─────────────────────────────────────────────────────────────────
watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen && props.asset) {
      formData.value = {
        id: props.asset.id,
        codigo: props.asset.codigo,
        nome: props.asset.nome || '',
        status: props.asset.status || 'ativo',
        categoria: props.asset.categoria || '',
        color: props.asset.color || DEFAULT_COLOR
      }
    } else {
      resetForm()
    }
  }
)

// ── Functions ────────────────────────────────────────────────────────────────
function close() {
  resetForm()
  emit('close')
}

function resetForm() {
  error.value = ''
  success.value = ''
  saving.value = false
}

function resetColor() {
  formData.value.color = DEFAULT_COLOR
}

function handleSubmit() {
  error.value = ''
  success.value = ''
  saving.value = true

  try {
    emit('submit', {
      category_id: formData.value.categoria?.id,
      color: formData.value.color
    })

    success.value = 'Cor atualizada com sucesso!'

    setTimeout(() => {
      close()
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao atualizar cor'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
