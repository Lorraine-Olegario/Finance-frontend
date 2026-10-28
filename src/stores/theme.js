import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'theme'

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(
    localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  )

  applyTheme(theme.value)

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(theme, value => {
    localStorage.setItem(STORAGE_KEY, value)
    applyTheme(value)
  })

  return {
    theme,
    toggleTheme
  }
})
