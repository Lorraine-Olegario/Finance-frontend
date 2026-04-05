<template>
  <ConfirmationModal
    :is-open="isOpen"
    size="small"
    type="primary"
    :title="category ? 'Editar Categoria' : 'Nova Categoria'"
    @close="handleClose"
  >
    <div class="category-form-modal">
      <div class="category-form-modal__field">
        <label class="category-form-modal__label">
          Nome da Categoria *
        </label>
        <BaseInput
          v-model="form.nome"
          type="text"
          placeholder="Ex: Ações, FIIs, Criptomoedas"
          required
        />
      </div>

      <div class="category-form-modal__field">
        <label class="category-form-modal__label">
          Cor
        </label>
        <div class="category-form-modal__color-row">
          <div
            class="category-form-modal__swatch"
            :style="{ backgroundColor: form.color }"
          />
          <input
            v-model="form.color"
            type="color"
            class="category-form-modal__color-picker"
          />
          <BaseInput
            v-model="form.color"
            type="text"
            placeholder="#6200EE"
            maxlength="7"
          />
        </div>
      </div>

      <div
        v-if="formError"
        class="category-form-modal__error"
      >
        {{ formError }}
      </div>
    </div>

    <template #footer>
      <BaseButton
        variant="secondary"
        class="category-form-modal__footer-btn"
        :disabled="saving"
        @click="handleClose"
      >
        Cancelar
      </BaseButton>
      <BaseButton
        variant="primary"
        class="category-form-modal__footer-btn"
        :loading="saving"
        @click="handleSubmit"
      >
        {{ category ? 'Salvar' : 'Criar' }}
      </BaseButton>
    </template>
  </ConfirmationModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  category: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit'])

const DEFAULT_COLOR = '#6200EE'

const form = ref({ nome: '', color: DEFAULT_COLOR })
const formError = ref('')
const saving = ref(false)

watch(
  () => props.isOpen,
  open => {
    if (open) {
      form.value = {
        nome: props.category?.nome ?? '',
        color: props.category?.color ?? DEFAULT_COLOR
      }
      formError.value = ''
      saving.value = false
    }
  }
)

function handleClose() {
  if (saving.value) return
  emit('close')
}

function handleSubmit() {
  if (!form.value.nome.trim()) {
    formError.value = 'O nome da categoria é obrigatório'
    return
  }
  formError.value = ''
  saving.value = true
  new Promise((resolve, reject) => {
    emit('submit', {
      nome: form.value.nome.trim(),
      color: form.value.color,
      resolve,
      reject
    })
  })
    .then(() => {
      saving.value = false
      emit('close')
    })
    .catch(err => {
      saving.value = false
      formError.value = err.message || 'Erro ao salvar categoria'
    })
}
</script>

<style scoped>
.category-form-modal {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.category-form-modal__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.category-form-modal__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.category-form-modal__color-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-form-modal__swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--border);
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.category-form-modal__color-picker {
  width: 44px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 3px;
  cursor: pointer;
  background: var(--bg-secondary);
  flex-shrink: 0;
  outline: none;
}

.category-form-modal__color-row :deep(.base-input) {
  flex: 1;
}

.category-form-modal__error {
  padding: 0.75rem 1rem;
  background: rgba(176, 0, 32, 0.08);
  border: 1px solid rgba(176, 0, 32, 0.25);
  border-radius: 8px;
  color: var(--error);
  font-size: 0.875rem;
}

.category-form-modal__footer-btn {
  flex: 1;
}
</style>
