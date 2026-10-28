<template>
  <ConfirmationModal
    :is-open="isOpen"
    type="info"
    :title="`Proventos de ${title}`"
    size="large"
    @close="$emit('close')"
  >
    <LoadingSpinner
      v-if="loading"
      message=""
      size="32px"
    />
    <AlertMessage
      v-else-if="error"
      type="error"
      :message="error"
    />
    <p
      v-else-if="dividends.length === 0"
      class="dividends-period-modal__empty"
    >
      Nenhum provento neste período.
    </p>
    <div
      v-else
      class="dividends-period-modal__scroll"
    >
      <table class="dividends-period-modal__table">
        <thead>
          <tr>
            <th>Ativo</th>
            <th>Status</th>
            <th>Tipo</th>
            <th>Pagamento</th>
            <th class="dividends-period-modal__right">Líquido</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="dividend in dividends"
            :key="dividend.id"
          >
            <td>{{ dividend.asset.code }}</td>
            <td><DividendStatusBadge :status="dividend.status" /></td>
            <td>{{ formatDividendType(dividend.type) }}</td>
            <td>{{ formatDate(dividend.payment_date) }}</td>
            <td class="dividends-period-modal__right">
              {{
                formatCurrency(dividend.net_total, visibilityStore.valuesHidden)
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #footer>
      <button
        type="button"
        class="modal-footer__btn modal-footer__btn--info"
        @click="$emit('close')"
      >
        Fechar
      </button>
    </template>
  </ConfirmationModal>
</template>

<script setup lang="ts">
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import DividendStatusBadge from '@/components/atoms/DividendStatusBadge/index.vue'
import { useVisibilityStore } from '@/stores/visibility'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { formatDividendType } from '@/utils/dividendLabels'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  dividends: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits<{
  close: []
}>()

const visibilityStore = useVisibilityStore()
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
