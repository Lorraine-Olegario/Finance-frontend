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
          <strong class="edit-alert-modal__info-value">{{ asset.codigo }}</strong>
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
import ConfirmationModal from '@/components/organisms/ConfirmationModal.vue'
import AlertMessage from '@/components/atoms/AlertMessage.vue'
import SvgIcon from '@/components/atoms/SvgIcon.vue'

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

<style scoped>
.edit-alert-modal__error {
  margin-bottom: 1.25rem;
}

.edit-alert-modal__asset-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem 1.25rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.edit-alert-modal__info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.edit-alert-modal__info-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.edit-alert-modal__info-value {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.edit-alert-modal__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.edit-alert-modal__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.edit-alert-modal__field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.edit-alert-modal__input,
.edit-alert-modal__select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.9375rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.2s;
}

.edit-alert-modal__input:focus,
.edit-alert-modal__select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.08);
  background: var(--bg-primary);
}

.edit-alert-modal__hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.edit-alert-modal__checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 0.75rem;
  transition: background 0.2s;
}

.edit-alert-modal__checkbox-row:hover {
  background: var(--bg-hover);
}

.edit-alert-modal__checkbox-row span {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.edit-alert-modal__checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary);
  flex-shrink: 0;
}

/* Rendered inside ConfirmationModal's .modal-footer (display: flex, gap: 0.75rem) */
.edit-alert-modal__btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
}

.edit-alert-modal__btn--cancel {
  background: var(--surface);
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.edit-alert-modal__btn--cancel:hover {
  background: var(--bg-hover);
}

.edit-alert-modal__btn--save {
  background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.edit-alert-modal__btn--save:hover {
  box-shadow: 0 6px 20px rgba(98, 0, 238, 0.4);
  transform: translateY(-2px);
}

@media (max-width: 576px) {
  .edit-alert-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>
