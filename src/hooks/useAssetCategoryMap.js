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
 * A API da carteira não retorna categoria nem status por posição/transação —
 * por isso cruzamos o código do ativo com a listagem de ativos do usuário
 * (catálogo, via assetService) para descobrir a categoria e o status de
 * cada código.
 *
 * O status ("ativo" | "inativo" | "observando") só existe no catálogo de
 * ativos, não na carteira (`portfolioService.getSummary()` não sabe
 * distinguir ativos pausados). Isso é um workaround de frontend — o ideal
 * seria a API de carteira já excluir posições pausadas, mas isso está fora
 * deste repositório.
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
        all.map(a => [
          a.codigo,
          { ...extractCategory(a), status: a.status || '' }
        ])
      )
    } catch {
      assetCategoryMap.value = {}
    }
  }

  function resolveCategory(code) {
    return assetCategoryMap.value[code] || { nome: '', color: null }
  }

  /** Status do código no catálogo ('ativo' | 'inativo' | 'observando' | '') */
  function resolveStatus(code) {
    return assetCategoryMap.value[code]?.status || ''
  }

  return {
    assetCategoryMap,
    fetchAssetCategoryMap,
    resolveCategory,
    resolveStatus
  }
}
