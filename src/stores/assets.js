import { defineStore } from "pinia";
import { ref } from "vue";
import assetService from "../services/assetService";

export const useAssetStore = defineStore("assets", () => {
  const assets = ref([]);
  const quotes = ref([]);
  const history = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchObservedAssets(userId) {
    loading.value = true;
    error.value = null;

    try {
      const response = await assetService.getObservedAssets(userId);
      assets.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Erro ao carregar ativos";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchQuote(codigo) {
    loading.value = true;
    error.value = null;

    try {
      const response = await assetService.getAssetQuote(codigo);
      quotes.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Erro ao buscar cotação";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchHistory(codigo) {
    loading.value = true;
    error.value = null;

    try {
      const response = await assetService.getAssetHistory(codigo);
      history.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Erro ao buscar histórico";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    assets,
    quotes,
    history,
    loading,
    error,
    fetchObservedAssets,
    fetchQuote,
    fetchHistory,
  };
});
