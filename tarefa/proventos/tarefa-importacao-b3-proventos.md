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
