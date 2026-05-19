---
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git branch:*), Read, Grep, Glob
argument-hint: "[arquivo ou pasta opcional para focar a validação]"
description: Valida profundamente as regras do projeto — código, CSS, Atomic Design, nomenclatura, contrato de API e padrões — sem fazer commit
---

## Contexto

- Branch atual: !`git branch --show-current`
- Arquivos alterados em relação ao main: !`git diff --name-only main..HEAD`
- Arquivos com mudanças não commitadas: !`git diff --name-only HEAD`
- Status: !`git status --short`

## Tarefa

Se `$ARGUMENTS` for fornecido, valide apenas o arquivo/pasta indicado.
Caso contrário, valide todos os arquivos alterados em relação ao `main`.

Leia cada arquivo com o conteúdo real antes de validar. Execute os blocos de validação abaixo em ordem. Ao final, gere um relatório completo.

---

### Bloco 1 — Regras de Código (CLAUDE.md)

Para cada `.vue` no escopo:

**1.1 — Script Setup**
- Verificar se usa `<script setup>` em vez de `export default { ... }` (Options API)
- Violação crítica: bloqueia o PR

**1.2 — Chamadas de API**
- Procurar por `axios`, `fetch(`, `api.` ou `http.` diretamente no template ou `<script setup>` de componentes
- Chamadas de API fora de `src/services/` ou Pinia stores (`src/stores/`) = violação crítica

**1.3 — Estado global**
- Procurar por `provide(` ou `inject(` usados para compartilhar estado entre componentes
- Violação crítica: usar Pinia em vez disso

**1.4 — Composables**
- Arquivos em `src/hooks/` devem ter prefixo `use` no nome (ex: `useModal.js`)
- Violação de convenção (não bloqueia, mas reportar)

**1.5 — Prefixos de funções de busca**
- Funções de chamada de API devem ter prefixo `fetch` (ex: `fetchAssets`)
- Funções orquestradoras que consolidam múltiplas buscas devem ter prefixo `load` (ex: `loadDashboard`)
- Violação de convenção (reportar)

**1.6 — Guard de autenticação**
- Em pages/organisms que fazem carga de dados: verificar se há `authStore.user?.id` (ou equivalente) antes de iniciar fetches
- Violação de segurança (reportar)

**1.7 — Tratamento de erros**
- Erros opcionais (alertas, cores, dados secundários): devem ter `try/catch` silencioso
- A ausência deste padrão não é bloqueante, mas reportar quando ausente em funções críticas

---

### Bloco 2 — Regras de CSS

Para cada arquivo com `<style>` ou `.css` no escopo:

**2.1 — Cores hardcoded**
- Buscar por valores hexadecimais (`#[0-9a-fA-F]{3,8}`), `rgb(`, `rgba(`, `hsl(` fora de variáveis CSS
- Verificar se já existe equivalente em `src/style.css` como variável
- Violação crítica: usar `var(--nome-da-variavel)` em vez do valor direto

**2.2 — Novas variáveis em style.css**
- Se o arquivo define uma nova cor ou variável de tema, verificar se ela foi adicionada em `src/style.css` antes de ser usada
- Violação crítica: não definir variáveis globais em componentes individuais

**2.3 — Gradientes**
- Gradientes (`linear-gradient`, `radial-gradient`) fora de ícones ou destaques visuais = violação de guideline (reportar)
- Gradientes em botões genéricos = violação

**2.4 — Cores de status**
- Cores verde/amarelo/vermelho de status (`--success`, `--accent-yellow`, `--danger`, `--error`) usadas fora de contexto de status de ativos = violação de guideline (reportar)

---

### Bloco 3 — Atomic Design

Para cada componente novo ou movido:

**3.1 — Classificação correta**
Verificar o caminho do arquivo contra a classificação:
- `src/components/atoms/` → deve ser indivisível, sem importar outros componentes do projeto (exceto utilitários/ícones)
- `src/components/molecules/` → deve combinar 2+ átomos
- `src/components/organisms/` → seção funcional completa, pode ter moléculas e átomos
- `src/components/templates/` → estrutura de layout sem dados concretos
- `src/pages/` → une template + dados reais + chamadas (via store/service)

**3.2 — Dependências proibidas**
- Um atom que importa um organism ou page = violação crítica
- Um template que contém lógica de negócio ou chamadas de API = violação crítica

**3.3 — Pastas proibidas para novos arquivos**
- Verificar se algum arquivo novo foi criado em `src/views/` → violação crítica (usar `src/pages/`)
- Verificar se algum componente novo foi criado em `src/components/common/` ou subpastas legadas → violação crítica

---

### Bloco 4 — Convenções de Nomenclatura (docs/naming-conventions.md)

**4.1 — Arquivos**
- `.vue` devem estar em **PascalCase** (ex: `BaseButton.vue`, `AddAssetModal.vue`)
- Composables `.js` devem estar em **camelCase** com prefixo `use`
- Services `.js` devem estar em **camelCase** (ex: `authService.js`)
- CSS files em **kebab-case**

**4.2 — Classes CSS**
- Verificar classes no template e no `<style>`:
  - Devem seguir **BEM kebab-case** (ex: `asset-card`, `asset-card__title`, `asset-card--active`)
  - `ds-` → exclusivo do design system
  - `is-` / `has-` → estados dinâmicos
  - `js-` → hooks JavaScript (nunca aplicar estilo via esta classe)

**4.3 — IDs HTML**
- IDs devem estar em **kebab-case** (ex: `modal-confirm`, `input-search`)

**4.4 — Props e eventos**
- Props: **camelCase** no script, **kebab-case** no template (comportamento padrão Vue)
- Eventos emitidos: **kebab-case** (ex: `close-modal`, `update:model-value`)

**4.5 — Imagens e SVGs**
- Arquivos de imagem/ícone: **kebab-case descritivo** (ex: `icon-arrow-right.svg`, `logo-header.png`)

---

### Bloco 5 — Contrato de API (docs/contracts/api-contract.md)

Para cada chamada de API adicionada ou modificada:

**5.1 — Endpoints**
- Comparar os endpoints usados no código com os documentados em `docs/contracts/api-contract.md`
- Endpoint diferente do contrato = violação crítica (deve ser atualizado no contrato ou corrigido no código)

**5.2 — Autenticação**
- Rotas protegidas devem enviar `Authorization: Bearer <token>`
- Token deve vir de `localStorage` (chave `token`) via interceptor ou `authService`

**5.3 — Tratamento de resposta de erro**
- Erros de API devem tratar o formato `{ detail: "mensagem" }`
- Ausência de tratamento de erro em chamadas críticas = violação

**5.4 — Novos endpoints**
- Se o código usa um endpoint não listado no contrato: marcar como pendente de documentação

**5.5 — Mapeamento de campos**
- Verificar se os nomes de campos enviados/recebidos batem com o mapeamento em `docs/contracts/api-contract.md`
- Ex: no frontend `ticker` → backend espera `ativo`

---

### Bloco 6 — Padrão de Dashboard (docs/patterns/dashboard-pattern.md)

Apenas se o escopo incluir `src/pages/Dashboard.vue`, `src/components/organisms/DashboardCharts.vue` ou arquivos relacionados a métricas:

**6.1 — Ícones**
- Ícones devem usar `<SvgIcon>` — nunca `<img src="...">` ou `<component :is="iconComponent">`

**6.2 — Gráficos Chart.js**
- `watch` de dados de gráfico deve usar `flush: 'post'`
- Instâncias de gráfico devem ser destruídas no `onBeforeUnmount`

**6.3 — Cores de categoria**
- Paleta de cores de categorias deve vir do store ou da API — sem objeto de cores hardcoded no componente

**6.4 — Separação de responsabilidades**
- Uma função por tipo de busca: não misturar `fetchAssets` com `fetchSummary` na mesma função

---

## Relatório Final

Gere um relatório estruturado com:

```
## Resultado da Validação

### Resumo
- Arquivos validados: N
- Violações críticas: N (bloqueiam PR)
- Avisos de convenção: N (não bloqueiam, mas devem ser corrigidos)
- Tudo conforme: N

### Violações Críticas
(lista com arquivo:linha e descrição)

### Avisos de Convenção
(lista com arquivo:linha e descrição)

### Itens em Conformidade
(lista resumida do que passou)
```

Se houver **violações críticas**, instrua o que deve ser corrigido antes de abrir o PR.
Se tudo estiver em conformidade, informe que o código está pronto para `/pr`.
