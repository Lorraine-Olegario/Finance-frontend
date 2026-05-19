# Contrato de API — Frontend ↔ Backend

> Documento de referência para todos os endpoints consumidos pelo frontend.
> Atualizado em: 2026-04-05

---

## Convenções Gerais

| Item | Valor |
|------|-------|
| Base URL | `VITE_API_BASE_URL` (`.env`) |
| Autenticação | `Authorization: Bearer {token}` em todas as rotas protegidas |
| Content-Type | `application/json` |
| Token storage | `localStorage` (chave: `token`) |
| Resposta 401 | Redirect automático para `/login` |
| Resposta 403 | Log de acesso proibido, sem redirect |

---

## 1. Autenticação

### `POST /auth/login`
**Tela:** Login
**Utilizado em:** `authStore.login()`

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response 200:**
```json
{
  "token": "eyJ0eXAiOiJKV1Q...",
  "user": {
    "id": 1,
    "name": "Lorraine",
    "email": "usuario@email.com",
    "role": "admin | user"
  }
}
```

**Response 401:**
```json
{ "message": "Credenciais inválidas" }
```

**Regras:**
- Token salvo em `localStorage.token`
- User salvo em `localStorage.user`
- Redirecionar para `/` após login

---

### `POST /auth/logout`
**Utilizado em:** `authStore.logout()`

**Response 200:** `{ "message": "Logout realizado com sucesso" }`

**Regras:**
- Limpar `localStorage.token` e `localStorage.user`
- Redirecionar para `/login`

---

### `GET /auth/me`
**Utilizado em:** `authStore.fetchUser()`

**Response 200:**
```json
{
  "id": 1,
  "name": "Lorraine",
  "email": "usuario@email.com",
  "role": "admin | user"
}
```

---

## 2. Ativos do Usuário

### `GET /user/ativos/todos`  ⭐ Rota principal
**Tela:** Meus Ativos
**Utilizado em:** `assetService.getAllUserAssets(page, per_page)`
**Auth:** Usuário autenticado

**Query Params:**
```
page=1
per_page=100
```

**Response 200:**
```json
{
  "user_id": 1,
  "total": 19,
  "ativos": {
    "current_page": 1,
    "data": [
      {
        "id": 11,
        "codigo": "BBAS3",
        "nome": "BBAS3",
        "tipo": "AÇÃO",
        "status": "observando | ativo | inativo",
        "observa": false,
        "created_at": "2026-02-27T00:23:52.000000Z",
        "updated_at": "2026-02-27T01:50:52.000000Z"
      }
    ],
    "last_page": 2,
    "per_page": 10,
    "total": 19
  }
}
```

**Regras:**
- `tipo` retorna em MAIÚSCULAS: `"AÇÃO"`, `"FII"`, `"ETFS"`, `"BDR"`, `"CRIPTO"`, `"RENDA FIXA"`
- `status` pode ser: `"ativo"`, `"observando"`, `"inativo"`
- Frontend faz múltiplas requisições se `last_page > 1` e consolida tudo

---

### `GET /user/ativos/resumo`
**Tela:** Dashboard
**Utilizado em:** `assetService.getUserAssetsSummary()`

**Response 200:**
```json
{
  "total": 19,
  "por_tipo": {
    "AÇÃO": 5,
    "FII": 8,
    "ETFS": 1
  }
}
```

---

### `POST /user/ativos`
**Tela:** Meus Ativos — Modal Adicionar
**Utilizado em:** `assetService.createUserAssets(ativos)`

**Request:**
```json
{
  "ativos": {
    "AÇÃO": ["PETR4", "VALE3", "BBAS3"]
  }
}
```

**Response 201:**
```json
{
  "message": "Ativos adicionados com sucesso",
  "adicionados": ["PETR4", "VALE3"],
  "ignorados": ["BBAS3"]
}
```

**Response 422:**
```json
{
  "message": "Dados inválidos",
  "errors": { "ativos": ["O campo ativos é obrigatório"] }
}
```

**Regras:**
- Chave do objeto é o `tipo` (categoria) do ativo
- Valor é array de códigos (strings em maiúsculas)
- Ativos já cadastrados são ignorados (não retornam erro)
- Frontend recarrega lista após sucesso

---

### `PUT /user/ativos/status`
**Tela:** Meus Ativos — Ativar / Pausar / Observar
**Utilizado em:** `assetService.updateAssetStatus(ativo)`

**Request:**
```json
{
  "ativo_id": 11,
  "status": "ativo | inativo | observando"
}
```

**Response 200:**
```json
{
  "message": "Status atualizado com sucesso",
  "ativo": { "id": 11, "status": "ativo" }
}
```

**Response 422:**
```json
{ "message": "Status inválido" }
```

**Regras:**
- Status deve ser estritamente `"ativo"`, `"inativo"` ou `"observando"`
- Frontend atualiza estado local sem refetch completo

---

### `DELETE /user/ativos/{id}`
**Tela:** Meus Ativos — Deletar
**Utilizado em:** `assetService.deleteAsset(ativoId)`

**Response 200:**
```json
{ "message": "Ativo removido com sucesso" }
```

**Response 404:**
```json
{ "message": "Ativo não encontrado" }
```

---

### `GET /user/ativos/observados`
**Tela:** Ativos Observados
**Utilizado em:** `assetService.getObservedAssets()`

**Response 200:**
```json
{
  "observados": [
    {
      "id": 11,
      "codigo": "BBAS3",
      "nome": "BBAS3",
      "tipo": "AÇÃO",
      "status": "observando"
    }
  ]
}
```

---

## 3. Cotações

### `GET /ativos/cotacao`
**Tela:** Cotações / Ativos Observados
**Utilizado em:** `assetService.getAssetQuotes(codigos)`

**Query Params:**
```
codigos[]=BBAS3&codigos[]=VALE3
```

**Response 200:**
```json
[
  {
    "symbol": "BBAS3",
    "price": 22.45,
    "change": 0.35,
    "changePercent": 1.58,
    "volume": 1234567,
    "name": "Banco do Brasil"
  }
]
```

**Regras:**
- Frontend usa `quote.symbol` para cruzar com `asset.codigo`
- Falhas de cotação individuais são silenciosas (log de erro, lista continua)

---

### `GET /ativos/historico`
**Tela:** Histórico
**Utilizado em:** `assetService.getAssetHistory(codigo)`

**Query Params:**
```
codigo=BBAS3
```

**Response 200:**
```json
[
  {
    "date": "2026-04-01",
    "symbol": "BBAS3",
    "name": "Banco do Brasil",
    "price": 22.45,
    "change": 0.35,
    "changePercent": 1.58
  }
]
```

---

## 4. Alertas

### `GET /user/alertas`
**Tela:** Ativos Observados
**Utilizado em:** `assetService.getAssetAlerts()`

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "ativo_id": 11,
      "valor_min": 20.00,
      "valor_max": 25.00,
      "notificar_valor_min": true,
      "notificar_valor_max": true,
      "frequencia": "diario | todas_as_vezes | semanal",
      "status": "ativo | inativo"
    }
  ]
}
```

---

### `POST /user/alertas`
**Utilizado em:** `assetService.saveAssetAlert(alertData)`

**Request:**
```json
{
  "ativo_id": 11,
  "valor_min": 20.00,
  "valor_max": 25.00,
  "notificar_valor_min": true,
  "notificar_valor_max": true,
  "frequencia": "diario",
  "status": "ativo"
}
```

**Response 201/200:**
```json
{
  "message": "Alerta salvo com sucesso",
  "alerta": { "id": 1, "ativo_id": 11, ... }
}
```

**Regras:**
- Pelo menos `valor_min` ou `valor_max` deve ser informado
- Se valor informado, notificação correspondente deve ser `true`

---

### `PUT /user/alertas/{id}`
**Utilizado em:** `assetService.updateAssetAlert(alertId, alertData)`

Mesma estrutura do POST.

---

### `DELETE /user/alertas/{id}`
**Utilizado em:** `assetService.deleteAssetAlert(alertId)`

**Response 200:** `{ "message": "Alerta removido" }`

---

## 5. Categorias

### `GET /categorias`
**Tela:** Categorias (Admin) / Modais
**Utilizado em:** `categoryService.getAll()`

**Response 200:**
```json
{
  "data": [
    { "id": 1, "nome": "AÇÃO", "color": "#3b82f6", "ativos_count": 5 }
  ]
}
```

**Regras:**
- Admin: tela completa de CRUD
- Usuário comum: usa apenas para popular selects nos modais

---

### `POST /categorias`
**Request:** `{ "nome": "CRIPTO", "color": "#ec4899" }`
**Response 201:** `{ "id": 5, "nome": "CRIPTO", "color": "#ec4899" }`

### `PUT /categorias/{id}`
**Request:** `{ "nome": "CRIPTO", "color": "#ec4899" }`

### `DELETE /categorias/{id}`
**Response 200:** `{ "message": "Categoria removida" }`
**Response 422:** `{ "message": "Categoria possui ativos vinculados" }` (bloqueia exclusão)

---

## 6. Cores de Categoria

### `GET /user/category-colors`
**Utilizado em:** `assetService.getCategoryColors(userId)`

**Query Params:** `user_id=1`

**Response 200:**
```json
{
  "colors": {
    "AÇÃO": "#3b82f6",
    "FII": "#10b981",
    "ETFS": "#f59e0b"
  }
}
```

---

### `PUT /user/category-colors`
**Utilizado em:** `assetService.updateCategoryColors(userId, colors)`

**Request:**
```json
{
  "colors": {
    "AÇÃO": "#3b82f6",
    "FII": "#10b981"
  }
}
```

**Response 200:** `{ "message": "Cores atualizadas" }`

---

## 7. Usuários (Admin)

### `GET /users`
**Response 200:**
```json
{
  "data": [
    { "id": 1, "name": "Lorraine", "email": "l@email.com", "role": "admin" }
  ]
}
```

### `POST /users`
**Request:** `{ "name": "...", "email": "...", "password": "...", "password_confirmation": "...", "role": "user | admin" }`

### `PUT /users/{id}`
**Request:** `{ "name": "...", "email": "...", "role": "user | admin" }`

### `DELETE /users/{id}`
**Response 200:** `{ "message": "Usuário removido" }`

---

## 8. Perfil do Usuário

### `PUT /user/profile`
**Request:** `{ "name": "Lorraine", "email": "l@email.com" }`

### `PUT /user/password`
**Request:**
```json
{
  "current_password": "senha_atual",
  "new_password": "nova_senha",
  "new_password_confirmation": "nova_senha"
}
```

**Response 422:**
```json
{ "message": "Senha atual incorreta" }
```

---

## Mapeamento Frontend → Backend

| Tela | Service Method | Endpoint |
|------|---------------|----------|
| Dashboard | `getUserAssetsSummary()` | `GET /user/ativos/resumo` |
| Dashboard | `getCategoryColors()` | `GET /user/category-colors` |
| Dashboard | `getAssetAlerts()` | `GET /user/alertas` |
| Meus Ativos | `getAllUserAssets()` | `GET /user/ativos/todos` |
| Meus Ativos | `createUserAssets()` | `POST /user/ativos` |
| Meus Ativos | `updateAssetStatus()` | `PUT /user/ativos/status` |
| Meus Ativos | `deleteAsset()` | `DELETE /user/ativos/{id}` |
| Ativos Observados | `getObservedAssets()` | `GET /user/ativos/observados` |
| Ativos Observados | `getAssetAlerts()` | `GET /user/alertas` |
| Ativos Observados | `getAssetQuotes()` | `GET /ativos/cotacao` |
| Cotações | `getAllUserAssets()` | `GET /user/ativos/todos` |
| Cotações | `getAssetQuote()` | `GET /ativos/cotacao` |
| Histórico | `getAssetHistory()` | `GET /ativos/historico` |
| Configurações | `getCategoryColors()` | `GET /user/category-colors` |
| Configurações | `updateCategoryColors()` | `PUT /user/category-colors` |
| Categorias (Admin) | `categoryService.*` | `CRUD /categorias` |
| Usuários (Admin) | `userService.*` | `CRUD /users` |
