<template>
  <ConfirmationModal
    :is-open="isOpen"
    size="large"
    type="primary"
    :title="`Configurar Alerta — ${asset?.codigo ?? ''}`"
    @close="emit('close')"
  >
    <template #default>
      <AlertMessage
        v-if="validationError"
        type="error"
        :message="validationError"
        class="edit-alert-modal__error"
      />

      <div
        v-if="asset"
        class="edit-alert-modal__asset-info"
      >
        <div class="edit-alert-modal__info-item">
          <span class="edit-alert-modal__info-label">Código</span>
          <strong class="edit-alert-modal__info-value">
            {{ asset.codigo }}
          </strong>
        </div>
        <div
          v-if="asset.nome"
          class="edit-alert-modal__info-item"
        >
          <span class="edit-alert-modal__info-label">Nome</span>
          <span class="edit-alert-modal__info-value">{{ asset.nome }}</span>
        </div>
      </div>

      <div class="edit-alert-modal__grid">
        <div class="edit-alert-modal__field">
          <label
            for="eal-valor-min"
            class="edit-alert-modal__field-label"
          >
            Valor Mínimo (R$)
          </label>
          <input
            id="eal-valor-min"
            v-model.number="form.valor_min"
            type="number"
            step="0.01"
            min="0"
            class="edit-alert-modal__input"
            placeholder="Ex: 10,50"
          />
          <small class="edit-alert-modal__hint">
            Notificar quando o valor cair abaixo deste limite
          </small>
        </div>

        <div class="edit-alert-modal__field">
          <label
            for="eal-valor-max"
            class="edit-alert-modal__field-label"
          >
            Valor Máximo (R$)
          </label>
          <input
            id="eal-valor-max"
            v-model.number="form.valor_max"
            type="number"
            step="0.01"
            min="0"
            class="edit-alert-modal__input"
            placeholder="Ex: 50,00"
          />
          <small class="edit-alert-modal__hint">
            Notificar quando o valor ultrapassar este limite
          </small>
        </div>
      </div>

      <label class="edit-alert-modal__checkbox-row">
        <input
          v-model="form.notificar_valor_min"
          type="checkbox"
          class="edit-alert-modal__checkbox"
        />
        <span>Notificar ao atingir valor mínimo</span>
      </label>

      <label class="edit-alert-modal__checkbox-row">
        <input
          v-model="form.notificar_valor_max"
          type="checkbox"
          class="edit-alert-modal__checkbox"
        />
        <span>Notificar ao atingir valor máximo</span>
      </label>

      <div class="edit-alert-modal__grid">
        <div class="edit-alert-modal__field">
          <label
            for="eal-frequencia"
            class="edit-alert-modal__field-label"
          >
            Frequência de Notificação
          </label>
          <select
            id="eal-frequencia"
            v-model="form.frequencia"
            class="edit-alert-modal__select"
          >
            <option value="todas_as_vezes">Todas as vezes</option>
            <option value="diario">Diário</option>
            <option value="semanal">Semanal</option>
          </select>
        </div>

        <div class="edit-alert-modal__field">
          <label
            for="eal-status"
            class="edit-alert-modal__field-label"
          >
            Status do Alerta
          </label>
          <select
            id="eal-status"
            v-model="form.status"
            class="edit-alert-modal__select"
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>
    </template>

    <template #footer>
      <button
        type="button"
        class="edit-alert-modal__btn edit-alert-modal__btn--cancel"
        @click="emit('close')"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="edit-alert-modal__btn edit-alert-modal__btn--save"
        @click="handleSubmit"
      >
        <SvgIcon
          name="check-circle"
          :size="18"
        />
        Salvar Alerta
      </button>
    </template>
  </ConfirmationModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  asset: { type: Object, default: null }
})

const emit = defineEmits(['close', 'save'])

const validationError = ref('')

const defaultForm = () => ({
  valor_min: null,
  valor_max: null,
  notificar_valor_min: false,
  notificar_valor_max: false,
  frequencia: 'todas_as_vezes',
  status: 'ativo'
})

const form = ref(defaultForm())

watch(
  () => props.isOpen,
  isOpen => {
    if (!isOpen) return
    validationError.value = ''
    const existing = props.asset?.alert ?? null
    if (existing) {
      form.value = {
        valor_min: existing.valor_min ?? null,
        valor_max: existing.valor_max ?? null,
        notificar_valor_min: existing.notificar_valor_min ?? false,
        notificar_valor_max: existing.notificar_valor_max ?? false,
        frequencia: existing.frequencia ?? 'todas_as_vezes',
        status: existing.status ?? 'ativo'
      }
    } else {
      form.value = defaultForm()
    }
  }
)

function handleSubmit() {
  validationError.value = ''

  if (!form.value.valor_min && !form.value.valor_max) {
    validationError.value = 'Configure pelo menos um valor (mínimo ou máximo).'
    return
  }

  if (form.value.valor_min && !form.value.notificar_valor_min) {
    validationError.value =
      'Valor mínimo definido, ative a notificação para receber alertas.'
    return
  }

  if (form.value.valor_max && !form.value.notificar_valor_max) {
    validationError.value =
      'Valor máximo definido, ative a notificação para receber alertas.'
    return
  }

  emit('save', {
    ativo_id: props.asset?.id,
    ...form.value
  })
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
