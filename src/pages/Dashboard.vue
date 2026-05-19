<template>
  <MainLayout page-title="Dashboard">
    <div class="dashboard-page">
      <DashboardWelcome
        :user-name="authStore.user?.name || 'Usuário'"
        :date="currentDate"
      />

      <StatsGrid style="margin-bottom: 2rem">
        <StatCard
          label="Meus Ativos"
          :value="userAssetsCount"
          variant="primary"
          :subtitle="userAssetsCount > 0 ? 'Ativos observados' : ''"
          :is-positive="userAssetsCount > 0"
        >
          <template #icon>
            <SvgIcon name="bar-chart" />
          </template>
          <template
            v-if="userAssetsCount > 0"
            #subtitle-icon
          >
            <SvgIcon name="trending-up" />
          </template>
        </StatCard>

        <StatCard
          label="Alertas Configurados"
          :value="alertsCount"
          variant="success"
          subtitle="Monitorando preços"
        >
          <template #icon>
            <SvgIcon name="alert-triangle" />
          </template>
        </StatCard>

        <StatCard
          label="Categorias"
          :value="categoriesCount"
          variant="info"
          subtitle="Tipos de ativos"
        >
          <template #icon>
            <SvgIcon name="grid" />
          </template>
        </StatCard>

        <StatCard
          v-if="authStore.isAdmin"
          label="Usuários"
          :value="userCount"
          variant="warning"
          subtitle="Cadastrados no sistema"
        >
          <template #icon>
            <SvgIcon name="users" />
          </template>
        </StatCard>
      </StatsGrid>

      <DashboardCharts
        :assets-by-type="assetsByType"
        :user-assets-count="userAssetsCount"
        :category-colors="categoryColors"
      />

      <LoadingSpinner
        v-if="loading"
        fullscreen
      />
    </div>
  </MainLayout>
</template>

<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref, computed, onMounted } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import StatCard from '@/components/atoms/StatCard/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import StatsGrid from '@/components/molecules/StatsGrid/index.vue'
import DashboardWelcome from '@/components/organisms/dashboard/DashboardWelcome/index.vue'
import DashboardCharts from '@/components/organisms/dashboard/DashboardCharts/index.vue'
import { useAuthStore } from '@/stores/auth'
import userService from '@/services/userService'
import assetService from '@/services/assetService'

// ── State ─────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()

const loading = ref(true)
const userCount = ref(0)
const userAssetsCount = ref(0)
const alertsCount = ref(0)
const assetsByType = ref({})
const categoryColors = ref({})

const currentDate = computed(() =>
  new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

const categoriesCount = computed(() => Object.keys(assetsByType.value).length)

onMounted(loadDashboard)

/** Busca resumo de ativos e cores personalizadas de categoria */
async function fetchAssetsSummary() {
  const res = await assetService.getUserAssetsSummary()

  const categorias = res.data?.categorias
  if (Array.isArray(categorias)) {
    assetsByType.value = Object.fromEntries(
      categorias.map(item => [item.categoria, item.quantidade])
    )
    categoryColors.value = Object.fromEntries(
      categorias.map(item => [item.categoria, item.color])
    )
    userAssetsCount.value = res.data?.total ?? categorias.reduce((acc, item) => acc + item.quantidade, 0)
  }
}

/** Busca quantidade de alertas configurados pelo usuário */
async function fetchAlerts() {
  try {
    const res = await assetService.getAssetAlerts()
    alertsCount.value = res.data?.total || 0
  } catch {
    alertsCount.value = 0
  }
}

/** Busca dados exclusivos de admin (total de usuários) */
async function fetchAdminData() {
  if (!authStore.isAdmin) return
  try {
    const res = await userService.getUsers()
    userCount.value = res.data?.length || 0
  } catch {
    userCount.value = 0
  }
}

/** Orquestra todas as chamadas do dashboard */
async function loadDashboard() {
  if (!authStore.user?.id) {
    console.warn('[Dashboard] Usuário não identificado')
    loading.value = false
    return
  }

  loading.value = true
  try {
    await Promise.all([fetchAssetsSummary(), fetchAlerts(), fetchAdminData()])
  } catch (err) {
    console.error('[Dashboard] Erro ao carregar dados:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
