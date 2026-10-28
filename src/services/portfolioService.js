import apiClientV2 from './apiClientV2'

export default {
  // Registrar transação (compra ou venda)
  registerTransaction(payload) {
    return apiClientV2.post('/portfolio/transactions', payload)
  },

  // Listar histórico de transações
  getTransactions() {
    return apiClientV2.get('/portfolio/transactions')
  },

  // Excluir transação
  deleteTransaction(transactionId) {
    return apiClientV2.delete(`/portfolio/transactions/${transactionId}`)
  },

  // Limpar carteira: remove todas as compras/vendas (não afeta ativos observados)
  clearPortfolio() {
    return apiClientV2.delete('/portfolio/transactions')
  },

  // Importar planilha "Movimentação" da B3 (.xlsx).
  // Resposta: { imported, skipped, created_assets, errors: [{ line, message }] }
  importB3(file) {
    const formData = new FormData()
    formData.append('file', file)

    return apiClientV2.post('/portfolio/import/b3', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Listar posições atuais
  getPositions() {
    return apiClientV2.get('/portfolio/positions')
  },

  // Resumo / patrimônio total
  getSummary() {
    return apiClientV2.get('/portfolio/summary')
  }
}
