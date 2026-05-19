import api from './api'

const categoryService = {
  /**
   * Buscar todas as categories
   */
  async getAll() {
    return await api.get('/categories')
  },

  /**
   * Buscar categoria por ID
   */
  async getById(id) {
    return await api.get(`/categories/${id}`)
  },

  /**
   * Criar nova categoria
   */
  async create(data) {
    return await api.post('/categories', data)
  },

  /**
   * Atualizar categoria
   */
  async update(id, data) {
    return await api.put(`/categories/${id}`, data)
  },

  /**
   * Excluir categoria
   */
  async delete(id) {
    return await api.delete(`/categories/${id}`)
  },

  /**
   * Atualizar cor de uma categoria do usuário
   */
  async updateCategoryColor(category_id, color) {
    return await api.put('/user/category-colors', { category_id, color })
  }
}

export default categoryService
