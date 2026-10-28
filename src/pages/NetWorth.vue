<template>
  <MainLayout
    page-title="Patrimônio"
    page-subtitle="Evolução e consolidação dos seus investimentos"
  >
    <div class="net-worth-page">
      <NetWorthEvolutionCard
        v-model:controls="evolutionControls"
        :categories="categories.data.value?.items || []"
        :points="evolution.data.value?.points || []"
        :loading="evolution.loading.value"
        :error="evolution.error.value"
        @retry="loadEvolution"
      />

      <section class="net-worth-page__section">
        <h2 class="net-worth-page__heading">Consolidação do patrimônio</h2>
        <NetWorthConsolidationCard
          v-model:view="consolidationView"
          :items="consolidation.data.value?.items || []"
          :loading="consolidation.loading.value"
          :error="consolidation.error.value"
          @retry="loadConsolidation"
        />
      </section>

      <NetWorthCategoryCard
        v-for="category in categories.data.value?.items || []"
        :key="category.id"
        :category-id="category.id"
        :category-name="category.label"
      />
    </div>
  </MainLayout>
</template>

<script setup>
// ── Imports ──────────────────────────────────────────────────────────────────
import { ref, watch, onMounted } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import NetWorthEvolutionCard from '@/components/organisms/net-worth/NetWorthEvolutionCard/index.vue'
import NetWorthConsolidationCard from '@/components/organisms/net-worth/NetWorthConsolidationCard/index.vue'
import NetWorthCategoryCard from '@/components/organisms/net-worth/NetWorthCategoryCard/index.vue'
import { useAuthStore } from '@/stores/auth'
import { useAsyncCard } from '@/hooks/useAsyncCard'
import netWorthService from '@/services/netWorthService'

// ── State ────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()

const evolution = useAsyncCard()
const consolidation = useAsyncCard()
// Lista de categorias do usuário: alimenta o filtro do Card 1 e os cards por categoria.
const categories = useAsyncCard()

const evolutionControls = ref({
  period: '12m',
  categoryId: '',
  from: '',
  to: ''
})
const consolidationView = ref('category')

// ── Watchers ─────────────────────────────────────────────────────────────────
watch(evolutionControls, loadEvolution, { deep: true })
watch(consolidationView, loadConsolidation)

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(loadPage)

// ── Functions ────────────────────────────────────────────────────────────────
async function fetchEvolution() {
  const { period, categoryId, from, to } = evolutionControls.value
  const params = { period }

  if (categoryId) params.category_id = categoryId
  if (period === 'custom') {
    params.from = from
    params.to = to
  }

  const res = await netWorthService.getEvolution(params)
  return res.data
}

async function fetchConsolidation() {
  const res = await netWorthService.getConsolidation(consolidationView.value)
  return res.data
}

async function fetchCategories() {
  const res = await netWorthService.getConsolidation('category')
  return res.data
}

function loadEvolution() {
  const { period, from, to } = evolutionControls.value
  if (period === 'custom' && (!from || !to)) return Promise.resolve()
  return evolution.run(fetchEvolution, 'Erro ao carregar a evolução.')
}

function loadConsolidation() {
  return consolidation.run(
    fetchConsolidation,
    'Erro ao carregar a consolidação.'
  )
}

function loadCategories() {
  return categories.run(fetchCategories, 'Erro ao carregar as categorias.')
}

function loadPage() {
  if (!authStore.user?.id) return Promise.resolve()

  return Promise.all([loadEvolution(), loadConsolidation(), loadCategories()])
}
</script>

<style scoped>
.net-worth-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.net-worth-page__section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.net-worth-page__heading {
  margin: 0;
  font-size: 1.25rem;
}
</style>
