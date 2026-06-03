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
          <span class="add-asset-modal__label-hint">
            (separados por vírgula)
          </span>
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  categorias: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits<{
  close: []
  submit: [payload: Record<string, unknown>]
}>()

const formData = ref({ categoria: '', codigos: '' })
const saving = ref(false)
const error = ref('')
const success = ref('')

const categoriaOptions = computed(() =>
  props.categorias.map(cat => ({
    value: cat.name,
    label: cat.name
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

<style scoped lang="scss">
@use './styles.module';
</style>
