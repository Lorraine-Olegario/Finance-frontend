import { ref } from 'vue'

// Estado independente de um card (dados, loading, erro) para que a falha
// de um bloco não derrube os demais.
export function useAsyncCard(initialData = null) {
  const data = ref(initialData)
  const loading = ref(false)
  const error = ref('')

  async function run(fetcher, fallbackMessage) {
    loading.value = true
    error.value = ''

    try {
      data.value = await fetcher()
    } catch (err) {
      console.error(`[useAsyncCard] ${fallbackMessage}:`, err)
      error.value = err?.response?.data?.message || fallbackMessage
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, run }
}
