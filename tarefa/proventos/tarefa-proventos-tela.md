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

---

## Realizado

O arquivo não tem itens de primeiro nível (só seções), então foi tratado como **uma única tarefa**; identificador nas branches: `tarefa-proventos-tela`.

### Item 1 — Aba "Proventos"
- Branch: `tarefa-proventos-tela/1-aba-proventos`
- Commit: `50cbcf9`
- O que foi feito:
  - Menu "Proventos" (após "Importar carteira B3") e rota `/dividends` → `src/pages/Dividends.vue` (padrão de página: `fetch*`/`load*`, checa `authStore.user?.id`).
  - `src/services/apiClientV2.js` extraído do `portfolioService` (comportamento igual) e reaproveitado em `src/services/dividendService.js` (`getDividends`, `getMonthlyHistory`, `getSummary`, `getDistribution`, `getEvolution`, `sync`). `api.js` não foi tocado.
  - Store `src/stores/dividends.js` com filtros compartilhados Tipo de ativo / Ativos (categorias via `categoryService.getAll()`, ativos via posições da carteira).
  - Ao abrir: `sync()` em segundo plano (erro em silêncio; se sincronizou, recarrega os cards) e carga dos cards em paralelo, cada um com loading/erro com "Tentar novamente"/vazio independentes (`useAsyncCard`).
  - Organismos em `src/components/organisms/dividends/`: Resumo, Distribuição (rosca + "Ver todos" em modal), Evolução (barras recebidos × a receber, Mensal/Anual, 12m/2a/5a/personalizada sem datas futuras, clique na barra abre detalhe do período via `GET /dividends?year=&month=`), Histórico mensal (Recebidos/A receber/Todos, ordenação por ano/média/total, chip de total) e Meus proventos (todas as colunas, ordenação no servidor, filtro de ano, chip de total). Moléculas `DividendsCard`, `DividendsFilterBar`, `SegmentedControl`; átomo `DividendStatusBadge`.
  - `src/style.css`: tokens novos (claro e escuro) para status de pagamento (`--dividend-paid*`, `--dividend-pending*`) e para a paleta da rosca (`--chart-palette-*`), sem usar o verde/amarelo/vermelho de status de ativos.
  - Utils: `formatDate` (dd/mm/aaaa sem fuso), `dividendLabels`, `cssVar`.
- Validação: `npm run build` sem erros; prettier nos arquivos novos; teste manual no navegador (back local com proventos de teste, depois removidos): cards carregam, filtro Tipo de ativo (estado vazio nos cards), alternância Mensal/Anual, clique na barra abrindo o detalhe do mês, "Limpar filtros" e layout mobile em coluna única. ESLint nos arquivos novos só acusa "Parsing error" nos `.vue` com `lang="ts"` — o mesmo que já ocorre nos componentes existentes (a config não tem parser TS). Não validado: modal "Ver todos", datas personalizadas, tema escuro e os dados reais da Brapi (token inválido no back).
- Observações:
  - **Meta de média mensal:** o back não define meta, então a barra/% do card Resumo foi omitida (como previsto).
  - **Filtros compartilhados:** uma única barra Tipo de ativo/Ativos no topo vale para Evolução, Histórico, Meus proventos, Resumo e Distribuição, em vez de uma por card.
  - **Ativos no filtro:** vêm das posições atuais; ativos totalmente vendidos que ainda têm proventos não aparecem na lista (o filtro por categoria os cobre).
  - **Logo do ativo:** a API não devolve logo, então a coluna Ativo mostra um avatar com as iniciais do ticker.
  - **Paginação:** a API não pagina; a tabela mostra tudo com rolagem horizontal.
  - **Sync** depende do `BRAPI_TOKEN` do back; sem ele a aba mostra só o que já está gravado.
  - Cores do Chart.js são lidas das variáveis CSS ao desenhar; trocar o tema com a página aberta só atualiza o gráfico no próximo carregamento.
  - O `docker-compose.yml` modificado no working tree é anterior a esta tarefa e **não** foi commitado.
