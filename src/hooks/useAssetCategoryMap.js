import { ref } from 'vue'
import assetService from '@/services/assetService'

function extractCategory(asset) {
  if (asset.categoria && typeof asset.categoria === 'object') {
    return {
      nome: asset.categoria.nome || '',
      color: asset.categoria.color || null
    }
  }
  return { nome: asset.categoria || asset.tipo || '', color: null }
}

/**
 * A API da carteira não retorna categoria por posição/transação — por isso
 * cruzamos o código do ativo com a listagem de ativos do usuário para
 * descobrir a categoria de cada código.
 */
export function useAssetCategoryMap() {
  const assetCategoryMap = ref({})

  async function fetchAssetCategoryMap() {
    try {
      const first = await assetService.getAllUserAssets(1, 100)
      const paginator = first.data?.ativos
      if (!paginator || !Array.isArray(paginator.data)) return

      let all = [...paginator.data]
      if (paginator.last_page > 1) {
        const rest = []
        for (let p = 2; p <= paginator.last_page; p++) {
          rest.push(assetService.getAllUserAssets(p, 100))
        }
        const responses = await Promise.all(rest)
        responses.forEach(res => {
          const d = res.data?.ativos?.data
          if (Array.isArray(d)) all = all.concat(d)
        })
      }

      assetCategoryMap.value = Object.fromEntries(
        all.map(a => [a.codigo, extractCategory(a)])
      )
    } catch {
      assetCategoryMap.value = {}
    }
  }

  function resolveCategory(code) {
    return assetCategoryMap.value[code] || { nome: '', color: null }
  }

  return { assetCategoryMap, fetchAssetCategoryMap, resolveCategory }
}
