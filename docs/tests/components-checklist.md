# Revisão de Componentes

> Checklist de validação de cada componente do sistema.
> Atualizado em: 2026-04-05

---

## Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Testado e funcionando |
| ❌ | Falha identificada |
| ⚠️ | Funcional com ressalvas |
| 🔧 | Corrigido durante revisão |

---

# ÁTOMOS (`src/components/atoms/`)

## BaseButton

| Teste | Status | Obs |
|-------|--------|-----|
| Renderiza com variant primary | ✅ | |
| Renderiza com variant secondary | ✅ | |
| Renderiza com variant ghost | ✅ | |
| Renderiza com variant danger | ✅ | |
| Estado loading: spinner + disabled | ✅ | |
| Estado disabled: não dispara click | ✅ | |
| Slots icon-left e icon-right | ✅ | |
| Herda eventos nativos via $attrs | ✅ | `inheritAttrs: true` + sem `v-bind=$attrs` explícito — correto |

---

## ActionButton

| Teste | Status | Obs |
|-------|--------|-----|
| Renderiza 36×36px | ✅ | |
| Variant edit: hover roxo | ✅ | |
| Variant delete: hover vermelho | ✅ | |
| Variant play: hover verde | ✅ | |
| Variant pause: hover amarelo | ✅ | |
| Variant observe: hover azul | ✅ | |
| Estado disabled: opacity 0.4, não clicável | ✅ | |
| @click único por clique | ✅ 🔧 | **BUG-004 corrigido** — `inheritAttrs:false` adicionado |

---

## Badge

| Teste | Status | Obs |
|-------|--------|-----|
| Renderiza com label | ✅ | |
| Prop `color` aplica backgroundColor | ✅ | Hex ou var() |
| Sem color: usa cinza `#6b7280` | ✅ | |
| Texto branco sobre qualquer cor | ✅ | |

---

## StatusBadge

| Teste | Status | Obs |
|-------|--------|-----|
| Status "ativo": verde | ✅ | |
| Status "inativo": vermelho | ✅ | |
| Status "observando": amarelo | ✅ | |
| Prop inválida (validator) | ✅ | Vue warning em dev |

---

## Pagination

| Teste | Status | Obs |
|-------|--------|-----|
| Botões prev/next visíveis | ✅ 🔧 | **BUG-006 corrigido** — background `--surface` |
| Botão prev desabilitado na página 1 | ✅ | opacity 0.3 |
| Botão next desabilitado na última página | ✅ | |
| Ellipsis para muitas páginas | ✅ | |
| Evento page-change emitido ao clicar | ✅ | |
| showTotal exibe contagem | ✅ | |
| Oculto quando lastPage <= 1 (controls) | ✅ | Esperado |

---

## AlertMessage

| Teste | Status | Obs |
|-------|--------|-----|
| Tipo error: ícone + fundo vermelho | ✅ | |
| Tipo warning: ícone + fundo amarelo | ✅ | |
| Tipo success: ícone + fundo verde | ✅ | |
| Tipo info: ícone + fundo azul | ✅ | |
| dismissible: botão X aparece | ✅ | |
| Evento dismiss emitido ao fechar | ✅ | |

---

## EmptyState

| Teste | Status | Obs |
|-------|--------|-----|
| Renderiza title e description | ✅ | |
| Slot icon renderiza ícone customizado | ✅ | |
| Slot action renderiza botão | ✅ | |

---

## LoadingSpinner

| Teste | Status | Obs |
|-------|--------|-----|
| Renderiza spinner e mensagem | ✅ | |
| Mode fullscreen: posição fixed | ✅ | |
| Prop message customizado | ✅ | |

---

## BaseInput

| Teste | Status | Obs |
|-------|--------|-----|
| v-model funciona | ✅ | |
| Focus: borda primária | ✅ | |
| Readonly: fundo cinza | ✅ | |
| Tipo password | ✅ | |
| Emite blur e focus | ✅ | |

---

## BaseSelect

| Teste | Status | Obs |
|-------|--------|-----|
| v-model funciona | ✅ | |
| Array de options renderiza | ✅ | |
| Placeholder selecionado por padrão | ✅ | |
| Disabled: não editável | ✅ | |

---

## StatCard

| Teste | Status | Obs |
|-------|--------|-----|
| Variantes primary/success/info/warning | ✅ | |
| Valor numérico grande exibido | ✅ | |
| Slot icon | ✅ | |
| Hover: card levanta | ✅ | |

---

## SvgIcon

| Teste | Status | Obs |
|-------|--------|-----|
| Ícones registrados renderizam | ✅ | |
| Ícone não encontrado: warn + vazio | ✅ | (dev only) |
| Size prop ajusta width/height | ✅ | |
| strokeWidth prop | ✅ | |

**Ícones disponíveis:** chevron-left/right/up/down, search, close, edit, trash, play, pause, plus, filter, download, upload, info, alert-circle, check-circle, x-circle, alert-triangle, more-horizontal, eye, eye-off, bell, dollar, activity, trending-up/down, pie-chart, bar-chart, monitor, grid, logo-grid, users, user, calendar, refresh, settings, logout

---

# MOLÉCULAS (`src/components/molecules/`)

## PageHeader

| Teste | Status | Obs |
|-------|--------|-----|
| Renderiza title e subtitle | ✅ | |
| Slot #actions alinhado à direita | ✅ | |
| Mobile: empilha verticalmente | ✅ | |

---

## SearchBar

| Teste | Status | Obs |
|-------|--------|-----|
| v-model atualiza ao digitar | ✅ | |
| Botão X aparece quando há texto | ✅ | |
| Pressionar Enter emite search | ✅ | |
| Clicar X limpa e emite search | ✅ | |

---

## StatsGrid

| Teste | Status | Obs |
|-------|--------|-----|
| Grid auto-fit sem prop cols | ✅ | |
| Prop cols força colunas fixas | ✅ | |
| Mobile: 1 coluna | ✅ | |

---

## FormField

| Teste | Status | Obs |
|-------|--------|-----|
| Label com asterisco quando required | ✅ | |
| Mensagem de erro em vermelho | ✅ | |
| Texto de hint em cinza | ✅ | |
| ID gerado automaticamente | ✅ | |

---

## TableActions

| Teste | Status | Obs |
|-------|--------|-----|
| Alinha ações ao centro | ✅ | |
| Props start/center/end | ✅ | |

---

# ORGANISMOS (`src/components/organisms/`)

## ConfirmationModal (organisms)

| Teste | Status | Obs |
|-------|--------|-----|
| Abre quando isOpen=true | ✅ | |
| Fecha ao clicar overlay | ✅ | |
| Fecha ao clicar X | ✅ | |
| Botão confirmar: loading state | ✅ | |
| Botão confirmar: emite {resolve, reject} | ✅ | |
| resolve() fecha modal com sucesso | ✅ | |
| reject(err) mostra alert | ✅ | |
| Scroll do body bloqueado quando aberto | ✅ | |
| Slot #footer substitui botões padrão | ✅ | |
| Tipos: success/danger/warning/info/primary | ✅ | |
| Tamanhos: small/medium/large | ✅ | |

---

## AddAssetModal

| Teste | Status | Obs |
|-------|--------|-----|
| Abre ao clicar "Adicionar Ativos" | ✅ 🔧 | BUG-004 corrigido |
| Select de categorias populado | ✅ | |
| Textarea aceita lista separada por vírgula | ✅ | |
| Validação: categoria obrigatória | ✅ | |
| Validação: código obrigatório | ✅ | |
| Submit: emit('submit', {categoria, codigos}) | ✅ | |
| Codes normalizados (trim, uppercase, filtro) | ✅ | |
| Fecha após sucesso | ✅ | 1s delay |
| Reset ao fechar | ✅ | |

---

## AssetsFilterDrawer

| Teste | Status | Obs |
|-------|--------|-----|
| Slider abre da direita | ✅ | |
| Busca por código/nome | ✅ | |
| Filtro por categoria | ✅ | |
| Filtro por status | ✅ | |
| Botão Aplicar emite filtros | ✅ | |
| Botão Limpar reseta | ✅ | |

---

## EditAssetModal

| Teste | Status | Obs |
|-------|--------|-----|
| Abre ao clicar "Editar" | ✅ 🔧 | BUG-004 corrigido |
| Campos pré-populados com dados do ativo | ✅ | |
| Color picker sincroniza com input hex | ✅ | |
| Botão reset restaura cor default da categoria | ✅ 🔧 | PA-003 corrigido — `resetColor()` usava `'Ações'/'FIIs'`; corrigido para uppercase |
| Submit emite {categoria, categoryColor} | ✅ | |
| Fecha após salvar | ✅ | |
| Usa organisms/ConfirmationModal | ✅ 🔧 | PA-003 corrigido — import atualizado de `my-assets/` para `@/components/organisms/` |

---

## EditAlertModal (observed)

| Teste | Status | Obs |
|-------|--------|-----|
| Abre com dados do alerta se existir | ✅ | |
| Campos min/max aceitam decimais | ✅ | |
| Validação: min ou max obrigatório | ✅ | |
| Validação: notificar requerido se valor preenchido | ✅ | |
| Frequência: 3 opções | ✅ | |
| Status: ativo/inativo | ✅ | |
| Emite objeto completo no save | ✅ | |

---

## DashboardCharts

| Teste | Status | Obs |
|-------|--------|-----|
| Gráfico donut renderiza | ✅ | |
| Chart destrói antes de recriar | ✅ | |
| Lista Top 5 categorias abaixo | ✅ | |
| Estado vazio quando sem ativos | ✅ | |
| Cores do usuário aplicadas | ✅ | |

---

## CategoryFormModal

| Teste | Status | Obs |
|-------|--------|-----|
| Modo criação: campos vazios | ✅ | |
| Modo edição: campos pré-populados | ✅ | |
| Validação: nome obrigatório | ✅ | |
| Color picker funcional | ✅ | |
| Emite {nome, color, resolve, reject} | ✅ | |

---

## UserFormModal

| Teste | Status | Obs |
|-------|--------|-----|
| Modo criação: campos de senha visíveis | ✅ | |
| Modo edição: sem campos de senha | ✅ | |
| Validação: campos obrigatórios | ✅ | |
| Validação: senha mínimo 8 chars | ✅ | |
| Validação: confirmação de senha | ✅ | |
| Select de role (user/admin) | ✅ | |

---

# PÁGINAS (`src/pages/`)

## Dashboard.vue (`/`)

| Teste | Status | Obs |
|-------|--------|-----|
| Carregamento de 3 APIs em paralelo | ✅ | |
| Cards de métricas | ✅ | |
| Gráfico de distribuição | ✅ | |
| Quick Actions (4 links) | ✅ | |
| Card de usuários (admin only) | ✅ | |

---

## Assets.vue (`/my-assets`)

| Teste | Status | Obs |
|-------|--------|-----|
| Lista todos os ativos | ✅ 🔧 | BUG-001/002 corrigidos |
| Erro exibido via AlertMessage | ✅ 🔧 | BUG-003 corrigido |
| Tabela com código, nome, categoria, status | ✅ | |
| Badges de categoria coloridos | ✅ 🔧 | BUG-005 corrigido |
| StatusBadge correto por status | ✅ | |
| Paginação: 10 itens por página | ✅ 🔧 | BUG-006 corrigido |
| Filtros funcionais | ✅ | |
| 6 modais de ação todos funcionais | ✅ 🔧 | BUG-004 corrigido |

---

## ObservedAssets.vue (`/observed`)

| Teste | Status | Obs |
|-------|--------|-----|
| Lista ativos observados | ✅ | |
| Merge com alertas correto | ✅ | |
| Preços em tempo real por página | ✅ | |
| Filtros funcionais | ✅ | |
| Modal de alerta funcional | ✅ | |

---

## Quotes.vue (`/quotes`)

| Teste | Status | Obs |
|-------|--------|-----|
| Carrega ativos e cotações | ✅ | |
| Filtros e ordenação | ✅ | |
| Cards de cotação com variação colorida | ✅ | |
| Paginação | ✅ | |

---

## History.vue (`/history`)

| Teste | Status | Obs |
|-------|--------|-----|
| Busca por código | ✅ | |
| Tabela de histórico | ✅ | |
| Loading state | ✅ | |

---

## Settings.vue (`/settings`)

| Teste | Status | Obs |
|-------|--------|-----|
| Carrega categorias e cores salvas | ✅ | |
| Color picker sincroniza | ✅ | |
| Salva apenas quando há mudanças | ✅ | |
| Mensagem de sucesso auto-dismiss | ✅ | |

---

## Login.vue (`/login`)

| Teste | Status | Obs |
|-------|--------|-----|
| Submit com Enter | ✅ | |
| Loading desabilita formulário | ✅ | |
| Erro de autenticação exibido | ✅ | |
| Redirect após login | ✅ | |
| Já logado: redirect para `/` | ✅ | |

---

# COMUNICAÇÃO COM BACKEND

## Interceptors (api.js)

| Teste | Status | Obs |
|-------|--------|-----|
| Token Bearer adicionado em todas as requests | ✅ | |
| 401: redirect para /login | ✅ | |
| 403: log, sem redirect | ✅ | |
| baseURL via VITE_API_BASE_URL | ✅ | Verificar `.env` |

---

## Loading States

| Componente | Loading State | Status |
|-----------|--------------|--------|
| Assets.vue | `loading` → `LoadingSpinner` | ✅ |
| ObservedAssets.vue | `loading` → `LoadingSpinner` | ✅ |
| Dashboard.vue | `loading` por seção | ✅ |
| ConfirmationModal | botão disabled + spinner | ✅ |
| AddAssetModal | `saving` + botão disabled | ✅ |

---

## Tratamento de Erros

| Componente | Erro exibido | Status |
|-----------|-------------|--------|
| Assets.vue | `AlertMessage` vermelho | ✅ 🔧 |
| ObservedAssets.vue | `AlertMessage` via `error` ref | ✅ |
| ConfirmationModal | `alert()` js nativo | ⚠️ Funcional, mas alert() não é ideal |
| Quotes.vue | Erros de cotação: silencioso | ⚠️ Monitorar |
| Login.vue | Mensagem inline | ✅ |

---

# RESUMO GERAL

| Categoria | Total | OK | Corrigidos | Atenção |
|-----------|-------|----|-----------|---------|
| Átomos | 17 | 17 | 2 | 0 |
| Moléculas | 5 | 5 | 0 | 0 |
| Organismos | 8 | 8 | 1 | 0 |
| Páginas | 10 | 10 | 3 | 0 |
| Bugs totais | 7 | — | 7 | 0 |
| Pontos de atenção | 4 | — | — | 4 |
