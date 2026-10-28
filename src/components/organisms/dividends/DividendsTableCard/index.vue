<template>
  <DividendsCard
    title="Meus proventos"
    :loading="loading"
    :error="error"
    :empty="false"
    @retry="$emit('retry')"
  >
    <template #actions>
      <BaseSelect
        :model-value="year"
        :options="yearOptions"
        placeholder="Todos os anos"
        aria-label="Ano"
        @update:model-value="$emit('update:year', $event)"
      />
      <span class="dividends-table__total">
        Total:
        <strong>{{ money(total?.net_total ?? 0) }}</strong>
      </span>
    </template>

    <EmptyState
      v-if="dividends.length === 0"
      title="Nenhum provento encontrado"
      description="Cadastre suas compras para acompanhar seus proventos."
    />
    <div
      v-else
      class="dividends-table__scroll"
    >
      <table class="dividends-table__table">
        <thead>
          <tr>
            <th
              v-for="column in COLUMNS"
              :key="column.label"
              :class="{ 'dividends-table__right': column.right }"
            >
              <button
                v-if="column.sort"
                type="button"
                class="dividends-table__sort"
                @click="$emit('sort', column.sort)"
              >
                {{ column.label }}{{ arrow(column.sort) }}
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="dividend in dividends"
            :key="dividend.id"
          >
            <td>
              <span class="dividends-table__asset">
                <span class="dividends-table__avatar">
                  {{ dividend.asset.code.slice(0, 2) }}
                </span>
                {{ dividend.asset.code }}
              </span>
            </td>
            <td>
              <span class="dividends-table__category">
                {{ dividend.asset_category.name || '—' }}
              </span>
            </td>
            <td><DividendStatusBadge :status="dividend.status" /></td>
            <td>{{ formatDividendType(dividend.type) }}</td>
            <td>{{ formatDate(dividend.com_date) }}</td>
            <td>{{ formatDate(dividend.payment_date) }}</td>
            <td class="dividends-table__right">
              {{ formatQuantity(dividend.quantity) }}
            </td>
            <td class="dividends-table__right">
              {{ money(dividend.value_per_share) }}
            </td>
            <td class="dividends-table__right">
              {{ money(dividend.gross_total) }}
            </td>
            <td class="dividends-table__right dividends-table__strong">
              {{ money(dividend.net_total) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      v-if="pagination"
      :current-page="pagination.page"
      :last-page="pagination.last_page"
      :total="pagination.total_items"
      :per-page="pagination.per_page"
      :show-page-info="true"
      @page-change="$emit('page-change', $event)"
    >
      <template #totalLabel="{ total: totalItems }">
        Total de proventos:
        <strong>{{ totalItems }}</strong>
      </template>
    </Pagination>
  </DividendsCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DividendsCard from '@/components/molecules/DividendsCard/index.vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'
import Pagination from '@/components/atoms/Pagination/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import DividendStatusBadge from '@/components/atoms/DividendStatusBadge/index.vue'
import { useVisibilityStore } from '@/stores/visibility'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { formatDividendType } from '@/utils/dividendLabels'

const COLUMNS = [
  { label: 'Ativo', sort: 'asset' },
  { label: 'Tipo de ativo', sort: 'asset_category' },
  { label: 'Status do pagamento' },
  { label: 'Tipo de pagamento', sort: 'type' },
  { label: 'Data Com', sort: 'com_date' },
  { label: 'Data Pagamento', sort: 'payment_date' },
  { label: 'Quantidade', sort: 'quantity', right: true },
  { label: 'Valor do div.', sort: 'value_per_share', right: true },
  { label: 'Valor total', sort: 'gross_total', right: true },
  { label: 'Total líquido', sort: 'net_total', right: true }
]

const YEARS_BACK = 6

const props = defineProps({
  dividends: {
    type: Array,
    default: () => []
  },
  total: {
    type: Object,
    default: null
  },
  // { page, per_page, total_items, last_page } devolvido pelo back
  pagination: {
    type: Object,
    default: null
  },
  year: {
    type: [String, Number],
    default: ''
  },
  sort: {
    type: String,
    default: 'payment_date'
  },
  direction: {
    type: String,
    default: 'desc',
    validator: (value: string) => ['asc', 'desc'].includes(value)
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
  retry: []
  'update:year': [year: string]
  sort: [column: string]
  'page-change': [page: number]
}>()

const visibilityStore = useVisibilityStore()

const yearOptions = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: YEARS_BACK }, (_, index) => ({
    value: current + 1 - index,
    label: String(current + 1 - index)
  }))
})

function money(value) {
  return formatCurrency(value, visibilityStore.valuesHidden)
}

function formatQuantity(value) {
  return Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 8 })
}

function arrow(column) {
  if (props.sort !== column) return ''
  return props.direction === 'asc' ? ' ↑' : ' ↓'
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
