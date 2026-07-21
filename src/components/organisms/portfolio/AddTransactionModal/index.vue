<template>
  <ConfirmationModal
    :is-open="isOpen"
    type="primary"
    :title="transaction ? 'Editar Transação' : 'Nova Transação'"
    size="medium"
    @close="handleClose"
  >
    <div class="add-transaction-modal">
      <AlertMessage
        v-if="error"
        type="error"
        :message="error"
        :dismissible="true"
        @dismiss="error = ''"
      />

      <div class="add-transaction-modal__type-toggle">
        <button
          type="button"
          class="add-transaction-modal__type-btn add-transaction-modal__type-btn--buy"
          :class="{
            'add-transaction-modal__type-btn--active': formData.type === 'buy'
          }"
          @click="formData.type = 'buy'"
        >
          <SvgIcon
            name="trending-up"
            :size="16"
          />
          Compra
        </button>
        <button
          type="button"
          class="add-transaction-modal__type-btn add-transaction-modal__type-btn--sell"
          :class="{
            'add-transaction-modal__type-btn--active': formData.type === 'sell'
          }"
          @click="formData.type = 'sell'"
        >
          <SvgIcon
            name="trending-down"
            :size="16"
          />
          Venda
        </button>
      </div>

      <FormField
        label="Código do Ativo"
        required
        :error="fieldErrors.asset_code"
      >
        <template #default="{ fieldId }">
          <BaseInput
            :id="fieldId"
            v-model="formData.asset_code"
            placeholder="Ex: PETR4"
            maxlength="10"
            @input="formData.asset_code = formData.asset_code.toUpperCase()"
          />
        </template>
      </FormField>

      <div class="add-transaction-modal__grid">
        <FormField
          label="Quantidade"
          required
          :error="fieldErrors.quantity"
        >
          <template #default="{ fieldId }">
            <BaseInput
              :id="fieldId"
              v-model="formData.quantity"
              type="number"
              min="0"
              step="any"
              placeholder="0"
            />
          </template>
        </FormField>

        <FormField
          label="Preço Unitário (R$)"
          required
          :error="fieldErrors.unit_price"
        >
          <template #default="{ fieldId }">
            <BaseInput
              :id="fieldId"
              v-model="formData.unit_price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
            />
          </template>
        </FormField>
      </div>

      <FormField
        label="Data da Transação"
        required
        :error="fieldErrors.transaction_date"
      >
        <template #default="{ fieldId }">
          <BaseInput
            :id="fieldId"
            v-model="formData.transaction_date"
            type="date"
            :max="today"
          />
        </template>
      </FormField>

      <p
        v-if="estimatedTotal !== null"
        class="add-transaction-modal__total"
      >
        Total estimado:
        <strong>{{ formattedTotal }}</strong>
      </p>
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
        {{ transaction ? 'Salvar Alterações' : 'Registrar' }}
      </BaseButton>
    </template>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import BaseInput from '@/components/atoms/BaseInput/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import FormField from '@/components/molecules/FormField/index.vue'
import { formatCurrency } from '@/utils/formatCurrency'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  transaction: {
    type: Object,
    default: null
  }
})

const emit = defineEmits<{
  close: []
  submit: [
    payload: Record<string, unknown>,
    resolve: () => void,
    reject: (err: Error) => void
  ]
}>()

const today = new Date().toISOString().slice(0, 10)

function defaultForm() {
  if (props.transaction) {
    return {
      asset_code: props.transaction.asset_code,
      type: props.transaction.type,
      quantity: String(props.transaction.quantity),
      unit_price: String(props.transaction.unit_price),
      transaction_date: props.transaction.transaction_date
    }
  }
  return {
    asset_code: '',
    type: 'buy',
    quantity: '',
    unit_price: '',
    transaction_date: today
  }
}

const formData = ref(defaultForm())
const saving = ref(false)
const error = ref('')
const fieldErrors = ref({})

const estimatedTotal = computed(() => {
  const quantity = Number(formData.value.quantity)
  const unitPrice = Number(formData.value.unit_price)
  if (!quantity || !unitPrice) return null
  return quantity * unitPrice
})

const formattedTotal = computed(() => formatCurrency(estimatedTotal.value))

watch(
  () => props.isOpen,
  isOpen => {
    if (!isOpen) return
    formData.value = defaultForm()
    error.value = ''
    fieldErrors.value = {}
    saving.value = false
  }
)

function validateLocal() {
  fieldErrors.value = {}

  if (!formData.value.asset_code.trim()) {
    fieldErrors.value.asset_code = 'Informe o código do ativo'
  }
  if (!formData.value.quantity || Number(formData.value.quantity) <= 0) {
    fieldErrors.value.quantity = 'Quantidade deve ser maior que zero'
  }
  if (!formData.value.unit_price || Number(formData.value.unit_price) <= 0) {
    fieldErrors.value.unit_price = 'Preço deve ser maior que zero'
  }
  if (!formData.value.transaction_date) {
    fieldErrors.value.transaction_date = 'Informe a data da transação'
  } else if (formData.value.transaction_date > today) {
    fieldErrors.value.transaction_date = 'Data não pode ser futura'
  }

  return Object.keys(fieldErrors.value).length === 0
}

function handleClose() {
  if (saving.value) return
  emit('close')
}

async function handleSubmit() {
  error.value = ''
  if (!validateLocal()) return

  const payload = {
    asset_code: formData.value.asset_code.trim().toUpperCase(),
    type: formData.value.type,
    quantity: Number(formData.value.quantity),
    unit_price: Number(formData.value.unit_price),
    transaction_date: formData.value.transaction_date
  }

  saving.value = true
  try {
    await new Promise((resolve, reject) => {
      emit('submit', payload, resolve, reject)
    })
    handleClose()
  } catch (err) {
    error.value = err.message || 'Erro ao registrar transação.'
    if (err.fieldErrors) fieldErrors.value = err.fieldErrors
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
