import api from './api'

const alertService = {
  /**
   * Buscar todos os alertas do usuário autenticado
   */
  getAll() {
    return api.get('/user/alertas')
  },

  /**
   * Criar novo alerta
   */
  create(alertData) {
    return api.post('/user/alertas', alertData)
  },

  /**
   * Atualizar alerta existente
   */
  update(alertId, alertData) {
    return api.put(`/user/alertas/${alertId}`, alertData)
  },

  /**
   * Remover alerta
   */
  delete(alertId) {
    return api.delete(`/user/alertas/${alertId}`)
  }
}

export default alertService
