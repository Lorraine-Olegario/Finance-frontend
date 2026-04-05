<template>
  <section class="quick-actions">
    <h3 class="quick-actions__title">Ações Rápidas</h3>
    <div class="quick-actions__grid">
      <QuickActionCard
        to="/my-assets"
        label="Adicionar Ativo"
      >
        <template #icon>
          <SvgIcon name="plus" />
        </template>
      </QuickActionCard>

      <QuickActionCard
        to="/quotes"
        label="Ver Cotações"
      >
        <template #icon>
          <SvgIcon name="trending-up-line" />
        </template>
      </QuickActionCard>

      <QuickActionCard
        to="/observed"
        label="Ativos Observados"
      >
        <template #icon>
          <SvgIcon name="eye" />
        </template>
      </QuickActionCard>

      <QuickActionCard
        to="/history"
        label="Histórico"
      >
        <template #icon>
          <SvgIcon name="activity" />
        </template>
      </QuickActionCard>
    </div>
  </section>
</template>

<script setup>
import QuickActionCard from '@/components/atoms/QuickActionCard.vue'
import SvgIcon from '@/components/atoms/SvgIcon.vue'
</script>

<style scoped>
.quick-actions {
  margin-bottom: 2rem;
}

.quick-actions__title {
  margin: 0 0 1.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.quick-actions__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .quick-actions__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
