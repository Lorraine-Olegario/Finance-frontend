<template>
  <FilterDrawer
    :is-open="isOpen"
    title="Filtrar Ativos Observados"
    @close="emit('close')"
    @apply="handleApply"
    @reset="handleReset"
  >
    <div class="observed-filter-drawer__group">
      <label
        for="ofd-search"
        class="observed-filter-drawer__label"
      >
        Buscar por código ou nome
      </label>
      <input
        id="ofd-search"
        v-model="localFilters.search"
        type="text"
        class="observed-filter-drawer__input"
        placeholder="Ex: PETR4, VALE3..."
      />
    </div>

    <div class="observed-filter-drawer__group">
      <label
        for="ofd-categoria"
        class="observed-filter-drawer__label"
      >
        Categoria
      </label>
      <select
        id="ofd-categoria"
        v-model="localFilters.categoria"
        class="observed-filter-drawer__select"
      >
        <option value="">Todas as categorias</option>
        <option
          v-for="cat in categories"
          :key="cat"
          :value="cat"
        >
          {{ cat }}
        </option>
      </select>
    </div>

    <div class="observed-filter-drawer__group">
      <label
        for="ofd-has-alert"
        class="observed-filter-drawer__label"
      >
        Status do Alerta
      </label>
      <select
        id="ofd-has-alert"
        v-model="localFilters.hasAlert"
        class="observed-filter-drawer__select"
      >
        <option value="">Todos os alertas</option>
        <option value="with">Com alerta configurado</option>
        <option value="without">Sem alerta</option>
      </select>
    </div>
  </FilterDrawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FilterDrawer from '@/components/organisms/FilterDrawer/index.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  filters: {
    type: Object,
    default: () => ({
      search: '',
      categoria: '',
      hasAlert: '',
    }),
  },
  categories: {
    type: Array,
    default: () => [],
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
  newVal => {
    localFilters.value = { ...newVal }
  },
  { deep: true }
)

function handleApply() {
  emit('apply', { ...localFilters.value })
  emit('close')
}

function handleReset() {
  localFilters.value = { search: '', categoria: '', hasAlert: '' }
  emit('apply', { ...localFilters.value })
  emit('reset')
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
