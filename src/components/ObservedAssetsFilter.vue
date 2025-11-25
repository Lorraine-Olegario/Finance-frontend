<template>
  <FilterSidebar 
    :is-open="isOpen" 
    title="Filtrar Ativos" 
    @close="$emit('close')" 
    @apply="applyFilters" 
    @reset="resetFilters"
  >
    <FilterSection label="Buscar por código">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </template>
      <input 
        v-model="localFilters.search" 
        type="text" 
        placeholder="Ex: PETR4, VALE3..."
        class="filter-input"
      />
    </FilterSection>

    <FilterSection label="Categoria">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      </template>
      <select v-model="localFilters.categoria" class="filter-select">
        <option value="">Todas as categorias</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </FilterSection>

    <FilterSection label="Status do Alerta">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </template>
      <select v-model="localFilters.hasAlert" class="filter-select">
        <option value="">Todos os alertas</option>
        <option value="with">Com alerta configurado</option>
        <option value="without">Sem alerta</option>
      </select>
    </FilterSection>
  </FilterSidebar>
</template>

<script>
import FilterSidebar from './FilterSidebar.vue'
import FilterSection from './FilterSection.vue'

export default {
  name: 'ObservedAssetsFilter',
  components: {
    FilterSidebar,
    FilterSection
  },
  props: {
    isOpen: { type: Boolean, default: false },
    filters: {
      type: Object,
      default: () => ({
        search: '',
        categoria: '',
        hasAlert: ''
      })
    },
    categories: { type: Array, default: () => [] },
    resultCount: { type: Number, default: 0 }
  },
  data() {
    return {
      localFilters: { ...this.filters }
    }
  },
  watch: {
    filters: {
      deep: true,
      handler(newFilters) {
        this.localFilters = { ...newFilters }
      }
    }
  },
  methods: {
    applyFilters() {
      this.$emit('apply', this.localFilters)
      this.$emit('close')
    },
    resetFilters() {
      this.localFilters = {
        search: '',
        categoria: '',
        hasAlert: ''
      }
      this.$emit('apply', this.localFilters)
    }
  }
}
</script>

<style scoped>
.filter-input,
.filter-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.875rem;
  background: var(--background);
  color: var(--text-primary);
  transition: all 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.08);
}

.filter-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.6;
}

.filter-results {
  flex: 1;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
}
</style>
