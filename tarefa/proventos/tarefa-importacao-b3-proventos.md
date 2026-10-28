# Front — Importar proventos da B3

API (repositório do back): `Finance/tarefas/proventos/back/tarefa-importacao-b3-proventos.md`.

Já existem no front a página `src/pages/ImportB3.vue` (rota `/portfolio/import-b3`, menu "Importar carteira B3") e o organismo `src/components/organisms/portfolio/B3GuideModal`. **Reaproveitar**; não criar uma tela paralela.

## O que fazer

- Na página **Proventos** (`tarefa-proventos-tela.md`), botão secundário **Importar da B3**. A tela de proventos funciona 100 % sem importar.
- Abre um modal (organismo em `src/components/organisms/dividends/`) com:
  - Passo a passo (estender o conteúdo do `B3GuideModal` com variante para proventos): Área do Investidor B3 → **Extratos → Movimentação** → filtrar o **ano** (recomendado ano a ano) → **não** marcar "Compra e venda" (ou marcar os tipos de provento) → **Baixar**. Imagens em `public/` (o guia atual já usa capturas; incluir uma nova mostrando o filtro sem "Compra e venda").
  - Upload do `.xlsx` → `POST /api/v2/dividends/import/b3` via `dividendService.importB3(file)` (multipart, no client v2).
- Resultado exibido no modal: **importados**, **já existentes** (duplicados), **ignorados**, **divergências em relação ao valor calculado** (ativo, data, valor B3 × valor calculado) e **erros por linha** (número da linha + motivo).
- Aviso: reimportar o mesmo arquivo não duplica; o que vem da B3 prevalece sobre o valor calculado.
- Ao concluir, recarregar os cards da aba Proventos (`load*`).
- Estados: enviando (botão desabilitado + spinner), erro de validação (422) com a mensagem do back, 401 pelo interceptor. Toast de sucesso pela store `toast` existente.
- Checklist: `npm run fix`, `npm run build`, teste manual com a planilha real, conferindo cada contador do resultado.

---

## Realizado

O arquivo não tem itens de primeiro nível (só o bloco "O que fazer"), então foi tratado como **uma única tarefa**; identificador nas branches: `tarefa-importacao-b3-proventos`. Depende da aba Proventos (PR da `tarefa-proventos-tela`): a branch parte dela, então o diff desta PR inclui os commits da PR anterior até ela ser mesclada.

### Item 1 — Importar proventos da B3
- Branch: `tarefa-importacao-b3-proventos/1-importar-proventos-b3`
- Commit: `54add14`
- O que foi feito:
  - Botão secundário **Importar da B3** no cabeçalho da página Proventos (a aba continua funcionando sem importar).
  - Organismo `src/components/organisms/dividends/DividendsImportB3Modal`: dica de uso, aviso ("reimportar não duplica; o que vem da B3 prevalece"), upload `.xlsx` (arrastar/clicar, validação de extensão e 5 MB), botão desabilitado com "Importando..." durante o envio e toast de sucesso/erro (422 mostra a mensagem do back).
  - Resultado no modal: contadores **Importados / Já existentes / Ignorados / Divergências / Erros**, tabela de divergências (ativo, pagamento, valor B3 × valor calculado), erros por linha (número + motivo) e lista recolhível de linhas ignoradas.
  - `B3GuideModal` ganhou a prop `variant` (`portfolio` padrão | `dividends`) com texto de proventos (sem "Compra e venda"); o modal abre esse guia pelo link "passo a passo". Não foi criada tela paralela.
  - `dividendService.importB3(file)` (multipart no client v2). Ao concluir com sucesso o modal emite `imported` e a página recarrega todos os cards.
- Validação: `npm run build` sem erros; prettier nos arquivos tocados; teste manual no navegador com o back local e uma planilha de teste (1 provento calculado divergente, 1 JCP, 1 rendimento, 1 linha ignorada, 1 ativo inexistente): contadores 3 importados / 0 já existentes / 1 ignorado / 1 divergência (R$ 10,00 × R$ 12,00) / 1 erro ("Asset 'ZZZZ3' not found…") e toast de sucesso conferidos. Esse teste também revelou um 500 do back com planilha corrompida, já corrigido para 422 no repositório do back. Não validado: planilha real da B3, reimportação pela UI (contador "Já existentes" — coberto no teste do back), tema escuro e mobile do modal.
- Observações:
  - **Imagem nova do filtro (pendente):** o guia pede uma captura do filtro da B3 sem "Compra e venda", mas ela vem da conta do investidor e não pôde ser gerada aqui. Na variante de proventos o passo 2 ficou só com texto (a imagem do filtro de compra e venda não é exibida, para não induzir ao erro); adicionar a captura em `public/img/b3/` e exibi-la nesse passo quando existir.
  - Os nomes das movimentações aceitos vêm do back (Dividendo, Juros Sobre Capital Próprio, Rendimento, Rendimento Tributado); linhas com outros nomes aparecem em "Linhas ignoradas" para conferência.
  - Ativos que o usuário ainda não tem (ex.: sem transações importadas) geram erro por linha; o modal orienta importar as transações antes.
  - O `docker-compose.yml` modificado no working tree é anterior a esta tarefa e **não** foi commitado.
