import api from './api'

const quoteService = {
  /**
   * Buscar cotação de um ou mais ativos
   * @param {string[]} codigos - Array de códigos (ex: ['BBAS3', 'VALE3'])
   */
  getQuotes(codigos) {
    return api.get('/ativos/cotacao', { params: { codigos } })
  },

  /**
   * Buscar cotação de um único ativo
   * @param {string} codigo - Código do ativo (ex: 'BBAS3')
   */
  getQuote(codigo) {
    return api.get('/ativos/cotacao', { params: { codigos: [codigo] } })
  },

  /**
   * Buscar histórico de preços de um ativo
   * @param {string} codigo - Código do ativo (ex: 'BBAS3')
   */
  getHistory(codigo) {
    return api.get('/ativos/historico', { params: { codigo } })
  }
}

export default quoteService
