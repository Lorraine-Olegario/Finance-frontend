<template>
  <FilterSidebar :is-open="isOpen" title="Filtros" @close="$emit('close')" @apply="applyFilters" @reset="resetFilters">
    <FilterSection label="Buscar Ativo">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </template>
      <input 
        type="text" 
        v-model="localFilters.search"
        placeholder="Digite o código ou nome..."
        class="filter-input"
      />
    </FilterSection>
    
    <FilterSection label="Variação">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </template>
      <select v-model="localFilters.variation" class="filter-select">
        <option value="">Todas</option>
        <option value="positive">Positiva</option>
        <option value="negative">Negativa</option>
      </select>
    </FilterSection>
    
    <FilterSection label="Ordenar Por">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m3 16 4 4 4-4M7 20V4M21 8l-4-4-4 4m4-4v16"></path>
        </svg>
      </template>
      <select v-model="localFilters.sortBy" class="filter-select">
        <option value="symbol">Código</option>
        <option value="price">Preço</option>
        <option value="change">Variação</option>
        <option value="volume">Volume</option>
      </select>
    </FilterSection>
    
    <FilterSection label="Ordem">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"></path>
        </svg>
      </template>
      <select v-model="localFilters.sortOrder" class="filter-select">
        <option value="asc">Crescente</option>
        <option value="desc">Decrescente</option>
      </select>
    </FilterSection>
  </FilterSidebar>
</template>

<script>
import FilterSidebar from '../common/FilterSidebar.vue'
import FilterSection from '../common/FilterSection.vue'

export default {
  name: 'QuotesFilter',
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
        variation: '',
        sortBy: 'symbol',
        sortOrder: 'asc'
      })
    }
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
        variation: '',
        sortBy: 'symbol',
        sortOrder: 'asc'
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
</style>
