<template>
  <FilterDrawer
    :is-open="isOpen"
    title="Filtrar Ativos"
    @close="emit('close')"
    @apply="handleApply"
    @reset="handleReset"
  >
    <div class="assets-filter-drawer">
      <div class="assets-filter-drawer__group">
        <label class="assets-filter-drawer__label">Buscar por código</label>
        <BaseInput
          v-model="localFilters.search"
          placeholder="Ex: PETR4, VALE3..."
        />
      </div>

      <div class="assets-filter-drawer__group">
        <label class="assets-filter-drawer__label">Categoria</label>
        <BaseSelect
          v-model="localFilters.categoria"
          :options="categoriaOptions"
          placeholder="Todas as categorias"
        />
      </div>

      <div class="assets-filter-drawer__group">
        <label class="assets-filter-drawer__label">Status</label>
        <BaseSelect
          v-model="localFilters.status"
          :options="statusOptions"
          placeholder="Todos os status"
        />
      </div>
    </div>
  </FilterDrawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FilterDrawer from '@/components/organisms/FilterDrawer/index.vue'
import BaseInput from '@/components/atoms/BaseInput/index.vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  filters: {
    type: Object,
    default: () => ({ search: '', categoria: '', status: '' })
  },
  categorias: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'apply', 'reset'])

const localFilters = ref({ ...props.filters })

const categoriaOptions = computed(() =>
  props.categorias.map(cat => ({
    value: cat.nome ?? cat,
    label: cat.nome ?? cat
  }))
)

const statusOptions = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'observando', label: 'Observando' },
  { value: 'inativo', label: 'Inativo' }
]

watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) {
      localFilters.value = { ...props.filters }
    }
  }
)

function handleApply() {
  emit('apply', { ...localFilters.value })
  emit('close')
}

function handleReset() {
  localFilters.value = { search: '', categoria: '', status: '' }
  emit('apply', { ...localFilters.value })
  emit('reset')
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
