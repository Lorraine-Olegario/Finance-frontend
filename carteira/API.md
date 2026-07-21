
# 📘 Documentação da API

Bem-vindo à documentação da API.  
Aqui você encontra os detalhes dos endpoints disponíveis, organizados por domínio.

---

## 🔹 Usuários

Arquivo: [`doc-api-user.md`](./doc/doc-api-user.md)  

- Cadastro de Usuário (`POST /api/v1/users`)  
- Edição de Usuário (`PUT /api/v1/users/{id}`)  

---

## 🔹 Ativos

Arquivo: [`doc-api-ativos.md`](./doc/doc-api-ativos.md)  

- Cadastro de Ativos do Usuário (`POST /api/v1/user/ativos?user_id=`)  
- Editar Status de Ativos (`PUT /api/v1/user/ativos/status?user_id=`)  
- Histórico de Ativos (`GET /api/v1/ativos/historico`)  
- Cotação de Ativos (`GET /api/v1/ativos/cotacao`)  

---

## 🔹 Carteira (Portfolio)

Arquivo: [`doc-api-carteira.md`](./doc/doc-api-carteira.md)  

- Registrar compra/venda (`POST /api/v2/portfolio/transactions`)  
- Histórico de transações (`GET /api/v2/portfolio/transactions`)  
- Excluir transação (`DELETE /api/v2/portfolio/transactions/{id}`)  
- Posições atuais (`GET /api/v2/portfolio/positions`)  
- Resumo / patrimônio total (`GET /api/v2/portfolio/summary`)  
