<template>
  <FilterSidebar :is-open="isOpen" title="Filtrar Ativos" @close="$emit('close')" @apply="applyFilters" @reset="resetFilters">
    <FilterSection label="Buscar por código">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </template>
      <input v-model="localFilters.search" type="text" placeholder="Ex: PETR4, VALE3..." class="filter-input" />
    </FilterSection>

    <FilterSection label="Categoria">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      </template>
      <select v-model="localFilters.categoria" class="filter-select">
        <option value="">Todas as categorias</option>
        <option v-for="cat in categorias" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </FilterSection>

    <FilterSection label="Status">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
      </template>
      <select v-model="localFilters.status" class="filter-select">
        <option value="">Todos os status</option>
        <option value="ativo">Ativo</option>
        <option value="observando">Observando</option>
        <option value="inativo">Inativo</option>
      </select>
    </FilterSection>
  </FilterSidebar>
</template>

<script>
  import FilterSidebar from "../common/FilterSidebar.vue";
  import FilterSection from "../common/FilterSection.vue";

  export default {
    name: "AssetsFilter",
    components: {
      FilterSidebar,
      FilterSection,
    },
    props: {
      isOpen: { type: Boolean, default: false },
      filters: {
        type: Object,
        default: () => ({
          search: "",
          categoria: "",
          status: "",
        }),
      },
      categorias: { type: Array, default: () => [] },
    },
    data() {
      return {
        localFilters: { ...this.filters },
      };
    },
    watch: {
      filters: {
        deep: true,
        handler(newFilters) {
          this.localFilters = { ...newFilters };
        },
      },
    },
    methods: {
      applyFilters() {
        this.$emit("apply", this.localFilters);
        this.$emit("close");
      },
      resetFilters() {
        this.localFilters = {
          search: "",
          categoria: "",
          status: "",
        };
        this.$emit("apply", this.localFilters);
      },
    },
  };
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
