# Convenções de Nomes

Regras de nomenclatura para todos os artefatos do projeto. Seguir estritamente em arquivos novos.

---

## 1. Arquivos Vue (`.vue`)

**Padrão: PascalCase**

Aplicado a todos os arquivos `.vue` sem exceção: atoms, molecules, organisms, templates e pages.

```
✅ BaseButton.vue
✅ SearchBar.vue
✅ UserProfile.vue
✅ DesignSystem/index.vue

❌ base-button.vue
❌ searchBar.vue
❌ userprofile.vue
```

> **Regra derivada:** o nome do componente deve corresponder ao nome do arquivo.
> O `name` implícito em `<script setup>` é inferido do nome do arquivo pelo Vue DevTools.

---

## 2. Classes CSS

**Padrão: BEM em kebab-case**

```
.bloco
.bloco__elemento
.bloco--modificador
.bloco__elemento--modificador
```

```css
/* ✅ Correto */
.search-bar { }
.search-bar__input { }
.search-bar--focused { }
.page-header__title { }
.stat-card--primary { }

/* ❌ Errado */
.searchBar { }
.SearchBar__Input { }
.search_bar_focused { }
```

### Prefixos reservados

| Prefixo  | Contexto                          | Exemplo                |
|----------|-----------------------------------|------------------------|
| `ds-`    | Design System (documentação)      | `.ds-section-title`    |
| `is-`    | Estado (use com modificadores)    | `.is-active`, `.is-loading` |
| `has-`   | Estado com conteúdo               | `.has-error`           |
| `js-`    | Hook para testes/JS — sem estilo  | `.js-modal-trigger`    |

---

## 3. IDs HTML (`id=""`)

**Padrão: kebab-case**

IDs são usados para acessibilidade (`for`, `aria-labelledby`, `aria-describedby`) e ancoragem. Nunca para estilização.

```html
<!-- ✅ Correto -->
<label for="form-nome">Nome</label>
<input id="form-nome" />

<section id="atom-base-button">

<!-- ❌ Errado -->
<input id="formNome" />
<input id="FormNome" />
<input id="form_nome" />
```

### Padrão em formulários
`{contexto}-{campo}` — ex: `add-asset-ticker`, `filter-categoria`, `profile-email`

---

## 4. Imagens

**Padrão: kebab-case · descrever o conteúdo**

```
✅ logo-primary.svg
✅ logo-primary-dark.svg
✅ avatar-placeholder.png
✅ banner-dashboard.jpg
✅ icon-app-store.svg

❌ Logo.svg
❌ logo_primary.svg
❌ logoPrimary.svg
❌ img1.png
```

### Estrutura da pasta `src/assets/`
```
src/assets/
├── icons/          # Ícones do sistema (ver §5)
├── images/         # Imagens (png, jpg, webp)
│   ├── illustrations/
│   └── backgrounds/
└── logo/           # Variações do logotipo
```

---

## 5. Ícones SVG

**Padrão: kebab-case semântico · nome pelo significado, não pela forma visual**

Cada ícone tem seu próprio arquivo `.svg` em `src/assets/icons/`. O registro central
`src/assets/icons/index.js` importa cada arquivo via `?raw` (Vite) e extrai o innerHTML.

### Nome de arquivo

```
✅ search.svg          → busca (lupa)
✅ edit.svg            → editar (lápis)
✅ trash.svg           → excluir (lixeira)
✅ eye.svg             → observar/visualizar (olho)
✅ trending-up.svg     → rentabilidade crescente
✅ alert-triangle.svg  → aviso (triângulo)

❌ magnifier.svg       → nome visual, não semântico
❌ pencilSquare.svg    → camelCase proibido
❌ open_eye.svg        → underscore proibido
❌ lineChartUp.svg     → nome visual
```

### Formato do arquivo `.svg`

Todo arquivo deve ser um SVG Heroicons/Lucide de 24×24, estilo stroke:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- apenas os elementos internos (path, polyline, circle, etc.) -->
  <circle cx="11" cy="11" r="8"/>
  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>
```

> `stroke="currentColor"` garante herança de cor via CSS.
> Não usar `fill` colorido nem dimensões fixas (`width`/`height`) nos arquivos.

### Import via `?raw` (Vite)

O `index.js` importa cada arquivo como string bruta e remove a tag externa:

```js
import searchRaw from './search.svg?raw'

function inner(raw) {
  return raw
    .replace(/<svg[^>]*>/i, '')
    .replace(/<\/svg>/i, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
}

export const icons = {
  'search': inner(searchRaw),
  // ...
}
```

### Como adicionar um ícone novo

1. Crie `src/assets/icons/{nome-kebab}.svg` com o formato acima
2. Importe no `index.js`: `import nomeRaw from './{nome-kebab}.svg?raw'`
3. Adicione a entrada: `'nome-kebab': inner(nomeRaw)` na seção temática correta
4. Use no componente: `<SvgIcon name="nome-kebab" />`

---

## 6. Arquivos CSS

**Padrão: kebab-case**

```
✅ src/style.css
✅ src/assets/utilities.css
✅ src/pages/DesignSystem/design-system.css

❌ src/Style.css
❌ src/designSystem.css
❌ src/design_system.css
```

### Escopo de arquivos CSS

| Arquivo           | Escopo                        |
|-------------------|-------------------------------|
| `src/style.css`   | Variáveis globais + resets     |
| `*.module.css`    | ❌ Não usar — usar `<style scoped>` |
| CSS em `<style scoped>` | Componente individual   |
| CSS em `<style>` sem scoped | Herança/temas globais (uso restrito) |

---

## 7. Arquivos JavaScript / Composables

**Padrão por tipo:**

| Tipo          | Padrão     | Exemplo                          |
|---------------|------------|----------------------------------|
| Composable    | camelCase  | `useModal.js`, `useAuth.js`      |
| Utilitário puro | camelCase | `formatDate.js`, `maskCPF.js`   |
| Constante/config | camelCase | `menuItems.js`, `chartColors.js` |
| Classe/módulo | PascalCase | `ApiClient.js`                   |
| Service       | camelCase  | `authService.js`, `assetService.js` |
| Store Pinia   | camelCase  | `auth.js`, `assets.js`           |

```
src/hooks/        → useModal.js, useAssetFilters.js
src/utils/        → formatDate.js, maskCPF.js, parseNumber.js
src/services/     → authService.js, assetService.js
src/stores/       → auth.js, assets.js, alerts.js
src/config/       → menuItems.js, chartColors.js
```

---

## 8. Props, emits e variáveis

| Artefato     | Padrão      | Exemplo                          |
|--------------|-------------|----------------------------------|
| Props        | camelCase   | `modelValue`, `isLoading`, `currentPage` |
| Emits        | kebab-case  | `'update:modelValue'`, `'page-change'`, `'item-click'` |
| Refs / computed| camelCase | `demoInput`, `activeSection`     |
| Constantes   | UPPER_SNAKE | `MAX_PAGE_SIZE`, `API_TIMEOUT`   |
| Funções      | camelCase   | `handleSubmit()`, `scrollTo()`   |

```vue
<!-- ✅ Exemplo correto -->
<script setup>
const isLoading = ref(false)
const currentPage = ref(1)
const emit = defineEmits(['page-change', 'update:modelValue'])
</script>

<!-- ❌ Errado -->
<script setup>
const IsLoading = ref(false)
const current_page = ref(1)
</script>
```

---

## 9. Rotas e slugs de URL

**Padrão: kebab-case · minúsculas**

```
✅ /my-assets
✅ /design-system
✅ /user-profile
✅ /observed-assets

❌ /myAssets
❌ /MyAssets
❌ /my_assets
```

---

## Resumo rápido

| Artefato               | Padrão         | Exemplo                  |
|------------------------|----------------|--------------------------|
| Arquivo Vue            | PascalCase     | `BaseButton.vue`         |
| Arquivo JS             | camelCase      | `useModal.js`            |
| Arquivo CSS            | kebab-case     | `design-system.css`      |
| Arquivo imagem         | kebab-case     | `logo-primary.svg`       |
| Arquivo ícone SVG      | kebab-case semântico | `trending-up.svg`  |
| Ícone (registry key)   | kebab-case semântico | `trending-up`      |
| Classe CSS             | BEM kebab-case | `.search-bar__input`     |
| ID HTML                | kebab-case     | `form-ticker`            |
| Prop Vue               | camelCase      | `currentPage`            |
| Emit Vue               | kebab-case     | `'page-change'`          |
| URL/rota               | kebab-case     | `/my-assets`             |
