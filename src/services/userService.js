import apiClient from './api'

export default {
  // Get all users (supports query params: page, per_page, q...)
  getUsers(params = {}) {
    return apiClient.get('/users', { params })
  },

  // Get single user
  getUser(id) {
    return apiClient.get(`/users/${id}`)
  },

  // Create user
  createUser(userData) {
    return apiClient.post('/users', userData)
  },

  // Update user
  updateUser(id, userData) {
    return apiClient.put(`/users/${id}`, userData)
  },

  // Delete user
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`)
  }
}
