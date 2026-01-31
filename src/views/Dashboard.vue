<template>
  <MainLayout page-title="Dashboard">
    <div class="dashboard">
      <!-- Welcome Header -->
      <div class="welcome-section">
        <div>
          <h2>Olá, {{ authStore.user?.name?.split(" ")[0] || "Usuário" }}! 👋</h2>
          <p class="welcome-subtitle">Aqui está um resumo da sua carteira de investimentos</p>
        </div>
        <div class="date-info">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{{ currentDate }}</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <StatCard
          label="Meus Ativos"
          :value="userAssetsCount || 0"
          variant="primary"
          :subtitle="userAssetsCount > 0 ? 'Ativos observados' : ''"
          :is-positive="userAssetsCount > 0">
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </template>
          <template v-if="userAssetsCount > 0" #subtitle-icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </template>
        </StatCard>

        <StatCard label="Alertas Configurados" :value="alertsCount || 0" variant="success" subtitle="Monitorando preços">
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </template>
        </StatCard>

        <StatCard label="Categorias" :value="categoriesCount" variant="info" subtitle="Tipos de ativos">
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </template>
        </StatCard>

        <StatCard v-if="authStore.isAdmin" label="Usuários" :value="userCount" variant="warning" subtitle="Cadastrados no sistema">
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

      <!-- Charts Section -->
      <div class="charts-section">
        <DashboardCard title="Distribuição por Categoria">
          <template #icon>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </template>
          <div v-if="userAssetsCount > 0" class="chart-container">
            <canvas ref="assetTypeChart" />
          </div>
          <EmptyState v-else title="Nenhum ativo observado" description="Adicione ativos para visualizar a distribuição por categoria">
            <template #action>
              <router-link to="/my-assets" class="btn">Adicionar Ativos</router-link>
            </template>
          </EmptyState>
        </DashboardCard>

        <DashboardCard title="Categorias Principais">
          <template #icon>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </template>
          <div v-if="topCategories.length > 0" class="categories-list">
            <CategoryListItem
              v-for="category in topCategories"
              :key="category.name"
              :name="category.name"
              :count="category.count"
              :percentage="category.percentage"
              :color="category.color" />
          </div>
          <EmptyState v-else title="Sem dados" description="Nenhuma categoria disponível no momento" />
        </DashboardCard>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Ações Rápidas</h3>
        <div class="actions-grid">
          <QuickActionCard to="/my-assets" label="Adicionar Ativo">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </template>
          </QuickActionCard>

          <QuickActionCard to="/quotes" label="Ver Cotações">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </template>
          </QuickActionCard>

          <QuickActionCard to="/observed" label="Ativos Observados">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </template>
          </QuickActionCard>

          <QuickActionCard to="/history" label="Histórico">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </template>
          </QuickActionCard>
        </div>
      </div>

      <div v-if="loading" class="loading-overlay">
        <div class="spinner" />
      </div>
    </div>
  </MainLayout>
</template>

<script>
  import MainLayout from "../components/MainLayout.vue";
  import StatCard from "../components/dashboard/StatCard.vue";
  import DashboardCard from "../components/dashboard/DashboardCard.vue";
  import QuickActionCard from "../components/dashboard/QuickActionCard.vue";
  import CategoryListItem from "../components/dashboard/CategoryListItem.vue";
  import EmptyState from "../components/common/EmptyState.vue";
  import { useAuthStore } from "../stores/auth";
  import userService from "../services/userService";
  import assetService from "../services/assetService";
  import { Chart, registerables } from "chart.js";

  Chart.register(...registerables);

  export default {
    name: "Dashboard",
    components: {
      MainLayout,
      StatCard,
      DashboardCard,
      EmptyState,
      QuickActionCard,
      CategoryListItem,
    },
    setup() {
      const authStore = useAuthStore();
      return { authStore };
    },
    data() {
      return {
        userCount: 0,
        totalAssetsCount: 0,
        userAssetsCount: 0,
        alertsCount: 0,
        assetsByType: {},
        categoryColors: {},
        loading: true,
        chart: null,
      };
    },
    computed: {
      currentDate() {
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        return new Date().toLocaleDateString("pt-BR", options);
      },
      categoriesCount() {
        return Object.keys(this.assetsByType).length;
      },
      topCategories() {
        const categories = Object.entries(this.assetsByType).map(([name, count]) => {
          const percentage = this.userAssetsCount > 0 ? ((count / this.userAssetsCount) * 100).toFixed(1) : "0.0";
          const color = this.getCategoryColor(name);
          return { name, count, percentage, color };
        });

        return categories.sort((a, b) => b.count - a.count).slice(0, 5);
      },
    },
    mounted() {
      this.fetchData();
    },
    beforeUnmount() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;
        try {
          const userId = this.authStore.user?.id;

          if (!userId) {
            console.error("Usuário não identificado");
            return;
          }

          const response = await assetService.getAssets(userId);
          const ativosPorCategoria = response.data?.ativos_por_categoria?.data || {};

          // Contar total de ativos e preparar dados para o gráfico
          this.userAssetsCount = 0;
          this.assetsByType = {};

          // Garantir que estamos iterando apenas sobre categorias válidas
          Object.keys(ativosPorCategoria).forEach((categoria) => {
            const ativos = ativosPorCategoria[categoria];
            // Verificar se 'ativos' é um array antes de usar .length
            if (Array.isArray(ativos)) {
              this.assetsByType[categoria] = ativos.length;
              this.userAssetsCount += ativos.length;
            }
          });

          // Buscar cores personalizadas do usuário
          try {
            const colorsResponse = await assetService.getCategoryColors(userId);
            this.categoryColors = colorsResponse.data?.colors || {};
          } catch (err) {
            this.categoryColors = {};
          }

          // Buscar alertas do usuário
          try {
            const alertsResponse = await assetService.getAssetAlerts(userId);
            this.alertsCount = alertsResponse.data?.length || 0;
          } catch (err) {
            this.alertsCount = 0;
          }

          // Se for admin, buscar dados adicionais
          if (this.authStore.isAdmin) {
            const usersResponse = await userService.getUsers();
            this.userCount = usersResponse.data?.length || 0;

            const userAssetsResponse = await assetService.getUserAssets();
            this.totalAssetsCount = userAssetsResponse.data?.length || 0;
          }

          // Criar gráfico após carregar os dados
          this.$nextTick(() => {
            this.createChart();
          });
        } catch (err) {
          console.error("Erro ao carregar dados do dashboard:", err);
        } finally {
          this.loading = false;
        }
      },

      createChart() {
        if (this.chart) {
          this.chart.destroy();
        }

        if (!this.$refs.assetTypeChart || Object.keys(this.assetsByType).length === 0) {
          return;
        }

        const ctx = this.$refs.assetTypeChart.getContext("2d");
        const labels = Object.keys(this.assetsByType);
        const data = Object.values(this.assetsByType);

        // Usar cores personalizadas ou padrão
        const colors = labels.map((label) => this.getCategoryColor(label));

        this.chart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: "#fff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 15,
                  font: {
                    size: 12,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${value} (${percentage}%)`;
                  },
                },
              },
            },
          },
        });
      },

      getCategoryColor(category) {
        // Cores padrão por categoria
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

        return this.categoryColors[category] || defaultColors[category] || "#6b7280";
      },
    },
  };
</script>

<style scoped>
  .dashboard {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Welcome Section */
  .welcome-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 24px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    border-radius: 16px;
    color: white;
  }

  .welcome-section h2 {
    margin: 0 0 8px 0;
    font-size: 2rem;
    font-weight: 700;
    color: white;
  }

  .welcome-subtitle {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
    color: white;
  }

  .date-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .date-info .icon {
    width: 20px;
    height: 20px;
  }

  /* Grids */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .charts-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 32px;
  }

  .chart-container {
    padding: 32px 24px;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .categories-list {
    padding: 16px 24px 24px;
  }

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

  /* Loading */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .spinner {
    border: 4px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .charts-section {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .welcome-section {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .welcome-section h2 {
      font-size: 1.5rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .actions-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
