import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import categoryService from '@/services/categoryService'
import portfolioService from '@/services/portfolioService'

// Filtros "Tipo de ativo" e "Ativos" compartilhados pelos blocos da aba Proventos.
export const useDividendsStore = defineStore('dividends', () => {
  const assetCategoryId = ref('')
  const assetId = ref('')
  const categories = ref([])
  const assets = ref([])

  const params = computed(() => {
    const result = {}
    if (assetCategoryId.value) result.asset_category_id = assetCategoryId.value
    if (assetId.value) result.asset_id = assetId.value
    return result
  })

  const hasFilters = computed(() => Object.keys(params.value).length > 0)

  async function fetchOptions() {
    const [categoriesRes, positionsRes] = await Promise.all([
      categoryService.getAll(),
      portfolioService.getPositions()
    ])

    categories.value = categoriesRes.data?.categories || []
    assets.value = positionsRes.data?.positions || []
  }

  function clearFilters() {
    assetCategoryId.value = ''
    assetId.value = ''
  }

  return {
    assetCategoryId,
    assetId,
    categories,
    assets,
    params,
    hasFilters,
    fetchOptions,
    clearFilters
  }
})
