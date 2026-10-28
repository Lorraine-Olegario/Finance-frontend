import apiClientV2 from './apiClientV2'

export default {
  // Lista de proventos. params: year, month, status (paid|pending), type,
  // asset_id, asset_category_id, sort, direction.
  // Resposta: { data: [...], total: { gross_total, net_total } }
  getDividends(params = {}) {
    return apiClientV2.get('/dividends', { params })
  },

  // Histórico mensal. params: status (received|pending|all), asset_id, asset_category_id
  // Resposta: { data: [{ year, months: [12], average, total }] }
  getMonthlyHistory(params = {}) {
    return apiClientV2.get('/dividends/monthly-history', { params })
  },

  // Resposta: { monthly_average, last_12_months_total, portfolio_total }
  getSummary(params = {}) {
    return apiClientV2.get('/dividends/summary', { params })
  },

  // Resposta: { data: [{ asset: { id, code, name }, total, percent }], total }
  getDistribution(params = {}) {
    return apiClientV2.get('/dividends/distribution', { params })
  },

  // params: period (12m|2y|5y|custom), group (month|year), from, to, asset_id, asset_category_id
  // Resposta: { period, group, from, to, data: [{ period, received, pending }] }
  getEvolution(params = {}) {
    return apiClientV2.get('/dividends/evolution', { params })
  },

  // Força a sincronização. Resposta: { synced, throttled }
  sync() {
    return apiClientV2.post('/dividends/sync')
  }
}
