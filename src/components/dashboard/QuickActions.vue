<template>
  <div class="quick-actions">
    <h3>Ações Rápidas</h3>
    <div class="actions-grid">
      <QuickActionCard
        to="/my-assets"
        label="Adicionar Ativo"
      >
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <circle cx="12" cy="12" r="10" /> <line x1="12" y1="8" x2="12" y2="16" /> <line x1="8" y1="12" x2="16" y2="12" /> </svg>
        </template>
      </QuickActionCard>

      <QuickActionCard
        to="/quotes"
        label="Ver Cotações"
      >
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> </svg>
        </template>
      </QuickActionCard>

      <QuickActionCard
        to="/observed"
        label="Ativos Observados"
      >
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <circle cx="12" cy="12" r="3" /> </svg>
        </template>
      </QuickActionCard>

      <QuickActionCard
        to="/history"
        label="Histórico"
      >
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <circle cx="12" cy="12" r="10" /> <polyline points="12 6 12 12 16 14" /> </svg>
        </template>
      </QuickActionCard>
    </div>
  </div>
</template>

<script setup>
import QuickActionCard from './QuickActionCard.vue'
</script>

<style scoped>
.quick-actions {
  margin-bottom: 32px;
}

.quick-actions h3 {
  margin: 0 0 20px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
