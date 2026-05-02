<template>
  <FilterDrawer
    :is-open="isOpen"
    title="Filtros"
    @close="emit('close')"
    @apply="handleApply"
    @reset="handleReset"
  >
    <div class="quotes-filter-drawer">
      <div class="quotes-filter-drawer__group">
        <label class="quotes-filter-drawer__label">Buscar Ativo</label>
        <BaseInput
          v-model="localFilters.search"
          placeholder="Digite o código ou nome..."
        />
      </div>

      <div class="quotes-filter-drawer__group">
        <label class="quotes-filter-drawer__label">Variação</label>
        <BaseSelect
          v-model="localFilters.variacao"
          :options="variacaoOptions"
        />
      </div>

      <div class="quotes-filter-drawer__group">
        <label class="quotes-filter-drawer__label">Ordenar Por</label>
        <BaseSelect
          v-model="localFilters.sortBy"
          :options="sortByOptions"
        />
      </div>

      <div class="quotes-filter-drawer__group">
        <label class="quotes-filter-drawer__label">Ordem</label>
        <BaseSelect
          v-model="localFilters.sortOrder"
          :options="sortOrderOptions"
        />
      </div>
    </div>
  </FilterDrawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FilterDrawer from '@/components/organisms/FilterDrawer/index.vue'
import BaseInput from '@/components/atoms/BaseInput/index.vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  filters: {
    type: Object,
    default: () => ({
      search: '',
      variacao: '',
      sortBy: 'codigo',
      sortOrder: 'asc',
    }),
  },
})

const emit = defineEmits<{
  close: []
  apply: [filters: Record<string, unknown>]
  reset: []
}>()

const localFilters = ref({ ...props.filters })

watch(
  () => props.filters,
  newFilters => {
    localFilters.value = { ...newFilters }
  },
  { deep: true }
)

const variacaoOptions = [
  { value: '', label: 'Todas' },
  { value: 'positive', label: 'Positiva' },
  { value: 'negative', label: 'Negativa' }
]

const sortByOptions = [
  { value: 'codigo', label: 'Código' },
  { value: 'preco', label: 'Preço' },
  { value: 'variacao', label: 'Variação' },
  { value: 'volume', label: 'Volume' }
]

const sortOrderOptions = [
  { value: 'asc', label: 'Crescente' },
  { value: 'desc', label: 'Decrescente' }
]

function handleApply() {
  emit('apply', { ...localFilters.value })
  emit('close')
}

function handleReset() {
  localFilters.value = {
    search: '',
    variacao: '',
    sortBy: 'codigo',
    sortOrder: 'asc'
  }
  emit('apply', { ...localFilters.value })
  emit('reset')
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
