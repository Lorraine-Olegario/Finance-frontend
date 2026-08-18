import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_DURATION = 4000

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let nextId = 1

  function push(message, type = 'success', duration = DEFAULT_DURATION) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
    return id
  }

  function success(message, duration) {
    return push(message, 'success', duration)
  }

  function error(message, duration) {
    return push(message, 'error', duration)
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    success,
    error,
    remove
  }
})
