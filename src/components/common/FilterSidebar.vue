<template>
  <div
    v-show="isOpen"
    class="filter-overlay"
    @click="$emit('close')"
  >
    <div
      class="filter-sidebar"
      @click.stop
    >
      <div class="filter-header">
        <h2>{{ title }}</h2>
        <button
          class="close-btn"
          @click="$emit('close')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <line x1="18" y1="6" x2="6" y2="18" /> <line x1="6" y1="6" x2="18" y2="18" /> </svg>
        </button>
      </div>
      
      <div class="filter-content">
        <slot />
      </div>
      
      <div class="filter-footer">
        <button
          class="btn-reset"
          @click="$emit('reset')"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <polyline points="1 4 1 10 7 10" /> <polyline points="23 20 23 14 17 14" /> <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /> </svg>
          Limpar Filtros
        </button>
        <slot name="footer-extra" />
        <button
          class="btn-apply"
          @click="$emit('apply')"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <polyline points="20 6 9 17 4 12" /> </svg>
          Aplicar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSidebar',
  props: {
    isOpen: { type: Boolean, default: false },
    title: { type: String, default: 'Filtros' }
  },
  emits: ['close', 'apply', 'reset']
}
</script>

<style scoped>
.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.filter-sidebar {
  width: 380px;
  max-width: 90vw;
  background: var(--surface);
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transform: translateX(0);
  transition: transform 0.3s ease-out;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.75rem;
  border-bottom: 1px solid var(--border);
}

.filter-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.close-btn {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.close-btn:hover {
  background: var(--background);
  color: var(--text-primary);
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.filter-content {
  flex: 1;
  padding: 1.5rem 1.75rem;
  overflow-y: auto;
}

.filter-content::-webkit-scrollbar {
  width: 6px;
}

.filter-content::-webkit-scrollbar-track {
  background: var(--background);
}

.filter-content::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.filter-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.filter-footer {
  padding: 1.25rem 1.75rem;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 0.75rem;
  background: var(--surface);
}

.btn-reset,
.btn-apply {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-reset {
  background: var(--background);
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.btn-reset:hover {
  background: var(--border);
  color: var(--text-primary);
}

.btn-apply {
  background: var(--primary);
  border: 1px solid var(--primary);
  color: white;
}

.btn-apply:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
  box-shadow: 0 2px 8px rgba(98, 0, 238, 0.3);
}

.btn-reset .icon,
.btn-apply .icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .filter-sidebar {
    width: 100%;
    max-width: 100%;
  }
}
</style>
