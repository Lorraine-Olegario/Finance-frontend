<template>
  <Teleport to="body">
    <div
      v-show="isOpen"
      class="filter-drawer"
      @click.self="emit('close')"
    >
      <div class="filter-drawer__panel">
        <div class="filter-drawer__header">
          <h2 class="filter-drawer__title">
            {{ title }}
          </h2>
          <button
            class="filter-drawer__close"
            type="button"
            :aria-label="`Fechar ${title}`"
            @click="emit('close')"
          >
            <SvgIcon
              name="close"
              :size="18"
            />
          </button>
        </div>

        <div class="filter-drawer__content">
          <slot />
        </div>

        <div class="filter-drawer__footer">
          <button
            type="button"
            class="filter-drawer__btn filter-drawer__btn--reset"
            @click="emit('reset')"
          >
            <SvgIcon
              name="refresh"
              :size="16"
            />
            Limpar Filtros
          </button>
          <slot name="footer-extra" />
          <button
            type="button"
            class="filter-drawer__btn filter-drawer__btn--apply"
            @click="emit('apply')"
          >
            <SvgIcon
              name="check-circle"
              :size="16"
            />
            Aplicar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import SvgIcon from '@/components/atoms/SvgIcon.vue'

defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: 'Filtros' }
})

const emit = defineEmits(['close', 'apply', 'reset'])
</script>

<style scoped>
.filter-drawer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
}

.filter-drawer__panel {
  width: 380px;
  max-width: 90vw;
  background: var(--surface);
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
}

.filter-drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.75rem;
  border-bottom: 1px solid var(--border);
}

.filter-drawer__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.filter-drawer__close {
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
  padding: 0;
}

.filter-drawer__close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.filter-drawer__content {
  flex: 1;
  padding: 1.5rem 1.75rem;
  overflow-y: auto;
}

.filter-drawer__content::-webkit-scrollbar {
  width: 6px;
}

.filter-drawer__content::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.filter-drawer__content::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.filter-drawer__content::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.filter-drawer__footer {
  padding: 1.25rem 1.75rem;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 0.75rem;
  background: var(--surface);
}

.filter-drawer__btn {
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

.filter-drawer__btn--reset {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.filter-drawer__btn--reset:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.filter-drawer__btn--apply {
  background: var(--primary);
  border: 1px solid var(--primary);
  color: white;
}

.filter-drawer__btn--apply:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
  box-shadow: 0 2px 8px rgba(98, 0, 238, 0.3);
}

@media (max-width: 768px) {
  .filter-drawer__panel {
    width: 100%;
    max-width: 100%;
  }
}
</style>
