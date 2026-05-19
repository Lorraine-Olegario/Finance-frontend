# Padrão de Estrutura de Páginas Vue

Referência canônica para todas as páginas em `src/pages/`.
Aplica-se também a organismos complexos que gerenciam estado próprio.

---

## 1. Esqueleto padrão de uma página

```vue
<template>
  <MainLayout page-title="Título da Página">
    <div class="nome-da-pagina">
      <!-- 1. Cabeçalho -->
      <PageHeader title="..." subtitle="...">
        <template #actions> ... </template>
      </PageHeader>

      <!-- 2. Cards de métricas (opcional) -->
      <StatsGrid v-if="!loading && items.length > 0">
        <StatCard ... />
      </StatsGrid>

      <!-- 3. Drawer/Modal de filtros (sempre fora do bloco condicional) -->
      <XFilterDrawer ... />

      <!-- 4. Estados de carregamento / erro / vazio -->
      <LoadingSpinner v-if="loading" />
      <AlertMessage v-else-if="error" ... />
      <EmptyState v-else-if="items.length === 0" ... />

      <!-- 5. Conteúdo principal -->
      <template v-else>
        <!-- tabela, lista, cards... -->
        <Pagination ... />
      </template>

      <!-- 6. Modais (sempre ao final do template) -->
      <AddModal ... />
      <ConfirmationModal ... />
    </div>
  </MainLayout>
</template>

<script setup>
// ── Imports ──────────────────────────────────────────────────────────────────
// 1. Vue core
// 2. Vue Router / Pinia stores
// 3. Componentes (layout → organismos → moléculas → átomos)
// 4. Services

// ── State ─────────────────────────────────────────────────────────────────────
// refs de dados primários
// refs de UI (loading, error, modal flags, paginação, filtros)

// ── Computed ──────────────────────────────────────────────────────────────────
// derivações puras, sem efeitos colaterais

// ── Watchers ──────────────────────────────────────────────────────────────────
// reagir a mudanças de estado (ex: filtros, paginação)

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(loadPage)

// ── Functions ─────────────────────────────────────────────────────────────────
// fetch*  → uma responsabilidade de busca por função
// load*   → orquestrador que chama os fetchs em paralelo
// handle* → handlers de eventos do template
// open*/close* → controle de modais/drawers
// format* → utilitários de formatação local
</script>

<style scoped>
/* BEM kebab-case: .nome-da-pagina__elemento--modificador */
</style>
```

---

## 2. Ordem das seções obrigatória em `<script setup>`

| # | Seção       | Descrição                                                              |
|---|-------------|------------------------------------------------------------------------|
| 1 | `Imports`   | Vue core → Router/Stores → Componentes (top-down) → Services          |
| 2 | `State`     | `ref()` de dados + `ref()` de UI (loading, error, modais, filtros)    |
| 3 | `Computed`  | `computed()` derivações sem efeitos colaterais                         |
| 4 | `Watchers`  | `watch()` / `watchEffect()` para reações a mudanças de estado          |
| 5 | `Lifecycle` | `onMounted`, `onBeforeUnmount`, etc.                                   |
| 6 | `Functions` | `fetch*`, `load*`, `handle*`, `open*`/`close*`, `format*`             |

---

## 3. Convenção de nomenclatura de funções

| Prefixo   | Responsabilidade                                         | Exemplo                   |
|-----------|----------------------------------------------------------|---------------------------|
| `fetch`   | Uma chamada de API, uma responsabilidade                 | `fetchCategories()`       |
| `load`    | Orquestrador — chama `fetch*` em `Promise.all`           | `loadPage()`              |
| `handle`  | Handler de evento vindo do template                      | `handleSaveAlert()`       |
| `open`    | Abre modal/drawer + define `selectedItem`               | `openEditModal(asset)`    |
| `close`   | Fecha modal/drawer + limpa `selectedItem`               | `closeEditModal()`        |
| `format`  | Formatação local (sem efeito colateral)                  | `formatPrice(value)`      |
| `apply`   | Aplica filtros / form submit local                       | `applyFilters(filters)`   |

---

## 4. Padrão de busca de dados

```js
// ── cada responsabilidade em sua própria função ──────────────
async function fetchItems() {
  const res = await itemService.getAll()
  items.value = res.data?.data || []
}

async function fetchCategories() {
  try {
    const res = await categoryService.getAll()
    if (res.data && Array.isArray(res.data.data)) {
      categories.value = res.data.data.map(c => c.nome || c.name)
    }
  } catch {
    // erro opcional: silencioso, não bloqueia a página
  }
}

// ── orquestrador ─────────────────────────────────────────────
async function loadPage() {
  if (!authStore.user?.id) return
  loading.value = true
  error.value = ''
  try {
    await Promise.all([fetchItems(), fetchCategories()])
  } catch {
    error.value = 'Erro ao carregar dados. Tente novamente.'
  } finally {
    loading.value = false
  }
}

onMounted(loadPage)
```

**Regras:**
- Uma função `fetch*` por responsabilidade de busca
- Erros opcionais (cores, categorias, alertas) com `try/catch` silencioso interno
- Erros críticos propagam para o `catch` do orquestrador
- Sempre verificar `authStore.user?.id` antes de iniciar a carga

---

## 5. Padrão de filtros e paginação

```js
// Estado
const filters = ref({ search: '', categoria: '', hasAlert: '' })
const currentPage = ref(1)
const itemsPerPage = 10

// Computed que aplica filtros
const filteredItems = computed(() => {
  let result = items.value
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(i => i.nome.toLowerCase().includes(q))
  }
  if (filters.value.categoria) {
    result = result.filter(i => i.categoria === filters.value.categoria)
  }
  return result
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredItems.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() =>
  Math.ceil(filteredItems.value.length / itemsPerPage)
)

// Watcher: resetar página ao mudar filtros
watch(filters, () => { currentPage.value = 1 }, { deep: true })

// Handler de filtros vindo do drawer
function applyFilters(newFilters) {
  filters.value = { ...newFilters }
}
```

---

## 6. Padrão de modais

```js
// Estado
const showAddModal = ref(false)
const selectedItem = ref(null)

// Abertura: sempre define selectedItem antes de abrir
function openEditModal(item) {
  selectedItem.value = item
  showEditModal.value = true
}

// Fechamento: sempre limpa selectedItem depois de fechar
function closeEditModal() {
  showEditModal.value = false
  selectedItem.value = null
}

// Handler de submit
async function handleSave(data) {
  try {
    await itemService.update(selectedItem.value.id, data)
    await loadPage()
    closeEditModal()
  } catch {
    alert('Erro ao salvar. Tente novamente.')
  }
}
```

---

## 7. Padrão de CSS (BEM + variáveis)

```css
/* Bloco raiz = nome-da-pagina (kebab-case) */
.observed-assets-page { ... }

/* Elementos */
.observed-assets-page__table { ... }
.observed-assets-page__filter-btn { ... }

/* Modificadores */
.observed-assets-page__th--center { text-align: center; }

/* Regra: nunca hardcodar cores — usar variáveis do style.css */
.observed-assets-page__code {
  color: var(--text-primary);   /* ✅ */
  color: #212121;               /* ❌ */
}
```

---

## 8. Checklist para novas páginas

- [ ] Arquivo em `src/pages/` (nunca em `src/views/`)
- [ ] `<script setup>` + Composition API — nunca Options API
- [ ] Seções na ordem: Imports → State → Computed → Watchers → Lifecycle → Functions
- [ ] `fetchCategories()` usando `categoryService.getAll()` quando precisar do select de categorias
- [ ] `authStore.user?.id` verificado antes de iniciar a carga
- [ ] Erros opcionais com `try/catch` silencioso
- [ ] Erros críticos propagam para o `catch` do orquestrador
- [ ] Zero SVG inline — usar `<SvgIcon name="...">`
- [ ] CSS com classes BEM e variáveis CSS (`var(--primary)`, etc.)
- [ ] Modais ao final do template
- [ ] Organismos específicos da página em `organisms/{contexto}/`
