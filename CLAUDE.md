# Finance Frontend

Sistema de gestão de ativos financeiros pessoais. Vue 3 + Vite + Pinia + Bootstrap 5. Plain CSS com variáveis CSS. Sem TypeScript, sem Tailwind.

See @docs/style-guide.md para cores, status e gradientes do sistema.

---

## Stack

| Camada     | Tecnologia                                        |
|------------|---------------------------------------------------|
| Framework  | Vue 3 (Composition API, `<script setup>`)         |
| Build      | Vite                                              |
| Roteamento | Vue Router 4                                      |
| Estado     | Pinia                                             |
| HTTP       | Axios (`src/services/api.js`)                     |
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
```

---

## Estrutura de Pastas (Atomic Design)

```
src/
├── components/
│   ├── atoms/       # Menor unidade: Button, Input, Badge, Spinner…
│   ├── molecules/   # Combina átomos: SearchBar, FormField, Pagination…
│   ├── organisms/   # Seções completas: Sidebar, Header, DataTable, Modal…
│   └── templates/   # Layouts: MainLayout, AuthLayout…
├── pages/           # Telas concretas (migração de src/views/)
├── hooks/           # Composables reutilizáveis (useAuth, useModal…)
├── services/        # Chamadas de API (authService, assetService…)
├── stores/          # Pinia stores (auth, assets, alerts)
├── utils/           # Funções puras (formatDate, maskCPF…)
├── styles/          # Estilos globais e tema
├── assets/          # Imagens, SVGs, utilities.css
├── config/          # menuItems.js, configurações globais
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

**Moléculas criadas** (`src/components/molecules/`):
`SearchBar` · `FormField` · `StatsGrid` · `PageHeader` · `TableActions`

---

## Convenções de Código

- Sempre `<script setup>` — nunca Options API.
- Composables em `src/hooks/` com prefixo `use` (ex: `useModal.js`).
- Chamadas de API apenas em `src/services/` ou dentro de Pinia stores.
- Estado global em Pinia (`src/stores/`). Sem `provide/inject` para estado.
- Utilitários puros (sem efeitos colaterais) em `src/utils/`.
- Estilos com variáveis CSS (`var(--primary)`, `var(--bg-secondary)`). Nunca hardcodar cores.
- Gradientes apenas em ícones e destaques — não em botões genéricos.
- Cores de status (verde/amarelo/vermelho) exclusivamente para status de ativos.

---

## Cores — Referência rápida

Usar sempre as variáveis CSS. Ver paleta completa em @docs/style-guide.md.

| Variável           | Valor     | Uso                      |
|--------------------|-----------|--------------------------|
| `--primary`        | `#6200ee` | Ações principais, botões |
| `--primary-dark`   | `#5000d0` | Hover do primário        |
| `--secondary`      | `#3700b3` | Ações secundárias        |
| `--accent`         | `#bb86fc` | Destaques                |
| `--bg-primary`     | `#ffffff` | Superfícies / cards      |
| `--bg-secondary`   | `#f5f5f5` | Background da aplicação  |
| `--bg-hover`       | `#eeeeee` | Hover de itens           |
| `--text-primary`   | `#212121` | Texto principal          |
| `--text-secondary` | `#757575` | Texto secundário / muted |
| `--border`         | `#e0e0e0` | Bordas                   |
| `--error`          | `#b00020` | Erros                    |
| `--success`        | `#00c853` | Sucesso                  |
| `--danger`         | `#dc2626` | Ações destrutivas        |

---

## IMPORTANTE

- Novos componentes entram obrigatoriamente na pasta do Atomic Design correspondente.
- `src/views/` está sendo migrado para `src/pages/` — não criar novos arquivos em `src/views/`.
- `src/components/common/` e subpastas legadas (`dashboard/`, `my-assets/`, etc.) serão migradas — não adicionar novos componentes nelas.
- Nunca modificar `src/services/api.js` sem revisar todos os services que o importam.
