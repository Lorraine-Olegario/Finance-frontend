# Front — Aba "Proventos"

API (repositório do back): `Finance/tarefas/proventos/back/tarefa-proventos-api.md`.
Referências visuais: nesta pasta (`meus-proventos.png`, `historico-mensal.png`, `resumo-e-evolucao.png`).

Seguir o `CLAUDE.md` do front: Vue 3 `<script setup>`, Atomic Design, BEM em kebab-case, componentes `.vue` em PascalCase, cores só por variáveis do `src/style.css`, chamadas de API só em `src/services/` ou stores, página no padrão `docs/patterns/page-pattern.md` (`fetch*` + orquestrador `load*` com `Promise.all`, checar `authStore.user?.id` antes de carregar). Gráficos com Chart.js + vue-chartjs (já no projeto).

## Menu e rota

- `src/config/menuItems.js`: novo item `id: 'dividends'`, `label: 'Proventos'`, `to: '/dividends'`, com ícone SVG inline no padrão dos demais (depois rodar `npm run fix`). Posicionar após "Carteira"/"Importar carteira B3".
- `src/router/index.js`: rota `/dividends` (`name: 'Dividends'`, `meta: { requiresAuth: true }`) apontando para `src/pages/Dividends.vue` (nome de página em inglês, como o restante do projeto; não criar nada em `src/views/`).
- Os endpoints v2 usam o client `apiClientV2` de `src/services/portfolioService.js`. **Extrair esse client para um módulo compartilhado** (sem alterar o comportamento de `portfolioService`) para reusar em `dividendService.js`, em vez de duplicar. Não modificar `src/services/api.js`.

## Service e store

- `src/services/dividendService.js`: `getDividends(params)`, `getMonthlyHistory(params)`, `getSummary()`, `getDistribution(params)`, `getEvolution(params)`, `sync()`.
- Store Pinia `src/stores/dividends.js` para filtros compartilhados (Tipo de ativo e Ativos), usados pelos blocos que os têm.
- Ao abrir a página: `sync()` sem bloquear a tela (erro tratado em silêncio) e então `load*` dos blocos.

## Layout da página (`resumo-e-evolucao.png`)

Resumo + Distribuição na coluna esquerda, **Evolução de Proventos** na área principal; abaixo, **Histórico mensal** e **Meus proventos**. No mobile, tudo em coluna única.

Cada card abaixo vira um organismo em `src/components/organisms/dividends/` (usando `PageHeader`/`StatsGrid` onde couber); átomos/moléculas novos nas pastas do Atomic Design correspondentes.

### Card 1 — Resumo · `GET /api/v2/dividends/summary`
- **Média mensal (últ. 12 meses)** em destaque, com barra de progresso e % **somente se o back definir meta** (a referência mostra "R$ 26,68 / R$ 65,00 · 41,04%"); sem meta, omitir barra e %.
- **Total de 12 meses** (bloco expansível, com tooltip de ajuda).
- **Total da carteira**: tudo que já foi recebido.

### Card 2 — Distribuição de proventos em 12 meses · `GET /api/v2/dividends/distribution`
- Rosca por ativo com legenda (ticker + %), ordenada por valor; mostrar os maiores e agrupar o resto. Botão **Ver todos** abre a lista completa (modal).

### Card 3 — Evolução de Proventos · `GET /api/v2/dividends/evolution`
- Barras: **Proventos recebidos** (cor forte) × **Proventos a receber** (cor clara), com legenda, tooltip e ícone de ajuda.
- Alternância **Mensal / Anual** (`group`).
- Filtro de período: **12 meses, 2 anos, 5 anos, Data personalizada** (`from`/`to`, sem datas futuras).
- Filtros **Tipo de ativo** (categorias do usuário) e **Ativos**.
- Clique na barra abre o detalhe do mês (`GET /api/v2/dividends?year=&month=`). Dica abaixo do gráfico: "Você pode clicar nas barras para visualizar os detalhes de cada mês."

### Card 4 — Histórico mensal · `GET /api/v2/dividends/monthly-history` (`historico-mensal.png`)
- Tabela por **ano**: Jan…Dez, **Média** (tooltip explicando o cálculo) e **Total**; ordenação por ano, média e total.
- Seletor **Recebidos / A receber / Todos** (`status`), filtros Tipo de ativo e Ativos, chip com o **Total** do filtro.

### Card 5 — Meus proventos · `GET /api/v2/dividends` (`meus-proventos.png`)
- Colunas: **Ativo** (logo + ticker), **Tipo de ativo** (badge), **Status do pagamento** (Pago / A receber), **Tipo de pagamento** (Dividendos, JCP, Rendimento, Rend. Trib.…), **Data Com**, **Data Pagamento**, **Quantidade**, **Valor do div.**, **Valor total**, **Total líquido**.
- Ordenação nas colunas indicadas (`sort`/`direction`), filtros **Ano**, **Tipo de ativo**, **Ativos** e chip **Total** do filtro. Paginação se o back paginar.
- `R$ 0,00` (pt-BR), datas `dd/mm/aaaa`. Util de formatação em `src/utils/` (reaproveitar se já existir).
- **Cor de status:** o `CLAUDE.md` reserva verde/amarelo/vermelho para status de ativos. Para "Pago"/"A receber" definir tokens novos no `src/style.css` (ou validar o uso) antes de aplicar.

## Estados e qualidade

- Cada card com loading (skeleton/`LoadingSpinner`), erro com tentar novamente (`AlertMessage`) e vazio (`EmptyState`: "Nenhum provento encontrado — cadastre suas compras"). Erro em um card não derruba os outros.
- Responsivo; tabelas com rolagem horizontal no mobile.
- Token/401 tratados pelo interceptor já existente.
- Checklist: `npm run fix`, `npm run build` sem erros, teste manual no navegador de cada filtro e estado, conferido contra as capturas.
