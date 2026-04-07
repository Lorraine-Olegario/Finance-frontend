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
