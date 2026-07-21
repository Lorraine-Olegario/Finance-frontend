# 🔹 Carteira (Portfolio) — v2

Documentação para o front-end consumir a feature de Carteira: registro de compra/venda de ativos, posições atuais (quantidade, preço médio, valor de mercado, variação, rentabilidade) e patrimônio total do usuário.

- **Base URL**: `http://localhost:8020/api` (ajustar conforme ambiente)
- **Versão**: `v2` (todas as rotas abaixo usam o prefixo `/v2`)
- **Autenticação**: todas as rotas exigem `Authorization: Bearer {token}` (token do Sanctum, o mesmo obtido no login). Sem o header, a API retorna `401`.
- **Content-Type**: `application/json`

---

## Resumo das rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/v2/portfolio/transactions` | Registrar uma compra ou venda |
| `GET` | `/v2/portfolio/transactions` | Listar histórico de transações |
| `DELETE` | `/v2/portfolio/transactions/{id}` | Excluir uma transação lançada errada |
| `GET` | `/v2/portfolio/positions` | Listar posições atuais (o que o usuário tem hoje) |
| `GET` | `/v2/portfolio/summary` | Patrimônio total, total investido e lucro/prejuízo |

> Regra de negócio importante: o preço médio é calculado pelo **método de custo médio ponderado** (padrão B3/IRPF). Uma compra recalcula a média; uma venda apenas reduz a quantidade e **não** altera o preço médio. Não é permitido vender mais do que o usuário possui — a API retorna `422` nesse caso.

---

## 1. Registrar transação (compra ou venda)

`POST /v2/portfolio/transactions`

### Payload de requisição

```json
{
  "asset_code": "PETR4",
  "type": "buy",
  "quantity": 100,
  "unit_price": 32.50,
  "transaction_date": "2026-01-05"
}
```

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `asset_code` | string | sim | Código do ativo (ex: `PETR4`). Máx. 10 caracteres. Deve existir no sistema (o ativo é resolvido pelo código; não é criado automaticamente). |
| `type` | string | sim | `"buy"` (compra) ou `"sell"` (venda). |
| `quantity` | number | sim | Maior que zero. Aceita fração (ex: ativos fracionários). |
| `unit_price` | number | sim | Maior que zero. |
| `transaction_date` | string (`YYYY-MM-DD`) | sim | Não pode ser data futura. |

### Resposta de sucesso — `201 Created`

```json
{
  "success": true,
  "message": "Transaction registered successfully.",
  "transaction": {
    "id": 1,
    "asset_code": "PETR4",
    "type": "buy",
    "quantity": 100,
    "unit_price": 32.5,
    "total_value": 3250,
    "transaction_date": "2026-01-05"
  }
}
```

### Erros possíveis

| Status | Quando ocorre | Corpo da resposta |
|---|---|---|
| `401` | Sem token / token inválido | `{ "message": "Unauthenticated." }` |
| `404` | `asset_code` não existe na base | `{ "success": false, "message": "Asset 'PETR4' not found." }` |
| `422` | Venda maior que a quantidade em carteira | `{ "success": false, "message": "Insufficient quantity in portfolio. Available: 50." }` |
| `422` | Erro de validação do payload | `{ "message": "...", "errors": { "campo": ["mensagem"] } }` (formato padrão de validação do Laravel) |

---

## 2. Listar histórico de transações

`GET /v2/portfolio/transactions`

Sem parâmetros. Retorna todas as transações do usuário autenticado, ordenadas por data (mais antiga primeiro).

### Resposta — `200 OK`

```json
{
  "transactions": [
    {
      "id": 1,
      "asset_code": "PETR4",
      "type": "buy",
      "quantity": 100,
      "unit_price": 10,
      "total_value": 1000,
      "transaction_date": "2026-01-05"
    },
    {
      "id": 2,
      "asset_code": "PETR4",
      "type": "sell",
      "quantity": 40,
      "unit_price": 15,
      "total_value": 600,
      "transaction_date": "2026-01-10"
    }
  ]
}
```

---

## 3. Excluir transação

`DELETE /v2/portfolio/transactions/{id}`

Remove uma transação. Só é possível excluir transações do próprio usuário. A posição (quantidade/preço médio) é recalculada automaticamente a partir do histórico restante — não é preciso fazer nada além de chamar essa rota.

### Resposta de sucesso — `200 OK`

```json
{
  "success": true,
  "message": "Transaction deleted successfully."
}
```

### Erros possíveis

| Status | Quando ocorre |
|---|---|
| `401` | Sem token |
| `404` | Transação não existe ou pertence a outro usuário — `{ "success": false, "message": "Transaction not found." }` |

---

## 4. Listar posições atuais

`GET /v2/portfolio/positions`

Retorna apenas os ativos que o usuário **ainda possui** (quantidade > 0), já calculados com quantidade, preço médio, valor de mercado atual, variação e rentabilidade. Ativos totalmente vendidos não aparecem na lista.

O `current_price` e `daily_variation_percent` vêm do cache de cotação já usado pelo restante do sistema (atualizado periodicamente); podem vir `null` se ainda não houver cotação em cache para o ativo.

### Resposta — `200 OK`

```json
{
  "positions": [
    {
      "asset_id": 4,
      "code": "PETR4",
      "name": "Petrobras PN",
      "quantity": 100,
      "average_price": 15,
      "current_price": 32.5,
      "total_cost": 1500,
      "current_value": 3250,
      "profit_loss": 1750,
      "profit_loss_percent": 116.67,
      "daily_variation_percent": 1.25
    }
  ]
}
```

| Campo | Descrição |
|---|---|
| `quantity` | Quantidade atual em carteira |
| `average_price` | Preço médio de compra (custo médio ponderado) |
| `current_price` | Cotação atual (pode ser `null` se não houver cotação em cache) |
| `total_cost` | `quantity * average_price` — quanto foi investido nesse ativo |
| `current_value` | `quantity * current_price` — valor de mercado hoje |
| `profit_loss` | `current_value - total_cost` (negativo = prejuízo) |
| `profit_loss_percent` | Rentabilidade em % (`null` se `total_cost` for 0) |
| `daily_variation_percent` | Variação do dia do ativo (não é a rentabilidade da posição, é a variação do mercado) |

---

## 5. Resumo da carteira (patrimônio total)

`GET /v2/portfolio/summary`

Agrega todas as posições para dar a visão geral: quanto foi investido, quanto vale hoje, e o lucro/prejuízo total. Inclui a lista de posições completa (mesmo formato do endpoint anterior) para não precisar de duas chamadas.

### Resposta — `200 OK`

```json
{
  "total_invested": 1500,
  "total_current_value": 3250,
  "profit_loss": 1750,
  "profit_loss_percent": 116.67,
  "assets_count": 1,
  "positions": [
    {
      "asset_id": 4,
      "code": "PETR4",
      "name": "Petrobras PN",
      "quantity": 100,
      "average_price": 15,
      "current_price": 32.5,
      "total_cost": 1500,
      "current_value": 3250,
      "profit_loss": 1750,
      "profit_loss_percent": 116.67,
      "daily_variation_percent": 1.25
    }
  ]
}
```

| Campo | Descrição |
|---|---|
| `total_invested` | Soma do `total_cost` de todas as posições |
| `total_current_value` | **Patrimônio total** — soma do `current_value` de todas as posições |
| `profit_loss` | `total_current_value - total_invested` |
| `profit_loss_percent` | Rentabilidade total em % (`null` se `total_invested` for 0, ex: carteira vazia) |
| `assets_count` | Quantidade de ativos diferentes na carteira |

Se o usuário não tiver nenhuma posição, a resposta é:

```json
{
  "total_invested": 0,
  "total_current_value": 0,
  "profit_loss": 0,
  "profit_loss_percent": null,
  "assets_count": 0,
  "positions": []
}
```

---

## Exemplo de fluxo no front-end

1. Tela "Adicionar operação": formulário com `asset_code`, `type` (toggle compra/venda), `quantity`, `unit_price`, `transaction_date` → `POST /v2/portfolio/transactions`.
   - Se vier `422` com a mensagem de "Insufficient quantity...", mostrar esse erro no formulário (venda maior que o saldo).
2. Tela "Minha Carteira" (dashboard principal): `GET /v2/portfolio/summary` — usar `total_current_value` para o card de patrimônio, `profit_loss`/`profit_loss_percent` para o indicador de lucro (verde/vermelho), e `positions` para a tabela de ativos.
3. Tela "Extrato": `GET /v2/portfolio/transactions` — lista histórica, com botão de excluir chamando `DELETE /v2/portfolio/transactions/{id}`.

Referência completa (schemas OpenAPI): `resources/docs/openapi.yaml`, tag `Portfolio`.
