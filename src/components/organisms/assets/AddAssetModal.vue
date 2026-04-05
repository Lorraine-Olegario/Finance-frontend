<template>
  <ConfirmationModal
    :is-open="isOpen"
    type="primary"
    title="Adicionar Ativos"
    size="medium"
    @close="handleClose"
  >
    <div class="add-asset-modal">
      <AlertMessage
        v-if="error"
        type="error"
        :message="error"
        :dismissible="true"
        @dismiss="error = ''"
      />
      <AlertMessage
        v-if="success"
        type="success"
        :message="success"
        :dismissible="true"
        @dismiss="success = ''"
      />

      <div class="add-asset-modal__field">
        <label class="add-asset-modal__label">Categoria</label>
        <BaseSelect
          v-model="formData.categoria"
          :options="categoriaOptions"
          placeholder="Selecione uma categoria"
          :required="true"
        />
        <p
          v-if="categorias.length === 0"
          class="add-asset-modal__hint add-asset-modal__hint--warning"
        >
          Nenhuma categoria disponível. Verifique a conexão com o servidor.
        </p>
      </div>

      <div class="add-asset-modal__field">
        <label class="add-asset-modal__label">
          Códigos dos Ativos
          <span class="add-asset-modal__label-hint">(separados por vírgula)</span>
        </label>
        <textarea
          v-model="formData.codigos"
          class="add-asset-modal__textarea"
          placeholder="Ex: PETR4, VALE3, ITUB4"
          rows="3"
        />
        <p class="add-asset-modal__hint">
          Digite os códigos dos ativos separados por vírgula
        </p>
      </div>
    </div>

    <template #footer>
      <BaseButton
        variant="secondary"
        :disabled="saving"
        @click="handleClose"
      >
        Cancelar
      </BaseButton>
      <BaseButton
        variant="primary"
        :loading="saving"
        @click="handleSubmit"
      >
        Adicionar
      </BaseButton>
    </template>
  </ConfirmationModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal.vue'
import AlertMessage from '@/components/atoms/AlertMessage.vue'
import BaseSelect from '@/components/atoms/BaseSelect.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  categorias: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({ categoria: '', codigos: '' })
const saving = ref(false)
const error = ref('')
const success = ref('')

const categoriaOptions = computed(() =>
  props.categorias.map(cat => ({
    value: cat.nome ?? cat,
    label: cat.nome ?? cat
  }))
)

watch(
  () => props.isOpen,
  isOpen => {
    if (!isOpen) resetForm()
  }
)

function resetForm() {
  formData.value = { categoria: '', codigos: '' }
  error.value = ''
  success.value = ''
  saving.value = false
}

function handleClose() {
  if (saving.value) return
  resetForm()
  emit('close')
}

async function handleSubmit() {
  error.value = ''
  success.value = ''

  if (!formData.value.categoria) {
    error.value = 'Selecione uma categoria'
    return
  }

  if (!formData.value.codigos.trim()) {
    error.value = 'Digite pelo menos um código de ativo'
    return
  }

  const codigos = formData.value.codigos
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(s => s.length > 0)

  if (codigos.length === 0) {
    error.value = 'Digite pelo menos um código de ativo válido'
    return
  }

  saving.value = true
  try {
    emit('submit', { categoria: formData.value.categoria, codigos })
    success.value = 'Ativos adicionados com sucesso!'
    setTimeout(() => {
      handleClose()
    }, 1000)
  } catch {
    error.value = 'Erro ao adicionar ativos, tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.add-asset-modal {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.add-asset-modal__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-asset-modal__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-asset-modal__label-hint {
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.add-asset-modal__textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.875rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  outline: none;
  resize: vertical;
  font-family: inherit;
}

.add-asset-modal__textarea::placeholder {
  color: var(--text-secondary);
}

.add-asset-modal__textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.08);
  background: var(--bg-primary);
}

.add-asset-modal__hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
}

.add-asset-modal__hint--warning {
  color: var(--accent-yellow);
}
</style>
