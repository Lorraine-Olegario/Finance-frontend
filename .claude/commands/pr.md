---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git push:*), Bash(git branch:*), Bash(npm run:*), Bash(gh pr:*), Read, Grep, Glob
argument-hint: "[título do PR opcional]"
description: Roda fix, build, valida regras do projeto, faz commit se necessário, push e abre o PR no GitHub
---

## Contexto

- Branch atual: !`git branch --show-current`
- Status: !`git status --short`
- Diff em relação ao main: !`git log --oneline main..HEAD`
- Arquivos alterados: !`git diff --name-only main..HEAD`

## Tarefa

Execute os passos abaixo **em ordem**. Pare e reporte se algum step crítico falhar.

---

**1. Rode o pipeline de qualidade**

```bash
NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20 && npm run fix
```

`npm run fix` executa: `minify:inline-svgs` → `format` (Prettier). Reporte erros se ocorrerem.

---

**2. Verifique o build**

```bash
NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20 && npm run build
```

Se o build falhar, **corrija os erros antes de continuar**.

---

**3. Valide as regras do projeto (bloqueia o PR se houver violações críticas)**

Leia os arquivos alterados com `git diff --name-only main..HEAD` e valide **cada arquivo** contra as regras abaixo.

### 3.1 — Regras de Código (CLAUDE.md)

Para cada `.vue` alterado:
- [ ] Usa `<script setup>` — nunca Options API
- [ ] Chamadas de API **apenas** em `src/services/` ou Pinia stores (`src/stores/`)
- [ ] Estado global via Pinia — sem `provide/inject` para estado
- [ ] Composables em `src/hooks/` com prefixo `use` (ex: `useModal.js`)
- [ ] Funções de busca com prefixo `fetch`, orquestradoras com prefixo `load`
- [ ] `authStore.user?.id` verificado antes de iniciar carga de dados
- [ ] Erros opcionais (alertas, cores) tratados com `try/catch` silencioso
- [ ] Erros críticos propagam para o `catch` do orquestrador

### 3.2 — Regras de CSS (CLAUDE.md + style.css)

Para cada arquivo com estilos:
- [ ] Cores via variáveis CSS (`var(--primary)`, `var(--bg-secondary)`, etc.) — **sem valores hexadecimais/rgb hardcoded**
- [ ] Novas cores/ajustes adicionados **primeiro** em `src/style.css`, depois reutilizados
- [ ] Gradientes apenas em ícones e destaques — não em botões genéricos
- [ ] Cores de status (verde/amarelo/vermelho) exclusivamente para status de ativos
- [ ] Sem definição de cores globais diretamente em componentes

### 3.3 — Atomic Design (CLAUDE.md)

Para cada componente novo ou movido:
- [ ] **atom**: Indivisível, sem dependências de outros componentes — pasta `src/components/atoms/`
- [ ] **molecule**: Combina 2+ átomos — pasta `src/components/molecules/`
- [ ] **organism**: Seção completa com moléculas/átomos — pasta `src/components/organisms/`
- [ ] **template**: Esqueleto de página sem dados — pasta `src/components/templates/`
- [ ] **page**: Template + dados reais — pasta `src/pages/`
- [ ] Sem novos arquivos em `src/views/` (em migração para `src/pages/`)
- [ ] Sem novos componentes em `src/components/common/` ou subpastas legadas
- [ ] Atom **não** importa organisms ou pages

### 3.4 — Convenções de Nomenclatura (docs/naming-conventions.md)

Para cada arquivo alterado:
- [ ] Arquivos `.vue` em **PascalCase** (ex: `BaseButton.vue`, `AddAssetModal.vue`)
- [ ] Arquivos `.js` de composables em **camelCase** com prefixo `use` (ex: `useModal.js`)
- [ ] Arquivos de serviço em **camelCase** (ex: `authService.js`, `assetService.js`)
- [ ] Classes CSS em **BEM kebab-case** (ex: `asset-card__title`, `asset-card--active`)
- [ ] Prefixos reservados respeitados: `ds-` (design system), `is-`/`has-` (estado), `js-` (apenas JS, sem estilo)
- [ ] IDs HTML em **kebab-case** (ex: `modal-confirm`, `form-add-asset`)
- [ ] Props em **camelCase** no script, **kebab-case** no template (Vue padrão)
- [ ] Eventos emitidos em **kebab-case** (ex: `@update:model-value`, `@close-modal`)
- [ ] Nomes de imagens: **kebab-case descritivo** (ex: `icon-arrow-right.svg`)

### 3.5 — Contrato de API (docs/contracts/api-contract.md)

Para cada chamada de API adicionada ou modificada:
- [ ] Endpoint segue o contrato documentado em `docs/contracts/api-contract.md`
- [ ] Autenticação via `Authorization: Bearer <token>` nas rotas protegidas
- [ ] Token lido do `localStorage` (chave `token`) via `authService` ou interceptor
- [ ] Erros de resposta (`4xx`, `5xx`) tratados conforme o padrão `{ detail: "mensagem" }`
- [ ] Novos endpoints documentados no contrato antes de serem implementados
- [ ] `Content-Type: application/json` para todos os requests com body
- [ ] Mapeamento frontend→backend respeitado (ex: `ticker` → `ativo`, `targetPrice` → `preco_alvo`)

### 3.6 — Padrão de Dashboard (docs/patterns/dashboard-pattern.md)

Se o PR tocar em páginas de métricas ou dashboard:
- [ ] Ícones usam `<SvgIcon>` — nunca `<img>` ou `<component :is="...">`
- [ ] Gráficos Chart.js em organisms com `flush: 'post'` no `watch`
- [ ] Cores de categorias vêm do store/API — sem palette hardcoded
- [ ] Uma função por responsabilidade de busca (separar `fetchAssets`, `fetchSummary`, etc.)

---

**4. Corrija as violações encontradas**

Para cada violação identificada nos itens acima, aplique a correção diretamente. Só bloqueie o PR se não for possível corrigir automaticamente — nesse caso, reporte o problema com o arquivo e linha específicos.

---

**5. Commit de mudanças pendentes (se houver)**

Se `git status` mostrar arquivos modificados não commitados após os passos anteriores:
- Faça `git add` nos arquivos relevantes (evite `.env`, binários)
- Crie um commit convencional descrevendo as mudanças do fix/validação

---

**6. Push da branch**

```bash
git push -u origin $(git branch --show-current)
```

---

**7. Crie o Pull Request**

Se `$ARGUMENTS` foi fornecido, use como título.

Caso contrário, analise o diff completo (`git diff main..HEAD`) e escreva:

**Título** — curto, imperativo, em português:
- Padrão: `feat: descrição` / `fix: descrição` / `refactor: descrição`

**Corpo** no formato:

```
## O que mudou
- (lista dos principais pontos do diff)

## Por que mudou
- (contexto / motivação das mudanças)

## Componentes afetados
- (lista de atoms/molecules/organisms/pages modificados)

## Checklist

### Qualidade
- [ ] `npm run fix` passou (Prettier + SVGs minificados)
- [ ] Build sem erros (`npm run build`)

### Código
- [ ] `<script setup>` em todos os arquivos Vue
- [ ] API calls apenas em `src/services/` ou Pinia stores
- [ ] Sem `provide/inject` para estado global
- [ ] Prefixos `fetch`/`load` nas funções de busca
- [ ] `authStore.user?.id` verificado antes de carregar dados

### CSS
- [ ] Sem cores hardcoded — usa variáveis CSS (`var(--primary)`, etc.)
- [ ] Novas cores adicionadas em `src/style.css` primeiro

### Atomic Design
- [ ] Componentes novos na pasta correta (`atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`)
- [ ] Sem novos arquivos em `src/views/` ou `src/components/common/`
- [ ] Atom não importa organisms ou pages

### Nomenclatura
- [ ] Arquivos `.vue` em PascalCase
- [ ] Classes CSS em BEM kebab-case
- [ ] Props camelCase no script, kebab-case no template
- [ ] Eventos emitidos em kebab-case

### Contrato de API
- [ ] Endpoints seguem `docs/contracts/api-contract.md`
- [ ] Erros `4xx`/`5xx` tratados via `{ detail: "..." }`
- [ ] Novos endpoints documentados no contrato

🤖 Generated with [Claude Code](https://claude.ai/claude-code)
```

Execute:

```bash
gh pr create --title "<título>" --body "<corpo gerado>" --base main
```

---

**8. Confirme**

Mostre a URL do PR criado e um resumo das validações que passaram/falharam.
