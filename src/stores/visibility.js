import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'valuesHidden'

export const useVisibilityStore = defineStore('visibility', () => {
  const valuesHidden = ref(localStorage.getItem(STORAGE_KEY) === 'true')

  function toggleValuesVisibility() {
    valuesHidden.value = !valuesHidden.value
  }

  watch(valuesHidden, value => {
    localStorage.setItem(STORAGE_KEY, String(value))
  })

  return {
    valuesHidden,
    toggleValuesVisibility
  }
})
