<template>
  <NetWorthCard
    :title="categoryName"
    empty-title="Sem ativos nesta categoria"
    empty-description="Cadastre suas compras para ver o detalhamento"
    :loading="breakdown.loading.value"
    :error="breakdown.error.value"
    :empty="items.length === 0"
    @retry="loadBreakdown"
  >
    <template #actions>
      <SegmentedControl
        v-if="availableViews.length > 1"
        :model-value="view"
        :options="viewOptions"
        @update:model-value="view = $event"
      />
      <label
        v-if="hasIdeal"
        class="net-worth-category__ideal"
      >
        Exibir posição ideal
        <span
          class="net-worth-category__help"
          title="Compara a distribuição atual com a alocação desejada"
        >
          <SvgIcon
            name="info"
            :size="14"
          />
        </span>
        <input
          v-model="showIdeal"
          type="checkbox"
          role="switch"
        />
      </label>
    </template>

    <NetWorthDonutBreakdown
      :items="items"
      :show-ideal="hasIdeal && showIdeal"
      :can-classify="view !== 'consolidated'"
      :diversify-colors="view === 'consolidated'"
      @classify="modals.classify = true"
    />
  </NetWorthCard>

  <NetWorthClassifyModal
    :is-open="modals.classify"
    :category-id="categoryId"
    :available-views="availableViews"
    @close="modals.classify = false"
    @saved="handleClassified"
  />
</template>

<script setup lang="ts">
// ── Imports ──────────────────────────────────────────────────────────────────
import { ref, reactive, computed, watch, onMounted } from 'vue'
import NetWorthCard from '@/components/molecules/NetWorthCard/index.vue'
import SegmentedControl from '@/components/molecules/SegmentedControl/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import NetWorthDonutBreakdown from '@/components/organisms/net-worth/NetWorthDonutBreakdown/index.vue'
import NetWorthClassifyModal from '@/components/organisms/net-worth/NetWorthClassifyModal/index.vue'
import { useAsyncCard } from '@/hooks/useAsyncCard'
import netWorthService from '@/services/netWorthService'

const VIEW_LABELS = {
  consolidated: 'Consolidado',
  sector: 'Por setor',
  segment: 'Por segmento',
  type: 'Por tipo'
}

const props = defineProps({
  categoryId: {
    type: [Number, String],
    required: true
  },
  categoryName: {
    type: String,
    required: true
  }
})

// ── State ────────────────────────────────────────────────────────────────────
const breakdown = useAsyncCard()
const view = ref('consolidated')
const showIdeal = ref(false)
// Mantém as abas enquanto uma nova aba carrega (a resposta anterior é descartada).
const availableViews = ref([])
const modals = reactive({ classify: false })

// ── Computed ─────────────────────────────────────────────────────────────────
const items = computed(() => breakdown.data.value?.items || [])
const viewOptions = computed(() =>
  availableViews.value.map(key => ({
    value: key,
    label: VIEW_LABELS[key] || key
  }))
)
const hasIdeal = computed(() =>
  items.value.some(item => item.ideal_percent != null)
)

// ── Watchers ─────────────────────────────────────────────────────────────────
watch(view, loadBreakdown)

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(loadBreakdown)

// ── Functions ────────────────────────────────────────────────────────────────
async function fetchBreakdown() {
  const res = await netWorthService.getCategoryBreakdown(
    props.categoryId,
    view.value
  )
  availableViews.value = res.data.available_views || []
  return res.data
}

function loadBreakdown() {
  return breakdown.run(fetchBreakdown, 'Erro ao carregar a categoria.')
}

function handleClassified() {
  modals.classify = false
  return loadBreakdown()
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
