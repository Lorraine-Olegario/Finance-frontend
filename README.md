# Finance Frontend

Aplicação frontend para gerenciamento financeiro construída com Vue 3 + Vite.

## Stack

- Vue 3 com `<script setup>` SFCs
- Vite
- Vue Router
- Pinia (State Management)
- Bootstrap 5 + Plain CSS com variáveis CSS nativas
- Heroicons + SvgIcon atom
- Chart.js + vue-chartjs
- Docker + Nginx (Produção)

## Pré-requisitos

### Desenvolvimento Local
- Node.js 20 ou superior
- npm

### Docker
- Docker
- Docker Compose

---

## Estrutura do Projeto

O projeto segue Atomic Design:

```
src/
  components/
    atoms/       # Menor unidade: Button, Input, Badge, Spinner…
    molecules/   # Combina átomos: SearchBar, FormField, Pagination…
    organisms/   # Seções completas: Sidebar, Header, DataTable, Modal…
    templates/   # Layouts: MainLayout, AuthLayout…
  pages/         # Telas concretas (migrado de src/views/)
  hooks/         # Composables reutilizáveis (useAuth, useModal…)
  services/      # Chamadas de API (authService, assetService…)
  stores/        # Pinia stores
  utils/         # Funções puras (formatDate, maskCPF…)
  assets/icons/  # SVGs registrados em index.js
  styles/        # Estilos globais e tema
  style.css      # Variáveis CSS globais
```

### Atoms (`src/components/atoms/`)

Componentes indivisíveis — apenas UI, sem regra de negócio, props tipadas, `v-bind="$attrs"`.

| Componente        | Descrição                                              |
|-------------------|--------------------------------------------------------|
| `AppSpinner`      | Spinner inline para botões e áreas de conteúdo         |
| `BaseButton`      | Botão com variantes primary/secondary/ghost/danger     |
| `BaseInput`       | Input com v-model, foco e estados                      |
| `BaseSelect`      | Select com array `[{value, label}]`                    |
| `Badge`           | Badge de categoria com mapa de cores built-in          |
| `StatusBadge`     | Badge exclusivo para status de ativo                   |
| `ActionButton`    | Botão 36x36px para ícones de ação em tabelas           |
| `FilterLabel`     | Wrapper de label para campos de filtro                 |
| `LoadingSpinner`  | Spinner de seção/página com suporte a fullscreen       |
| `EmptyState`      | Estado vazio com slot de ícone e ação                  |
| `AlertMessage`    | Alert contextual com 4 tipos e dismiss                 |
| `Pagination`      | Paginação com ellipsis e cálculo automático            |
| `StatCard`        | Card de métrica com barra lateral colorida             |
| `DashboardCard`   | Container de seção do dashboard                        |
| `QuickActionCard` | Card de navegação rápida (RouterLink)                  |
| `CategoryListItem`| Linha de categoria com dot, nome, count e percentual   |
| `SvgIcon`         | Renderizador de ícone SVG via registry centralizado    |

### Molecules (`src/components/molecules/`)

Combinam 2+ átomos para um bloco funcional reutilizável. Sem chamadas de API.

| Componente     | Descrição                                          |
|----------------|----------------------------------------------------|
| `SearchBar`    | Input de busca com ícone, clear button e foco      |
| `FormField`    | Label + campo + hint/erro                          |
| `StatsGrid`    | Grid responsivo auto-fit para StatCards            |
| `PageHeader`   | Título + subtítulo + slot de ações                 |
| `TableActions` | Container flex para botões de ação em tabelas      |

### Organisms (`src/components/organisms/`)

Seções funcionais completas compostas de molecules e atoms. Podem usar composables. Sem lógica de API direta.

Exemplos: `Sidebar`, `Header`, `AddAssetModal`, `DataTable`.

---

## SVG

Todo SVG inline deve estar em **uma única linha**:

```vue
<!-- Correto — minify:inline-svgs gera este formato automaticamente -->
<!-- prettier-ignore -->
<svg viewBox="0 0 24 24"><path d="..."/></svg>

<!-- Incorreto -->
<svg>
  <path />
</svg>
```

O script `minify:inline-svgs` comprime SVGs e adiciona `<!-- prettier-ignore -->` antes de cada bloco, garantindo que o Prettier não os expanda no passo seguinte.

Ícones são gerenciados em `src/assets/icons/index.js` e renderizados via `SvgIcon`.

---

## Scripts

```bash
npm run dev                # Dev server (porta 5173)
npm run build              # Build produção
npm run preview            # Preview do build

npm run minify:inline-svgs # Comprime SVGs inline para uma linha e adiciona prettier-ignore
npm run format             # Prettier em src/**/*.{vue,js,css,html}

npm run fix                # Pipeline completo: minify:inline-svgs → format
```

### Fluxo padrão

```bash
npm run fix
```

Executa em ordem:
1. `minify:inline-svgs` — comprime SVGs inline para uma linha e adiciona `<!-- prettier-ignore -->` antes de cada um
2. `format` — Prettier formata todos os arquivos source (SVGs protegidos pelo prettier-ignore)

> Node.js 20+ necessário para executar `npm run fix` (Prettier 3.x requer Node 16+).

---

## Padrão de Componentes

### Regras gerais

- Sempre `<script setup>` — nunca Options API
- Props tipadas com `type` e `default`
- `v-bind="$attrs"` em atoms que encapsulam elementos nativos
- Emits declarados com `defineEmits`
- Aspas simples em todo JS/TS — nunca duplas

### Atom

```vue
<template>
  <button
    type="button"
    class="my-btn"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
.my-btn {
  /* estilos com variáveis CSS */
}
</style>
```

### Molecule

```vue
<template>
  <div class="my-molecule">
    <AtomA :prop="value" />
    <AtomB
      :other="other"
      @event="handle"
    />
  </div>
</template>

<script setup>
import AtomA from '@/components/atoms/AtomA.vue'
import AtomB from '@/components/atoms/AtomB.vue'

defineProps({
  value: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>
```

### Organism

```vue
<script setup>
import MolA from '@/components/molecules/MolA.vue'
import MolB from '@/components/molecules/MolB.vue'
import { useMyComposable } from '@/hooks/useMyComposable'

// Pode usar composables — não faz chamadas diretas de API
</script>
```

---

## Formatação

Prettier é a única ferramenta de formatação automática no pipeline `npm run fix`.
ESLint está configurado em `eslint.config.js` para uso via editor (não roda no `fix`).

### Configuração Prettier (`.prettierrc`)

| Opção                    | Valor     | Efeito                                      |
|--------------------------|-----------|---------------------------------------------|
| `singleQuote`            | `true`    | Aspas simples em todo JS                    |
| `semi`                   | `false`   | Sem ponto-e-vírgula                         |
| `trailingComma`          | `"none"`  | Sem vírgula final                           |
| `arrowParens`            | `"avoid"` | `v =>` em vez de `(v) =>`                  |
| `vueIndentScriptAndStyle`| `false`   | Sem indentação extra em `<script>`/`<style>`|
| `singleAttributePerLine` | `true`    | Um atributo por linha em templates          |
| `printWidth`             | `80`      | Quebra de linha aos 80 caracteres           |

Arquivos `.svg` e `src/assets/icons/*` são ignorados via `.prettierignore`.

---

## Docker

```bash
docker compose up -d --build
```

A aplicação estará disponível em: `http://localhost:80`

O `Dockerfile` usa multi-stage build:
1. **Builder:** Instala dependências Node.js e gera o build
2. **Production:** Nginx com apenas os arquivos estáticos compilados

### Comandos úteis

```bash
docker compose logs -f finance-frontend
docker compose down
docker compose exec finance-frontend sh
docker compose down -v
docker compose ps
```

---

## Desenvolvimento Local

```bash
npm install
npm run dev
```

> Node.js 20+ necessário. Se estiver usando Docker, o build acontece automaticamente dentro do container.
