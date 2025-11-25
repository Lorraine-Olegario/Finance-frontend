import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')
  
  async function login(email, password) {
    try {
      const response = await authService.login(email, password)
      token.value = response.data.access_token
      user.value = response.data.user
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return response.data
    } catch (error) {
      throw error
    }
  }
  
  async function logout() {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
  
  async function fetchUser() {
    try {
      const response = await authService.me()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(user.value))
      return user.value
    } catch (error) {
      // Token invalid, logout
      await logout()
      throw error
    }
  }
  
  function initializeAuth() {
    if (token.value) {
      // Token is already in localStorage and will be added by axios interceptor
      return true
    }
    return false
  }
  
  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    logout,
    fetchUser,
    initializeAuth
  }
})
