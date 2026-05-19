import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import userService from '../services/userService'
import assetService from '../services/assetService'

export function useDashboard() {
  const authStore = useAuthStore()
  const loading = ref(true)
  const userCount = ref(0)
  const totalAssetsCount = ref(0)
  const userAssetsCount = ref(0)
  const alertsCount = ref(0)
  const assetsByType = ref({})
  const categoryColors = ref({})

  const categoriesCount = computed(() => {
    return Object.keys(assetsByType.value).filter(
      key =>
        typeof assetsByType.value[key] === 'number' &&
        assetsByType.value[key] > 0
    ).length
  })

  const topCategories = computed(() => {
    if (
      userAssetsCount.value === 0 ||
      Object.keys(assetsByType.value).length === 0
    ) {
      return []
    }

    return Object.entries(assetsByType.value)
      .filter(([name, count]) => typeof count === 'number' && count > 0)
      .map(([name, count]) => ({
        name,
        count,
        percentage: ((count / userAssetsCount.value) * 100).toFixed(1),
        color: (name)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  })

  const fetchData = async () => {
    loading.value = true
    try {
      const response = await assetService.getAssets()

      let ativosPorCategoria = {}

      if (response.data?.ativos_por_categoria) {
        ativosPorCategoria = response.data.ativos_por_categoria
      } else if (response.data?.data?.ativos_por_categoria) {
        ativosPorCategoria = response.data.data.ativos_por_categoria
      }

      userAssetsCount.value = 0
      assetsByType.value = {}

      // Filtrar apenas propriedades que são arrays (categorias reais)
      Object.entries(ativosPorCategoria).forEach(([categoria, ativos]) => {
        if (Array.isArray(ativos) && ativos.length > 0) {
          assetsByType.value[categoria] = ativos.length
          userAssetsCount.value += ativos.length
        }
      })

      await Promise.allSettled([
        assetService
          .getAssetAlerts()
          .then(res => {
            alertsCount.value = res.data?.length || 0
          })
          .catch(() => {
            alertsCount.value = 0
          }),

        authStore.isAdmin &&
          Promise.all([
            userService.getUsers().then(res => {
              userCount.value = res.data?.length || 0
            }),
            assetService.getUserAssets().then(res => {
              totalAssetsCount.value = res.data?.length || 0
            })
          ])
      ])
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    userCount,
    totalAssetsCount,
    userAssetsCount,
    alertsCount,
    assetsByType,
    categoryColors,
    categoriesCount,
    topCategories,
    authStore,
    getCategoryColor,
    fetchData
  }
}
