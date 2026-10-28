# Front — Aba "Patrimônio"

API (repositório do back): `Finance/tarefas/patrimonio/back/tarefa-patrimonio-api.md`.
Referências visuais: nesta pasta (`evolucao-patrimonio.png`, `consolidacao-tipo-ativos.png`, `categoria-acoes.png`, `categoria-fiis-posicao-ideal.png`).

Seguir o `CLAUDE.md` do front: Vue 3 `<script setup>`, Atomic Design, BEM em kebab-case, componentes PascalCase, cores só por variáveis do `src/style.css`, API só em `src/services/` ou stores, página no padrão `docs/patterns/page-pattern.md` (`fetch*` + `load*` com `Promise.all`, checar `authStore.user?.id`). Gráficos com Chart.js + vue-chartjs.

## Menu e rota

- `src/config/menuItems.js`: item `id: 'net-worth'`, `label: 'Patrimônio'`, `to: '/net-worth'`, ícone SVG inline no padrão dos demais (depois `npm run fix`), ao lado de "Proventos".
- `src/router/index.js`: rota `/net-worth` (`name: 'NetWorth'`, `meta: { requiresAuth: true }`) para `src/pages/NetWorth.vue`. Nada novo em `src/views/`.
- `src/services/netWorthService.js`: `getEvolution(params)`, `getConsolidation(view)`, `getCategoryBreakdown(categoryId, view)`, `updateAssetClassification(assetId, payload)`. Usar o client `apiClientV2` (extraído de `portfolioService.js` para módulo compartilhado, sem mudar o comportamento atual); não tocar em `src/services/api.js`.

## Ordem da página

**Evolução do Patrimônio** → **Consolidação do patrimônio** → um **card por categoria** (Ações, FIIs…). Cada card é um organismo em `src/components/organisms/net-worth/`; o card de rosca + lista é um organismo reutilizado pelos cards 2 e 3.

## Card 1 — Evolução do Patrimônio (`evolucao-patrimonio.png`)

`GET /api/v2/net-worth/evolution`

- **Filtro de período** (select com ícone de calendário): **Últimos 12 meses**, **2 anos**, **5 anos**, **Anual**, **Data personalizada** (seletor de início/fim → `from`/`to`; sem datas futuras, `from <= to`).
- **Filtro de tipo**: **Todos os tipos** + categorias do usuário (`category_id`).
- **Barras empilhadas:** **Valor aplicado** (verde forte) e **Ganho de Capital** (verde claro); ganho **negativo desenha abaixo do zero**. Eixo Y `R$ 2.000`/`R$ 12K`, eixo X `03/26` (mensal) ou `2026` (anual), linha do zero visível.
- Legenda clicável (oculta/exibe série); tooltip com período, valor aplicado, ganho (verde/vermelho) e patrimônio total.
- Estados: loading, vazio ("Cadastre suas compras para ver a evolução"), erro com tentar novamente.

## Card 2 — Consolidação do patrimônio (`consolidacao-tipo-ativos.png`)

`GET /api/v2/net-worth/consolidation?view=category|asset`

- Abas (segmented control): **Tipo de ativos** (`category`) e **Ativos** (`asset`). **Sem** a aba "Exposição ao exterior" (fora do escopo).
- Rosca com rótulos externos e tooltip (nome, %, valor) + lista à direita: nome em negrito, **valor** (`R$ 5.625,30`), **%** (`63,45%`) e barra proporcional na cor da fatia; ordem decrescente.
- Cores vêm do back (`color`); fatia e barra usam a mesma. Estados: loading, vazio, erro.

## Card 3..N — Card por categoria (`categoria-acoes.png`, `categoria-fiis-posicao-ideal.png`)

Um card por categoria do usuário (lista do Card 2 com `view=category`). `GET /api/v2/net-worth/categories/{category}?view=consolidated|sector|segment|type`.

- Título = nome da categoria. **Abas montadas por `available_views`** do back (sem hardcode): Ações → **Consolidado / Por setor / Por segmento**; FIIs → **Consolidado / Por tipo / Por segmento**.
- Rosca + lista idênticas ao Card 2 (tooltip "Acessórios: 38,51% · R$ 1.247,92").
- Itens **"Sem classificação"**: oferecer ação para classificar o ativo (`PUT /api/v2/assets/{asset}/classification`) e recarregar o card.
- **Posição ideal:** só exibir o toggle "Exibir posição ideal" (com tooltip) se o back implementar `allocation_targets`; ligado, mostra uma segunda rosca com a alocação desejada. Caso contrário, ocultar.
- Mobile: uma rosca por vez, a ideal abaixo da atual.

## Regras gerais

- `R$ 0,00` (pt-BR), % com 2 casas, datas `dd/mm/aaaa`; filtros do Card 1 independentes dos demais.
- Responsivo; cores não são o único indicador (rótulos e % sempre visíveis), gráficos com `aria-label`.
- Verde/amarelo/vermelho são reservados a status de ativos no `CLAUDE.md`: para ganho/perda e valor aplicado definir tokens novos no `src/style.css` antes de usar.
- Checklist: `npm run fix`, `npm run build`, teste manual de cada filtro/aba/estado contra as capturas.
