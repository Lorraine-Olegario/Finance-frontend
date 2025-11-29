# Alterações Necessárias no Backend

## 📋 Resumo das Mudanças

O frontend foi completamente refatorado para:
- ✅ Usar select dinâmico de categorias (carregadas da API)
- ✅ Remover inputs fixos de "Ações" e "FIIs"
- ✅ Modularizar em componentes separados
- ✅ Remover todos os console.log
- ✅ Usar classes CSS ao invés de estilos inline

## 1. Nova Rota: Criar Múltiplos Ativos em Lote

### Endpoint
```
POST /api/v1/user-assets/bulk
```

### Descrição
Permite criar múltiplos ativos de usuário em uma única requisição, com suporte para categorias dinâmicas.

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Request Body
```json
{
  "user_id": 1,
  "assets": [
    {
      "codigo": "PETR4",
      "categoria": "Ações"
    },
    {
      "codigo": "VALE3",
      "categoria": "Ações"
    },
    {
      "codigo": "HGLG11",
      "categoria": "FIIs"
    },
    {
      "codigo": "MXRF11",
      "categoria": "Fundos Imobiliários"
    },
    {
      "codigo": "BTC",
      "categoria": "Criptomoedas"
    }
  ]
}
```

### Validações Necessárias

1. **user_id**: Obrigatório, deve ser um inteiro válido
2. **assets**: Obrigatório, array não vazio
3. **assets[].codigo**: Obrigatório, string, tamanho mínimo 3 caracteres
4. **assets[].categoria**: Obrigatório, string, tamanho mínimo 2 caracteres

### Regras de Negócio

1. Verificar se o usuário existe
2. Verificar se cada ativo já existe na carteira do usuário (evitar duplicatas)
3. **Se a categoria não existir no sistema, criar automaticamente**
4. Retornar quais ativos foram criados com sucesso e quais falharam (se houver)

### Response - Sucesso (201 Created)
```json
{
  "message": "Ativos adicionados com sucesso",
  "created": 4,
  "failed": 1,
  "details": {
    "created_assets": [
      {
        "id": 101,
        "codigo": "PETR4",
        "categoria": "Ações",
        "status": "ativo"
      },
      {
        "id": 102,
        "codigo": "VALE3",
        "categoria": "Ações",
        "status": "ativo"
      },
      {
        "id": 103,
        "codigo": "HGLG11",
        "categoria": "FIIs",
        "status": "ativo"
      },
      {
        "id": 104,
        "codigo": "BTC",
        "categoria": "Criptomoedas",
        "status": "ativo"
      }
    ],
    "failed_assets": [
      {
        "codigo": "MXRF11",
        "categoria": "Fundos Imobiliários",
        "reason": "Ativo já existe na carteira"
      }
    ]
  }
}
```

### Response - Erro (400 Bad Request)
```json
{
  "message": "Dados inválidos",
  "errors": {
    "assets": ["O campo assets é obrigatório"],
    "assets.0.codigo": ["O código do ativo é obrigatório"]
  }
}
```

### Response - Erro (401 Unauthorized)
```json
{
  "message": "Não autorizado"
}
```

### Response - Erro (404 Not Found)
```json
{
  "message": "Usuário não encontrado"
}
```

---

## 2. Endpoint para Listar Categorias (CRÍTICO)

### Endpoint
```
GET /api/v1/categorias
```

### Descrição
Retorna a lista de todas as categorias cadastradas no sistema.
**Este endpoint é essencial para popular o select dinâmico no frontend.**

### Headers
```
Authorization: Bearer {token}
```

### Response - Sucesso (200 OK)
```json
{
  "data": [
    {
      "id": 1,
      "nome": "Ações",
      "created_at": "2025-01-01T10:00:00Z"
    },
    {
      "id": 2,
      "nome": "FIIs",
      "created_at": "2025-01-01T10:00:00Z"
    },
    {
      "id": 3,
      "nome": "Criptomoedas",
      "created_at": "2025-01-15T14:30:00Z"
    },
    {
      "id": 4,
      "nome": "Fundos Imobiliários",
      "created_at": "2025-01-20T09:15:00Z"
    }
  ]
}
```

**⚠️ IMPORTANTE:** O frontend espera que o campo seja `nome` (minúsculo). Se a API retornar `name`, ajustar no frontend ou padronizar no backend.

---

## 3. Observações Importantes

### Criação Automática de Categorias
- Quando um ativo for adicionado com uma categoria que não existe, o backend **DEVE** criar essa categoria automaticamente
- A categoria deve ser armazenada com a primeira letra maiúscula e o resto minúscula
- Exemplo: "criptomoedas" → "Criptomoedas"
- Exemplo: "AÇÕES" → "Ações"

### Tratamento de Duplicatas
- Se um ativo com o mesmo código já existir na carteira do usuário, não criar novamente
- Retornar na lista de `failed_assets` com a razão "Ativo já existe na carteira"
- **NÃO falhar toda a requisição**, apenas aquele ativo específico

### Performance
- A criação em lote deve ser otimizada para não fazer N queries individuais
- Usar transações para garantir consistência dos dados
- Considerar usar `INSERT ... ON CONFLICT` ou `UPSERT` se o banco suportar

---

## 4. Exemplo de Implementação (Laravel/PHP)

```php
<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\UserAsset;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserAssetController extends Controller
{
    /**
     * Criar múltiplos ativos em lote
     */
    public function createBulk(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'assets' => 'required|array|min:1',
            'assets.*.codigo' => 'required|string|min:3|max:10',
            'assets.*.categoria' => 'required|string|min:2|max:50',
        ]);

        $created = [];
        $failed = [];

        DB::beginTransaction();
        
        try {
            foreach ($validated['assets'] as $assetData) {
                $codigo = strtoupper(trim($assetData['codigo']));
                $categoriaNome = ucfirst(strtolower(trim($assetData['categoria'])));

                // Verificar se já existe
                $exists = UserAsset::where('user_id', $validated['user_id'])
                    ->where('codigo', $codigo)
                    ->exists();

                if ($exists) {
                    $failed[] = [
                        'codigo' => $codigo,
                        'categoria' => $categoriaNome,
                        'reason' => 'Ativo já existe na carteira'
                    ];
                    continue;
                }

                // Criar ou buscar categoria
                $categoria = Category::firstOrCreate(
                    ['nome' => $categoriaNome],
                    ['created_at' => now(), 'updated_at' => now()]
                );

                // Criar ativo
                $userAsset = UserAsset::create([
                    'user_id' => $validated['user_id'],
                    'codigo' => $codigo,
                    'categoria_id' => $categoria->id,
                    'status' => 'ativo',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                $created[] = [
                    'id' => $userAsset->id,
                    'codigo' => $userAsset->codigo,
                    'categoria' => $categoria->nome,
                    'status' => $userAsset->status
                ];
            }

            DB::commit();

            return response()->json([
                'message' => 'Ativos processados com sucesso',
                'created' => count($created),
                'failed' => count($failed),
                'details' => [
                    'created_assets' => $created,
                    'failed_assets' => $failed
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erro ao adicionar ativos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
```

### Adicionar Rota (routes/api.php)

```php
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // ... outras rotas
    
    Route::post('/user-assets/bulk', [UserAssetController::class, 'createBulk']);
    Route::get('/categorias', [CategoryController::class, 'index']);
});
```

---

## 5. Checklist de Implementação

### Backend
- [ ] Criar rota `POST /api/v1/user-assets/bulk`
- [ ] Implementar validações do request
- [ ] Implementar lógica de criação em lote com transação
- [ ] Implementar criação automática de categorias
- [ ] Implementar tratamento de duplicatas (não falhar toda requisição)
- [ ] Garantir que `GET /api/v1/categorias` retorna campo `nome`
- [ ] Adicionar testes unitários
- [ ] Adicionar testes de integração
- [ ] Atualizar documentação da API

### Frontend (✅ Concluído)
- [x] Criar componente `AddAssetModal.vue`
- [x] Criar componente `EditAssetModal.vue`
- [x] Criar componente `ConfirmationModal.vue`
- [x] Refatorar `Assets.vue` para usar os novos componentes
- [x] Remover todos os console.log
- [x] Remover estilos inline
- [x] Usar select dinâmico de categorias
- [x] Integrar com `categoryService.getAll()`

---

## 6. Mudanças no Frontend Implementadas

### Componentes Criados
1. **`src/components/modals/AddAssetModal.vue`**
   - Select dinâmico de categorias
   - Input para códigos de ativos separados por vírgula
   - Validação de formulário
   - Emite evento `submit` com `{ categoria, codigos[] }`

2. **`src/components/modals/EditAssetModal.vue`**
   - Edição de nome e status do ativo
   - Seletor de cor de categoria
   - Emite evento `submit` com dados do ativo atualizado

3. **`src/components/modals/ConfirmationModal.vue`**
   - Modal genérico reutilizável
   - Suporta tipos: success, danger, warning, info, primary
   - Usado para confirmar ações (ativar, desativar, observar, deletar)

### Melhorias no `Assets.vue`
- ✅ Código reduzido de ~1600 linhas para ~700 linhas
- ✅ Todos os modais extraídos para componentes separados
- ✅ Categorias carregadas dinamicamente via API
- ✅ Código limpo, sem console.log
- ✅ Sem estilos inline
- ✅ Usa classes CSS padronizadas (similar ao Bootstrap)

---

## 7. Como Testar

### 1. Testar Listagem de Categorias
```bash
curl -X GET http://localhost:8020/api/v1/categorias \
  -H "Authorization: Bearer {seu_token}"
```

Resposta esperada:
```json
{
  "data": [
    { "id": 1, "nome": "Ações" },
    { "id": 2, "nome": "FIIs" }
  ]
}
```

### 2. Testar Criação em Lote
```bash
curl -X POST http://localhost:8020/api/v1/user-assets/bulk \
  -H "Authorization: Bearer {seu_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "assets": [
      { "codigo": "PETR4", "categoria": "Ações" },
      { "codigo": "VALE3", "categoria": "Ações" },
      { "codigo": "HGLG11", "categoria": "FIIs" },
      { "codigo": "BTC", "categoria": "Criptomoedas" }
    ]
  }'
```

---

## 8. Contato

Se houver dúvidas sobre as alterações do frontend ou necessidade de ajuste na integração, consulte:
- Código-fonte: `src/views/Assets.vue`
- Componentes: `src/components/modals/`
- Serviços: `src/services/categoryService.js` e `src/services/assetService.js`
