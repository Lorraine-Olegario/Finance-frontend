import api from './api'

const categoryColorService = {
  /**
   * Buscar cores de categoria personalizadas do usuário
   */
  getAll() {
    return api.get('/user/category-colors')
  },

  /**
   * Salvar cores de categoria personalizadas
   * @param {Object} colors - Mapa de tipo → cor hex (ex: { 'AÇÃO': '#3b82f6' })
   */
  update(colors) {
    return api.put('/user/category-colors', { colors })
  }
}

export default categoryColorService
