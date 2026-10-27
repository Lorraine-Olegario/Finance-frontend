---
name: task
description: Executa um arquivo da pasta tarefas/ (ex. /task tarefa2.md). Cada item da tarefa vira uma branch própria com um commit, tudo é reunido em uma branch de revisão, e o arquivo da tarefa recebe a descrição do que foi feito.
argument-hint: tarefa2.md
disable-model-invocation: true
---

# /task — executar tarefas da pasta `tarefas/`

Argumento recebido: `$ARGUMENTS` (nome do arquivo dentro de `tarefas/`, ex. `tarefa2.md`; aceite também sem `.md` ou com o caminho `tarefas/...`).

## 1. Preparação

1. Resolva o arquivo `tarefas/<arg>`. Se não existir, liste `tarefas/` e pare.
2. Leia o arquivo inteiro. Cada **item de primeiro nível** (bullet `-`, `*` ou lista numerada, com suas linhas de continuação) é uma **tarefa separada**. Se não houver bullets, o arquivo inteiro é uma única tarefa.
3. Rode `git status` e `git branch --show-current`. Se houver alterações não relacionadas no working tree, avise o usuário e pergunte antes de continuar (nunca descarte nem commite alterações que não sejam da tarefa).
4. Descubra a branch base (`main`, ou `master`). Atualize-se a partir dela; todo o trabalho parte dela.
5. **Número já ocupado:** antes de criar qualquer branch, verifique se `N` já está em uso: `git branch -a | grep -E "tarefa<N>(/|$)"` (locais e `origin/`), e se `tarefas/tarefa<N>.md` existe em alguma branch (`git ls-tree -r --name-only <branch> tarefas/`). Se estiver ocupado por outro trabalho, **não reutilize o número**: calcule o próximo livre (maior número `tarefa<M>` encontrado em arquivos e branches, locais e remotas, + 1), renomeie o arquivo (`mv tarefas/tarefa<N>.md tarefas/tarefa<novo>.md`, ou `git mv` se versionado), use `N = <novo>` em tudo e avise o usuário da renumeração. Nunca sobrescreva nem misture com branches existentes.
6. Nomes: `N` = número do arquivo (ex. `tarefa50.md` → `50`).
   - Branch de revisão: `review/tarefa<N>` (criada a partir da base).
   - Branch de cada item: `tarefa<N>/<indice>-<slug-curto-kebab>` (ex. `tarefa50/2-remover-recuperar-senha`).

## 2. Execução (repita para cada item, em ordem)

1. Crie a branch do item **a partir de `review/tarefa<N>`** (itens posteriores enxergam os anteriores).
2. Implemente somente o que o item pede (sem escopo extra). Siga os padrões do projeto (Laravel + Inertia + Vue, domínio em `app/Domain`, testes Pest/PHPUnit em `tests/`).
3. Valide: rode os testes relevantes (`docker compose exec -T app php artisan test`, ou `php artisan test` se o container não estiver de pé). Se falhar, corrija a causa; nunca pule ou desabilite testes. Ajuste/remova testes que cobriam comportamento removido de propósito.
4. Faça `git diff` para revisar e dê `git add` **apenas dos arquivos do item** (nunca `git add -A` às cegas; não inclua arquivos de outros itens nem alterações prévias do usuário).
5. Commit com mensagem descritiva em português, no formato `tarefa<N>: <o que foi feito>`, corpo curto explicando o porquê quando útil, terminando com a linha de atribuição exigida pelo ambiente (Co-Authored-By).
6. Volte para `review/tarefa<N>` e faça `git merge --no-ff tarefa<N>/<indice>-<slug>` com mensagem `Merge tarefa<N> item <indice>: <resumo>`.

## 3. Documentar no arquivo da tarefa

Depois de todos os itens, na branch `review/tarefa<N>`, acrescente ao **final** de `tarefas/<arquivo>` (sem alterar o texto original):

```markdown

---

## Realizado

### Item 1 — <texto resumido do item>
- Branch: `tarefa<N>/1-...`
- Commit: `<hash curto>`
- O que foi feito: <descrição objetiva: arquivos/comportamentos alterados>
- Validação: <testes rodados e resultado>
- Observações: <decisões, ambiguidades, pendências — ou "nenhuma">
```

Um bloco `### Item` por tarefa. Commite isso em `review/tarefa<N>` com a mensagem `tarefa<N>: documenta o que foi realizado`.

Se o arquivo da tarefa ainda não estiver versionado (untracked), inclua-o nesse commit.

## 4. Push e Pull Request

1. Faça push da branch de revisão e de cada branch de item: `git push -u origin <branch>`.
2. Abra **uma PR por arquivo de tarefa**, de `review/tarefa<N>` para a branch base, com `gh pr create --base <base> --head review/tarefa<N>`:
   - Título: `tarefa<N>: <resumo>`.
   - Corpo: a seção `## Realizado` do arquivo (itens, branches, commits, validação, observações), terminando com `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
3. Verifique com `gh pr view` que a PR existe e devolva o link. Se `gh` não estiver autenticado ou o push falhar, diga isso claramente — nunca diga que a PR foi aberta sem confirmar.
4. **Não faça merge da PR**: o usuário revisa. Não habilite auto-merge.

## 5. Fechamento

- Deixe o usuário na branch `review/tarefa<N>`.
- Responda com: link da PR, branches/commits por item, resultado dos testes e pontos ambíguos para a revisão.

## Regras

- Nunca trabalhe diretamente na `main`/`master`.
- Um item = uma branch = um commit de implementação. Não agrupe itens.
- Se um item for ambíguo de forma que mude o resultado, pergunte antes de implementar; se for apenas detalhe, escolha o padrão do projeto e registre em "Observações".
- Ações destrutivas ou fora do escopo (apagar dados, rodar migrations em banco real, merge na base) exigem confirmação do usuário. Push e abertura da PR fazem parte do fluxo.
