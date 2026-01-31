import api from "./api";

const categoryService = {
  /**
   * Buscar todas as categorias
   */
  async getAll() {
    return await api.get("/categorias");
  },

  /**
   * Buscar categoria por ID
   */
  async getById(id) {
    return await api.get(`/categorias/${id}`);
  },

  /**
   * Criar nova categoria
   */
  async create(data) {
    return await api.post("/categorias", data);
  },

  /**
   * Atualizar categoria
   */
  async update(id, data) {
    return await api.put(`/categorias/${id}`, data);
  },

  /**
   * Excluir categoria
   */
  async delete(id) {
    return await api.delete(`/categorias/${id}`);
  },
};

export default categoryService;
