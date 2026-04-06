import apiClient from './api'

export default {
  // Create user assets
  createUserAssets(ativos) {
    return apiClient.post(`/user/ativos`, { ativos })
  },

  // Update asset status
  updateAssetStatus(ativo) {
    return apiClient.put(`/user/ativos/status`, ativo)
  },

  // Get observed assets
  getObservedAssets() {
    return apiClient.get(`/user/ativos/observados`)
  },

  // Get asset quote
  getAssetQuote(codigo) {
    return apiClient.get('/ativos/cotacao', { params: { codigos: [codigo] } })
  },

  // Get asset quotes (multiple)
  getAssetQuotes(codigos) {
    return apiClient.get('/ativos/cotacao', { params: { codigos } })
  },

  // Get asset history
  getAssetHistory(codigo) {
    return apiClient.get('/ativos/historico', { params: { codigo } })
  },

  // Get users ativos
  getUserAssets() {
    return apiClient.get('/users/listagem/ativos')
  },

  // Get user assets summary
  getUserAssetsSummary() {
    return apiClient.get('/user/ativos/resumo')
  },

  // Get all assets
  getAssets(userId, page = 1, perPage = 10) {
    return apiClient.get('user/ativos/categoria', {
      params: { user_id: userId, page, per_page: perPage }
    })
  },

  // Get all user assets (flat list with status)
  getAllUserAssets(userId, page = 1, perPage = 10) {
    return apiClient.get('/user/ativos/todos', {
      params: { user_id: userId, page, per_page: perPage }
    })
  },

  // Get assets for quotes (flattened list of observed assets)
  getAssetsForQuotes(userId) {
    return apiClient.get('/user/ativos/observados', {
      params: { user_id: userId }
    })
  },

  // Get category colors
  getCategoryColors(userId) {
    return apiClient.get('/user/category-colors', {
      params: { user_id: userId }
    })
  },

  // Update category colors
  updateCategoryColors(userId, colors) {
    return apiClient.put(`/user/category-colors`, { colors })
  },

  // Asset Alerts
  // Get all alerts for a user
  getAssetAlerts() {
    return apiClient.get(`/user/alertas`)
  },

  // Create or update asset alert
  saveAssetAlert(alertData) {
    return apiClient.post(`/user/alertas`, alertData)
  },

  // Update asset alert
  updateAssetAlert(alertId, alertData) {
    return apiClient.put(`/user/alertas/${alertId}`, alertData)
  },

  // Delete asset alert
  deleteAssetAlert(alertId) {
    return apiClient.delete(`/user/alertas/${alertId}`)
  },

  // Stop observing asset (change status to inactive)
  stopObservingAsset(ativo) {
    return apiClient.put(`/user/ativos/status`, ativo)
  },

  // Delete asset
  deleteAsset(ativoId) {
    return apiClient.delete(`/user/ativos/${ativoId}`)
  }
}
