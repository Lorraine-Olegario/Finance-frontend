<template>
  <ConfirmationModal
    :is-open="isOpen"
    type="info"
    title="Distribuição de proventos em 12 meses"
    @close="$emit('close')"
  >
    <table class="dividends-distribution-modal__table">
      <thead>
        <tr>
          <th>Ativo</th>
          <th class="dividends-distribution-modal__right">Total</th>
          <th class="dividends-distribution-modal__right">%</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.asset.id"
        >
          <td>{{ item.asset.code }}</td>
          <td class="dividends-distribution-modal__right">
            {{ formatCurrency(item.total, visibilityStore.valuesHidden) }}
          </td>
          <td class="dividends-distribution-modal__right">
            {{
              item.percent.toLocaleString('pt-BR', {
                minimumFractionDigits: 2
              })
            }}%
          </td>
        </tr>
      </tbody>
    </table>

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
import { useVisibilityStore } from '@/stores/visibility'
import { formatCurrency } from '@/utils/formatCurrency'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  items: {
    type: Array,
    default: () => []
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
