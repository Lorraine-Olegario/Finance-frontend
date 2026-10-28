import apiClientV2 from './apiClientV2'

export default {
  // params: period (12m|2y|5y|yearly|custom), from, to (custom), category_id
  // Resposta: { period, from, to, category_id, points: [{ date, label, invested, capital_gain, net_worth }] }
  getEvolution(params = {}) {
    return apiClientV2.get('/net-worth/evolution', { params })
  },

  // view: category|asset
  // Resposta: { total, items: [{ id, label, value, percent, color }] }
  getConsolidation(view = 'category') {
    return apiClientV2.get('/net-worth/consolidation', { params: { view } })
  },

  // view: consolidated|sector|segment|type
  // Resposta: { category, total, available_views: [], items: [{ id?, label, value, percent, color, ideal_percent? }] }
  getCategoryBreakdown(categoryId, view = 'consolidated') {
    return apiClientV2.get(`/net-worth/categories/${categoryId}`, {
      params: { view }
    })
  },

  // payload: { sector, segment, fund_type }
  updateAssetClassification(assetId, payload) {
    return apiClientV2.put(`/assets/${assetId}/classification`, payload)
  }
}
