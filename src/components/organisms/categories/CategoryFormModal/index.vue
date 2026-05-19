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
        <label class="category-form-modal__label">Nome da Categoria *</label>
        <BaseInput
          v-model="form.name"
          type="text"
          placeholder="Ex: Ações, FIIs, Criptomoedas"
          required
        />
      </div>

      <div class="category-form-modal__field">
        <label class="category-form-modal__label">Cor</label>
        <div class="category-form-modal__color-row">
          <div
            class="category-form-modal__swatch"
            :style="{ backgroundColor: form.default_color }"
          />
          <input
            v-model="form.default_color"
            type="color"
            class="category-form-modal__color-picker"
          />
          <BaseInput
            v-model="form.default_color"
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

<script setup lang="ts">
import { ref, watch } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import BaseInput from '@/components/atoms/BaseInput/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  category: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits<{
  close: []
  submit: [payload: Record<string, unknown>]
}>()

const DEFAULT_COLOR = '#6200EE'

const form = ref({ id: null, name: '', default_color: DEFAULT_COLOR })
const formError = ref('')
const saving = ref(false)

watch(
  () => props.isOpen,
  open => {
    if (open) {
      form.value = {
        id: props.category?.id ?? null,
        name: props.category?.name ?? '',
        default_color: props.category?.default_color ?? DEFAULT_COLOR
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
  let id = form.value.id
  let name = form.value.name.trim()
  let color = form.value.default_color || DEFAULT_COLOR

  if (!name) {
    formError.value = 'O nome da categoria é obrigatório'
    return
  }

  if (!color) {
    formError.value = 'A cor da categoria é obrigatória'
    return
  }

  formError.value = ''
  saving.value = true
  new Promise((resolve, reject) => {
    emit('submit', {
      id: id,
      name: name,
      default_color: color,
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

<style scoped lang="scss">
@use './styles.module';
</style>
