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

<script setup>
import { ref, watch } from 'vue'
import FilterDrawer from '@/components/organisms/FilterDrawer.vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  filters: {
    type: Object,
    default: () => ({ search: '', categoria: '', hasAlert: '' })
  },
  categories: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'apply', 'reset'])

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

<style scoped>
.observed-filter-drawer__group {
  margin-bottom: 1.5rem;
}

.observed-filter-drawer__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.observed-filter-drawer__input,
.observed-filter-drawer__select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.2s;
}

.observed-filter-drawer__input:focus,
.observed-filter-drawer__select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.08);
  background: var(--bg-primary);
}

.observed-filter-drawer__input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}
</style>
