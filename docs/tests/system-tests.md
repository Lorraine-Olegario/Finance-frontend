# Testes Funcionais do Sistema

> Padrão definido em `docs/patterns/`
> Atualizado em: 2026-04-05

---

## Padrão de Teste

```
Componente:       Nome do componente Vue
Tela:             Rota / página onde está
Funcionalidade:   O que está sendo testado
Endpoint:         Rota de API envolvida (se houver)
Resultado esperado: O que deve acontecer
Resultado obtido:   O que realmente acontece
Status:           ✅ OK | ❌ Falha | ⚠️ Parcial
Observação:       Causa raiz / próximo passo
```

---

# AUTENTICAÇÃO

## T001 — Login com credenciais válidas

```
Componente:         Login.vue
Tela:               /login
Funcionalidade:     Autenticar usuário
Endpoint:           POST /auth/login
Resultado esperado: Token salvo, redirect para /
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

## T002 — Login com credenciais inválidas

```
Componente:         Login.vue
Tela:               /login
Funcionalidade:     Exibir erro de autenticação
Endpoint:           POST /auth/login
Resultado esperado: Mensagem de erro visível, não redireciona
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

## T003 — Logout

```
Componente:         Sidebar / MainLayout
Tela:               Qualquer
Funcionalidade:     Encerrar sessão
Endpoint:           POST /auth/logout
Resultado esperado: Token removido, redirect para /login
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

---

# MEUS ATIVOS (`/my-assets`)

## T010 — Listar ativos do usuário

```
Componente:         Assets.vue (pages)
Tela:               /my-assets
Funcionalidade:     Carregar e exibir lista de ativos
Endpoint:           GET /user/ativos/todos
Resultado esperado: Tabela com todos os ativos do usuário
Resultado obtido:   ✅ Corrigido — endpoint estava apontando para /users/listagem/ativos (admin only)
Status:             ✅ OK (após correção)
Observação:         Corrigido em assetService.getAllUserAssets()
```

## T011 — Paginação da lista de ativos

```
Componente:         Pagination.vue
Tela:               /my-assets
Funcionalidade:     Navegar entre páginas
Endpoint:           Paginação client-side após fetch completo
Resultado esperado: Botões prev/next visíveis e funcionais quando > 10 ativos
Resultado obtido:   ✅ Corrigido — botões ficavam invisíveis (background igual ao container)
Status:             ✅ OK (após correção)
Observação:         background alterado de --bg-secondary para --surface
```

## T012 — Filtros de ativos

```
Componente:         AssetsFilterDrawer.vue
Tela:               /my-assets
Funcionalidade:     Filtrar por busca, categoria e status
Endpoint:           —
Resultado esperado: Lista filtrada em tempo real
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

## T013 — Adicionar ativo (modal)

```
Componente:         AddAssetModal.vue
Tela:               /my-assets
Funcionalidade:     Abrir modal, selecionar categoria, inserir códigos, salvar
Endpoint:           POST /user/ativos
Resultado esperado: Modal abre, botão Adicionar envia requisição, lista atualiza
Resultado obtido:   ✅ Corrigido — ActionButton disparava @click duas vezes
Status:             ✅ OK (após correção)
Observação:         ActionButton com inheritAttrs: false + v-bind=$attrs causava double-fire
```

## T014 — Editar cor da categoria (modal)

```
Componente:         EditAssetModal.vue
Tela:               /my-assets
Funcionalidade:     Alterar cor da categoria do ativo
Endpoint:           PUT /user/category-colors
Resultado esperado: Modal abre com ativo correto, salva cor, fecha
Resultado obtido:   Funciona corretamente após correção do ActionButton
Status:             ✅ OK
Observação:         🔧 PA-003 corrigido — import atualizado para @/components/organisms/ConfirmationModal.vue
```

## T015 — Ativar ativo

```
Componente:         ConfirmationModal.vue (organisms)
Tela:               /my-assets
Funcionalidade:     Alterar status para "ativo"
Endpoint:           PUT /user/ativos/status
Resultado esperado: Modal abre, confirma, status atualiza na tabela
Resultado obtido:   ✅ Corrigido — ActionButton disparava handler duas vezes
Status:             ✅ OK (após correção)
Observação:         —
```

## T016 — Pausar ativo

```
Componente:         ConfirmationModal.vue (organisms)
Tela:               /my-assets
Funcionalidade:     Alterar status para "inativo"
Endpoint:           PUT /user/ativos/status
Resultado esperado: Modal abre, confirma, status atualiza
Resultado obtido:   ✅ OK (após correção do ActionButton)
Status:             ✅ OK
Observação:         —
```

## T017 — Marcar como observando

```
Componente:         ConfirmationModal.vue (organisms)
Tela:               /my-assets
Funcionalidade:     Alterar status para "observando"
Endpoint:           PUT /user/ativos/status
Resultado esperado: Modal abre, confirma, status atualiza, badge de olho aparece
Resultado obtido:   ✅ OK (após correção do ActionButton)
Status:             ✅ OK
Observação:         —
```

## T018 — Deletar ativo

```
Componente:         ConfirmationModal.vue (organisms)
Tela:               /my-assets
Funcionalidade:     Remover ativo da carteira
Endpoint:           DELETE /user/ativos/{id}
Resultado esperado: Modal de confirmação abre, confirma, ativo some da lista
Resultado obtido:   ✅ OK (após correção do ActionButton)
Status:             ✅ OK
Observação:         —
```

## T019 — Cores de categoria

```
Componente:         Badge.vue + getCategoryColor()
Tela:               /my-assets
Funcionalidade:     Exibir badge com cor correta por tipo
Endpoint:           GET /user/category-colors
Resultado esperado: Cor do usuário se salva; caso contrário, paleta do sistema
Resultado obtido:   ✅ Corrigido — defaults usavam "Ações"/"FIIs" mas API retorna "AÇÃO"/"FII"
Status:             ✅ OK (após correção)
Observação:         getCategoryColor() atualizado com mapa uppercase e todas as categorias
```

---

# ATIVOS OBSERVADOS (`/observed`)

## T020 — Listar ativos observados

```
Componente:         ObservedAssets.vue (pages)
Tela:               /observed
Funcionalidade:     Exibir ativos com status "observando" e seus alertas
Endpoint:           GET /user/ativos/observados + GET /user/alertas
Resultado esperado: Tabela com ativos e informações de alerta mescladas
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         Merging por ativo_id funciona corretamente
```

## T021 — Configurar/editar alerta

```
Componente:         EditAlertModal.vue (organisms/observed)
Tela:               /observed
Funcionalidade:     Criar ou editar alerta de preço
Endpoint:           POST /user/alertas | PUT /user/alertas/{id}
Resultado esperado: Modal abre, campos preenchidos se alerta existir, salva
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         Validação: pelo menos um valor (min ou max) obrigatório
```

## T022 — Parar de observar ativo

```
Componente:         ConfirmationModal.vue
Tela:               /observed
Funcionalidade:     Remover ativo da lista de observados
Endpoint:           PUT /user/ativos/status (status: "ativo")
Resultado esperado: Modal confirma, ativo some da lista
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         Remove do estado local imediatamente (sem refetch)
```

## T023 — Cotações em tempo real

```
Componente:         ObservedAssets.vue
Tela:               /observed
Funcionalidade:     Exibir preço atual dos ativos por página
Endpoint:           GET /ativos/cotacao?codigos[]=...
Resultado esperado: Preço exibido na coluna "Valor Atual"
Resultado obtido:   Funciona; erros de cotação são silenciosos (só log)
Status:             ✅ OK
Observação:         Busca é feita por página, não para todos de uma vez
```

---

# DASHBOARD (`/`)

## T030 — Carregamento do Dashboard

```
Componente:         Dashboard.vue
Tela:               /
Funcionalidade:     Exibir métricas, gráfico e ações rápidas
Endpoint:           GET /user/ativos/resumo + /user/category-colors + /user/alertas
Resultado esperado: Cards com contagens, gráfico de donut, ações rápidas
Resultado obtido:   Funciona corretamente (3 chamadas paralelas)
Status:             ✅ OK
Observação:         Admins também chamam GET /users para contar usuários
```

## T031 — Gráfico de distribuição

```
Componente:         DashboardCharts.vue
Tela:               /
Funcionalidade:     Gráfico Chart.js com distribuição por categoria
Endpoint:           —
Resultado esperado: Donut chart com cores por categoria; lista Top 5 abaixo
Resultado obtido:   Funciona; chart destrói e recria ao mudar dados
Status:             ✅ OK
Observação:         Usa cores do usuário (categoryColors prop)
```

---

# COTAÇÕES (`/quotes`)

## T040 — Listar cotações

```
Componente:         Quotes.vue
Tela:               /quotes
Funcionalidade:     Buscar cotação para cada ativo do usuário
Endpoint:           GET /user/ativos/todos + GET /ativos/cotacao (individual por ativo)
Resultado esperado: Cards com preço, variação e nome do ativo
Resultado obtido:   Funciona; cotações buscadas sequencialmente por ativo
Status:             ✅ OK
Observação:         ⚠️ Busca sequencial pode ser lenta para muitos ativos (sem otimização batch)
```

---

# HISTÓRICO (`/history`)

## T050 — Buscar histórico de ativo

```
Componente:         History.vue
Tela:               /history
Funcionalidade:     Inserir código e exibir histórico de preços
Endpoint:           GET /ativos/historico?codigo=BBAS3
Resultado esperado: Tabela com data, preço e variação
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

---

# CATEGORIAS (`/categories`) — Admin

## T060 — Listar categorias

```
Componente:         Categories.vue
Tela:               /categories
Funcionalidade:     Exibir cards de categorias com contagem de ativos
Endpoint:           GET /categorias
Resultado esperado: Grid de cards com nome, cor e contagem
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

## T061 — Criar categoria

```
Componente:         CategoryFormModal.vue
Tela:               /categories
Funcionalidade:     Formulário nome + cor, salvar
Endpoint:           POST /categorias
Resultado esperado: Modal abre, salva, card aparece na grid
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

## T062 — Editar categoria

```
Componente:         CategoryFormModal.vue
Tela:               /categories
Funcionalidade:     Editar nome e cor existente
Endpoint:           PUT /categorias/{id}
Resultado esperado: Modal pré-populado, salva alterações
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

## T063 — Deletar categoria com ativos vinculados

```
Componente:         Categories.vue + ConfirmationModal
Tela:               /categories
Funcionalidade:     Bloquear exclusão se há ativos vinculados
Endpoint:           DELETE /categorias/{id}
Resultado esperado: Botão deletar desabilitado (ativos_count > 0)
Resultado obtido:   Funciona corretamente (botão disabled no frontend)
Status:             ✅ OK
Observação:         Backend também deve validar e retornar 422
```

---

# USUÁRIOS (`/users`) — Admin

## T070 — Listar usuários

```
Componente:         Users.vue
Tela:               /users
Funcionalidade:     Exibir tabela de usuários com role
Endpoint:           GET /users
Resultado esperado: Tabela com nome, email e badge de role
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

## T071 — Criar usuário

```
Componente:         UserFormModal.vue
Tela:               /users
Funcionalidade:     Formulário completo + senha + role
Endpoint:           POST /users
Resultado esperado: Modal abre, valida campos, salva, lista atualiza
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         Validações client-side: senha mínimo 8 chars, confirmação obrigatória
```

---

# CONFIGURAÇÕES (`/settings`)

## T080 — Personalizar cores de categoria

```
Componente:         Settings.vue
Tela:               /settings
Funcionalidade:     Color picker por categoria, salvar
Endpoint:           GET /user/category-colors + PUT /user/category-colors
Resultado esperado: Cores carregadas, alteração persistida
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

---

# PERFIL (`/profile`)

## T090 — Atualizar dados pessoais

```
Componente:         UserProfile.vue
Tela:               /profile
Funcionalidade:     Alterar nome e email
Endpoint:           PUT /user/profile
Resultado esperado: Formulário salva, mensagem de sucesso
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         —
```

## T091 — Alterar senha

```
Componente:         UserProfile.vue
Tela:               /profile
Funcionalidade:     Validar senha atual, definir nova
Endpoint:           PUT /user/password
Resultado esperado: Validação client-side + server-side, sucesso ou erro claro
Resultado obtido:   Funciona corretamente
Status:             ✅ OK
Observação:         Senha mínimo 8 chars; confirmação validada client-side
```

---

# BUGS ENCONTRADOS E CORRIGIDOS

| ID | Componente | Descrição | Status |
|----|-----------|-----------|--------|
| BUG-001 | `Assets.vue` | Endpoint `/users/listagem/ativos` é admin-only; usuários comuns não viam lista | ✅ Corrigido → `/user/ativos/todos` |
| BUG-002 | `Assets.vue` | Parser de resposta não reconhecia estrutura `data.ativos.data` do backend | ✅ Corrigido |
| BUG-003 | `Assets.vue` | `catch` silencioso impossibilitava diagnóstico de erros | ✅ Corrigido → `fetchError` exibido via `AlertMessage` |
| BUG-004 | `ActionButton.vue` | `v-bind="$attrs"` + `inheritAttrs:true` causava double-fire em todos os `@click` | ✅ Corrigido → `defineOptions({ inheritAttrs: false })` |
| BUG-005 | `Assets.vue` | `getCategoryColor()` usava chaves `"Ações"/"FIIs"` que não batiam com `tipo` da API (`"AÇÃO"/"FII"`) | ✅ Corrigido → mapa uppercase com todas as categorias |
| BUG-006 | `Pagination.vue` | Botões prev/next invisíveis (background `--bg-secondary` sobre container `--bg-secondary`) | ✅ Corrigido → `--surface` (branco) |
| BUG-007 | `assetService.js` | `getAllUserAssets` recebia `userId` mas endpoint não usa; parâmetro removido | ✅ Corrigido |

---

# PONTOS DE ATENÇÃO (não são bugs, mas merecem monitoramento)

| ID | Componente | Descrição | Prioridade |
|----|-----------|-----------|------------|
| PA-001 | `Quotes.vue` | Cotações buscadas sequencialmente (1 por vez); para carteiras grandes pode ser lento | Média |
| PA-002 | `ConfirmationModal` | `setTimeout(resolve, 500)` fecha modal mesmo se API demorar > 500ms | Baixa |
| PA-003 | `EditAssetModal` | Usa `ConfirmationModal` legado (`my-assets/`) em vez do organisms; inconsistência | ✅ Corrigido → import atualizado + `resetColor()` corrigido para uppercase |
| PA-004 | `ObservedAssets` (views) | Arquivo legado em `src/views/` ainda existe mas não é roteado — remover na migração | Baixa |
