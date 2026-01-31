import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import userService from "../services/userService";
import assetService from "../services/assetService";

export function useDashboard() {
  const authStore = useAuthStore();
  const loading = ref(true);
  const userCount = ref(0);
  const totalAssetsCount = ref(0);
  const userAssetsCount = ref(0);
  const alertsCount = ref(0);
  const assetsByType = ref({});
  const categoryColors = ref({});

  const categoriesCount = computed(() => {
    return Object.keys(assetsByType.value).filter((key) => typeof assetsByType.value[key] === "number" && assetsByType.value[key] > 0).length;
  });

  const topCategories = computed(() => {
    if (userAssetsCount.value === 0 || Object.keys(assetsByType.value).length === 0) {
      return [];
    }

    return Object.entries(assetsByType.value)
      .filter(([name, count]) => typeof count === "number" && count > 0)
      .map(([name, count]) => ({
        name,
        count,
        percentage: ((count / userAssetsCount.value) * 100).toFixed(1),
        color: getCategoryColor(name),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  const getCategoryColor = (category) => {
    const defaultColors = {
      Ações: "#3b82f6",
      Acao: "#3b82f6",
      Acoes: "#3b82f6",
      FIIs: "#10b981",
      FII: "#10b981",
      Criptomoedas: "#8b5cf6",
      Criptomoeda: "#8b5cf6",
      Cripto: "#8b5cf6",
      BDRs: "#f59e0b",
      BDR: "#f59e0b",
      Stocks: "#ec4899",
      Stock: "#ec4899",
      ETFs: "#06b6d4",
      ETF: "#06b6d4",
    };

    return categoryColors.value[category] || defaultColors[category] || "#6b7280";
  };

  const fetchData = async () => {
    loading.value = true;
    try {
      const userId = authStore.user?.id;

      if (!userId) {
        console.error("Usuário não identificado");
        return;
      }

      // Buscar ativos do usuário
      const response = await assetService.getAssets(userId);

      // A API pode retornar os dados de duas formas diferentes
      let ativosPorCategoria = {};

      if (response.data?.ativos_por_categoria) {
        ativosPorCategoria = response.data.ativos_por_categoria;
      } else if (response.data?.data?.ativos_por_categoria) {
        ativosPorCategoria = response.data.data.ativos_por_categoria;
      }

      userAssetsCount.value = 0;
      assetsByType.value = {};

      // Filtrar apenas propriedades que são arrays (categorias reais)
      Object.entries(ativosPorCategoria).forEach(([categoria, ativos]) => {
        if (Array.isArray(ativos) && ativos.length > 0) {
          assetsByType.value[categoria] = ativos.length;
          userAssetsCount.value += ativos.length;
        }
      });

      // Buscar cores e alertas em paralelo
      await Promise.allSettled([
        assetService
          .getCategoryColors(userId)
          .then((res) => {
            categoryColors.value = res.data?.colors || {};
          })
          .catch(() => {
            categoryColors.value = {};
          }),

        assetService
          .getAssetAlerts(userId)
          .then((res) => {
            alertsCount.value = res.data?.length || 0;
          })
          .catch(() => {
            alertsCount.value = 0;
          }),

        authStore.isAdmin &&
          Promise.all([
            userService.getUsers().then((res) => {
              userCount.value = res.data?.length || 0;
            }),
            assetService.getUserAssets().then((res) => {
              totalAssetsCount.value = res.data?.length || 0;
            }),
          ]),
      ]);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
    } finally {
      loading.value = false;
    }
  };

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
    fetchData,
  };
}
