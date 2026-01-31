import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../services/api";

export const useAlertStore = defineStore("alerts", () => {
  const alerts = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchAlerts(userId = null) {
    loading.value = true;
    error.value = null;

    try {
      const url = userId ? `/alerts?user_id=${userId}` : "/alerts";
      const response = await apiClient.get(url);
      alerts.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Erro ao carregar alertas";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createAlert(alertData) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post("/alerts", alertData);
      alerts.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Erro ao criar alerta";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateAlert(id, alertData) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.put(`/alerts/${id}`, alertData);
      const index = alerts.value.findIndex((a) => a.id === id);
      if (index !== -1) {
        alerts.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Erro ao atualizar alerta";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteAlert(id) {
    loading.value = true;
    error.value = null;

    try {
      await apiClient.delete(`/alerts/${id}`);
      alerts.value = alerts.value.filter((a) => a.id !== id);
    } catch (err) {
      error.value = err.response?.data?.message || "Erro ao excluir alerta";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
  };
});
