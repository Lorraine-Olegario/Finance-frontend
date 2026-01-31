<template>
  <div class="stats-grid">
    <StatCard
      label="Meus Ativos"
      :value="safeValue(userAssetsCount)"
      variant="primary"
      :subtitle="safeValue(userAssetsCount) > 0 ? 'Ativos observados' : ''"
      :is-positive="safeValue(userAssetsCount) > 0">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      </template>
      <template v-if="safeValue(userAssetsCount) > 0" #subtitle-icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      </template>
    </StatCard>

    <StatCard label="Alertas Configurados" :value="safeValue(alertsCount)" variant="success" subtitle="Monitorando preços">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </template>
    </StatCard>

    <StatCard label="Categorias" :value="safeValue(categoriesCount)" variant="info" subtitle="Tipos de ativos">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </template>
    </StatCard>

    <StatCard v-if="isAdmin" label="Usuários" :value="safeValue(userCount)" variant="warning" subtitle="Cadastrados no sistema">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </template>
    </StatCard>
  </div>
</template>

<script setup>
  import StatCard from "./StatCard.vue";

  const props = defineProps({
    userAssetsCount: { type: Number, default: 0 },
    alertsCount: { type: Number, default: 0 },
    categoriesCount: { type: Number, default: 0 },
    userCount: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
  });

  // Garantir que os valores são números válidos
  const safeValue = (value) => {
    const num = Number(value);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };
</script>

<style scoped>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
