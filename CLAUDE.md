# Finance Frontend

Sistema de gestão de ativos financeiros pessoais.

---

## Stack

| Camada     | Tecnologia                                        |
|------------|---------------------------------------------------|
| Framework  | Vue 3 (Composition API, `<script setup>`)         |
| Build      | Vite                                              |
| Roteamento | Vue Router 4                                      |
| Estado     | Pinia                                             |
| HTTP       | Axios (`@src/services/api.js`)                     |
| CSS        | Plain CSS + variáveis CSS nativas                 |
| UI Kit     | Bootstrap 5                                       |
| Ícones     | Heroicons (`@heroicons/vue`)                      |
| Gráficos   | Chart.js + vue-chartjs                            |

---

## Comandos

```bash
npm run dev                # Dev server (porta 5173)
npm run build              # Build produção
npm run preview            # Preview do build
npm run format             # Prettier
npm run minify:inline-svgs # SVGs inline
npm run fix # format + minify:inline-svgs
```

---

## Estrutura de Pastas (Atomic Design)

```
src/
├── assets/          # Imagens, SVGs, utilities.css
├── components/
│   ├── atoms/       # Menor unidade: Button, Input, Badge, Spinner…
│   ├── molecules/   # Combina átomos: SearchBar, FormField, Pagination…
│   ├── organisms/   # Seções completas: Sidebar, Header, DataTable, Modal…
│   └── templates/   # Layouts: MainLayout, AuthLayout…
├── pages/           # Telas concretas (migração de @src/views/)
├── services/        # Chamadas de API (authService, assetService…)
├── stores/          # Pinia stores (auth, assets, alerts)
├── router/          # Vue Router
└── style.css        # Variáveis CSS globais
```

### Classificação de componentes

| Nível    | Critério                                               | Exemplos                                            |
|----------|--------------------------------------------------------|-----------------------------------------------------|
| atom     | Indivisível — não depende de outros componentes        | Button, Input, Badge, Spinner                       |
| molecule | Combina 2+ átomos, um bloco funcional simples          | SearchBar, FormField, StatsGrid, PageHeader         |
| organism | Seção funcional completa, contém moléculas/átomos      | Sidebar, AddAssetModal, DataTable                   |
| template | Esqueleto de página, sem dados concretos               | MainLayout, AuthLayout                              |
| page     | Template + dados reais + chamadas de API               | Assets.vue, Dashboard.vue                           |

**Moléculas criadas** (`@src/components/molecules/`):
`SearchBar` · `FormField` · `StatsGrid` · `PageHeader` · `TableActions`

---

## Convenções de Código

- Sempre `<script setup>` — nunca Options API.
- Composables em `@src/hooks/` com prefixo `use` (ex: `useModal.js`).
- Chamadas de API apenas em `@src/services/` ou dentro de Pinia stores.
- Estado global em Pinia (`@src/stores/`). Sem `provide/inject` para estado.
- Utilitários puros (sem efeitos colaterais) em `@src/utils/`.
- Estilos com variáveis CSS (`var(--primary)`, `var(--bg-secondary)`). Nunca hardcodar cores.
- Gradientes apenas em ícones e destaques — não em botões genéricos.
- Cores de status (verde/amarelo/vermelho) exclusivamente para status de ativos.

---

## Regras

- Uma função por responsabilidade de busca
- Erros opcionais (alertas, cores) são tratados internamente com try/catch silencioso
- Erros críticos propagam para o catch do orquestrador
- Sempre verificar authStore.user?.id antes de iniciar a carga
- Nomear com o prefixo fetch para funções de chamada e load para o orquestrador
- Regras de nomenclatura para todos os artefatos do projeto, leia `@docs/naming-conventions.md`

### Cores — Referência rápida
- Todas as configurações de CSS globais devem ser centralizadas exclusivamente em `@src/style.css`.
- Não definir cores globais diretamente em componentes, páginas ou organismos.
- Componentes devem consumir apenas variáveis CSS ou classes utilitárias já definidas no `@src/style.css`.
- Novas cores ou ajustes de tema devem ser adicionados primeiro no @src/style.css e depois reutilizados no restante do sistema.
- Manter padronização para evitar duplicação, inconsistência visual e conflitos de estilo.

### Atomic Desing
- Novos componentes entram obrigatoriamente na pasta do Atomic Design correspondente.
- `@src/views/` está sendo migrado para `@src/pages/` — não criar novos arquivos em `@src/views/`.
- `@src/components/common/` e subpastas legadas (`dashboard/`, `my-assets/`, etc.) serão migradas — não adicionar novos componentes nelas.
- Nunca modificar `@src/services/api.js` sem revisar todos os services que o importam.

### Estrutura de Páginas Vue

Toda página em `src/pages/` deve seguir o padrão documentado em `@docs/patterns/page-pattern.md`.

Ordem obrigatória das seções em `<script setup>`:

```
// ── Imports ──────────────────────────
// ── State ────────────────────────────
// ── Computed ─────────────────────────
// ── Watchers ─────────────────────────
// ── Lifecycle ────────────────────────
// ── Functions ────────────────────────
```

Prefixos de funções:
- `fetch*` — uma responsabilidade de busca por função
- `load*` — orquestrador que chama os `fetch*` via `Promise.all`
- `handle*` — handlers de eventos do template
- `open*` / `close*` — controle de modais e drawers
- `format*` — formatação local sem efeito colateral
- `apply*` — aplicação de filtros (ex: `applyFilters`)

Para o campo select de **Categorias** em filtros, sempre buscar via `categoryService.getAll()` em uma função `fetchCategories()` — nunca derivar as categorias dos ativos carregados.

### Responsabilidade de Loading

- Funções `fetch*` são chamadas de API puras — **não** gerenciam `loading.value` nem `fetchError.value`.
- Apenas a função `load*` (orquestradora) gerencia `loading.value`, `fetchError.value` e o bloco try/catch principal.
- Funções `fetch*` devem lançar erros (sem try/catch interno para erros críticos) para que o orquestrador os capture.
- Erros opcionais (dados secundários como cores, alertas) podem ter try/catch silencioso dentro do próprio `fetch*`.

Exemplo correto:
```js
async function fetchAssets() {
  const res = await assetService.getAllUserAssets(...)
  assets.value = res.data.ativos  // lança se falhar
}

async function loadPage() {
  if (!authStore.user?.id) return
  loading.value = true
  fetchError.value = ''
  try {
    await Promise.all([fetchAssets(), fetchCategories()])
  } catch (err) {
    fetchError.value = err?.response?.data?.message || 'Erro ao carregar'
  } finally {
    loading.value = false
  }
}
```

### Logs de Erro

- Todo `console.error` em páginas deve incluir o prefixo `[NomeDaPágina]`, ex: `[Assets]`, `[Users]`, `[Settings]`.
- Formato: `console.error('[NomeDaPágina] Descrição do erro:', err)`

### Exceções ao Padrão de Página

- Arquivos em `src/pages/DesignSystem/sections/` (`AtomsSection.vue`, `TokensSection.vue`, `MoleculesSection.vue`) são componentes de apresentação — não possuem `loadPage` nem chamadas de API. Seguem a estrutura de seções (comentários `// ──`) mas não o padrão de orquestração de dados.
