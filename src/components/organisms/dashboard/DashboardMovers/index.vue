<template>
  <DashboardCard title="Maiores Variações">
    <template #icon>
      <SvgIcon name="bar-chart" />
    </template>

    <div
      v-if="gainers.length > 0 || losers.length > 0"
      class="dashboard-movers"
    >
      <div class="dashboard-movers__col">
        <p class="dashboard-movers__col-title">Altas</p>
        <p
          v-if="gainers.length === 0"
          class="dashboard-movers__empty"
        >
          Nenhuma posição em alta
        </p>
        <div
          v-for="mover in gainers"
          :key="mover.code"
          class="dashboard-movers__row"
        >
          <div class="dashboard-movers__asset">
            <span class="dashboard-movers__code">{{ mover.code }}</span>
            <span
              v-if="mover.name"
              class="dashboard-movers__name"
            >
              {{ mover.name }}
            </span>
          </div>
          <span class="pill pill--up">
            <SvgIcon
              name="trending-up"
              :size="10"
            />
            {{ formatPercent(mover.percent) }}
          </span>
        </div>
      </div>

      <div class="dashboard-movers__col">
        <p class="dashboard-movers__col-title">Baixas</p>
        <p
          v-if="losers.length === 0"
          class="dashboard-movers__empty"
        >
          Nenhuma posição em baixa
        </p>
        <div
          v-for="mover in losers"
          :key="mover.code"
          class="dashboard-movers__row"
        >
          <div class="dashboard-movers__asset">
            <span class="dashboard-movers__code">{{ mover.code }}</span>
            <span
              v-if="mover.name"
              class="dashboard-movers__name"
            >
              {{ mover.name }}
            </span>
          </div>
          <span class="pill pill--down">
            <SvgIcon
              name="trending-down"
              :size="10"
            />
            {{ formatPercent(mover.percent) }}
          </span>
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      title="Sem variações"
      description="Nenhuma posição com rentabilidade calculada no momento"
    />
  </DashboardCard>
</template>

<script setup>
// ── Imports ──────────────────────────────────────────────────────────────
import DashboardCard from '@/components/atoms/DashboardCard/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import { formatPercent } from '@/utils/formatPercent'

// ── Props ────────────────────────────────────────────────────────────────
defineProps({
  gainers: {
    type: Array,
    default: () => []
  },
  losers: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
