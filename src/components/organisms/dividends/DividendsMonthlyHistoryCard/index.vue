<template>
  <DividendsCard
    title="Histórico mensal"
    :loading="loading"
    :error="error"
    :empty="rows.length === 0"
    @retry="$emit('retry')"
  >
    <template #actions>
      <SegmentedControl
        :model-value="status"
        :options="STATUS_OPTIONS"
        @update:model-value="$emit('update:status', $event)"
      />
      <span class="dividends-history__total">
        Total:
        <strong>{{ money(grandTotal) }}</strong>
      </span>
    </template>

    <div class="dividends-history__scroll">
      <table class="dividends-history__table">
        <thead>
          <tr>
            <th>
              <button
                type="button"
                class="dividends-history__sort"
                @click="toggleSort('year')"
              >
                Ano{{ arrow('year') }}
              </button>
            </th>
            <th
              v-for="month in MONTH_LABELS"
              :key="month"
              class="dividends-history__right"
            >
              {{ month }}
            </th>
            <th class="dividends-history__right">
              <button
                type="button"
                class="dividends-history__sort"
                @click="toggleSort('average')"
              >
                Média{{ arrow('average') }}
              </button>
              <SvgIcon
                name="info"
                :size="12"
                label="Total do ano dividido pelos meses decorridos (12 em anos passados)"
              />
            </th>
            <th class="dividends-history__right">
              <button
                type="button"
                class="dividends-history__sort"
                @click="toggleSort('total')"
              >
                Total{{ arrow('total') }}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in sortedRows"
            :key="row.year"
          >
            <td class="dividends-history__year">{{ row.year }}</td>
            <td
              v-for="(value, index) in row.months"
              :key="index"
              class="dividends-history__right"
            >
              {{ value > 0 ? money(value) : '—' }}
            </td>
            <td class="dividends-history__right">{{ money(row.average) }}</td>
            <td class="dividends-history__right dividends-history__strong">
              {{ money(row.total) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </DividendsCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DividendsCard from '@/components/molecules/DividendsCard/index.vue'
import SegmentedControl from '@/components/molecules/SegmentedControl/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import { useVisibilityStore } from '@/stores/visibility'
import { formatCurrency } from '@/utils/formatCurrency'
import { MONTH_LABELS } from '@/utils/dividendLabels'

const STATUS_OPTIONS = [
  { value: 'received', label: 'Recebidos' },
  { value: 'pending', label: 'A receber' },
  { value: 'all', label: 'Todos' }
]

const props = defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  status: {
    type: String,
    required: true,
    validator: (value: string) => ['received', 'pending', 'all'].includes(value)
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
  'update:status': [status: string]
}>()

const visibilityStore = useVisibilityStore()
const sortKey = ref('year')
const sortDirection = ref('desc')

const sortedRows = computed(() => {
  const direction = sortDirection.value === 'asc' ? 1 : -1
  return [...props.rows].sort(
    (a, b) => (a[sortKey.value] - b[sortKey.value]) * direction
  )
})

const grandTotal = computed(() =>
  props.rows.reduce((sum, row) => sum + row.total, 0)
)

function money(value) {
  return formatCurrency(value, visibilityStore.valuesHidden)
}

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    return
  }
  sortKey.value = key
  sortDirection.value = 'desc'
}

function arrow(key) {
  if (sortKey.value !== key) return ''
  return sortDirection.value === 'asc' ? ' ↑' : ' ↓'
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
