import apiClient from './api'

export default {
  // Create user assets
  createUserAssets(userId, ativos) {
    return apiClient.post(`/user/ativos?user_id=${userId}`, { ativos })
  },

  // Update asset status
  updateAssetStatus(userId, ativos) {
    return apiClient.put(`/user/ativos/status?user_id=${userId}`, { ativos })
  },

  // Get observed assets
  getObservedAssets(userId) {
    return apiClient.get(`/user/ativos/observados?user_id=${userId}`)
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

  // Get all assets
  getAssets(userId) {
    return apiClient.get('user/ativos/categoria', { params: { user_id: userId }})
  },

  // Get all user assets (flat list with status)
  getAllUserAssets(userId) {
    return apiClient.get('/user/ativos/todos', { params: { user_id: userId }})
  },

  // Get assets for quotes (flattened list of observed assets)
  getAssetsForQuotes(userId) {
    return apiClient.get('/user/ativos/observados', { params: { user_id: userId }})
  },

  // Get category colors
  getCategoryColors(userId) {
    return apiClient.get('/user/category-colors', { params: { user_id: userId }})
  },

  // Update category colors
  updateCategoryColors(userId, colors) {
    return apiClient.put(`/user/category-colors?user_id=${userId}`, { colors })
  },

  // Asset Alerts
  // Get all alerts for a user
  getAssetAlerts(userId) {
    return apiClient.get(`/user/alertas?user_id=${userId}`)
  },

  // Create or update asset alert
  saveAssetAlert(userId, alertData) {
    return apiClient.post(`/user/alertas?user_id=${userId}`, alertData)
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
  stopObservingAsset(userId, ativoId) {
    return apiClient.put(`/user/ativos/status?user_id=${userId}`, {
      ativos: [{ ativo_id: ativoId, status: 'inativo' }]
    })
  },

  // Delete asset
  deleteAsset(ativoId) {
    return apiClient.delete(`/user/ativos/${ativoId}`)
  }
}
