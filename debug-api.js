// Script de debug para testar a API
// Execute no console do navegador após fazer login

async function debugDashboard() {
  try {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    console.log('User ID:', user.id)
    console.log('Token:', token ? 'Presente' : 'Ausente')

    const response = await fetch(`http://72.61.27.84:8020/api/v1/user_assets?user_id=${user.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    console.log('📊 Resposta completa da API:', data)
    console.log('📊 Estrutura de dados:', JSON.stringify(data, null, 2))

    // Verificar estrutura
    console.log('🔍 data.ativos_por_categoria:', data.ativos_por_categoria)
    console.log('🔍 data.data?.ativos_por_categoria:', data.data?.ativos_por_categoria)

    // Listar todas as chaves
    if (data.ativos_por_categoria) {
      console.log('🔑 Chaves em ativos_por_categoria:', Object.keys(data.ativos_por_categoria))

      Object.entries(data.ativos_por_categoria).forEach(([key, value]) => {
        console.log(`  📁 ${key}:`, typeof value, Array.isArray(value) ? `Array (${value.length})` : value)
      })
    }
  } catch (err) {
    console.error('❌ Erro:', err)
  }
}

// Execute esta função no console
debugDashboard()
