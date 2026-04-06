---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*)
argument-hint: "[mensagem opcional]"
description: Analisa as mudanças, faz stage e cria um commit convencional
---

## Contexto atual

- Branch: !`git branch --show-current`
- Status: !`git status --short`
- Diff completo: !`git diff HEAD`
- Últimos commits: !`git log --oneline -5`

## Tarefa

Execute os passos abaixo em ordem:

**1. Analise as mudanças**
Leia o diff acima e identifique o que foi alterado: quais arquivos, qual categoria de mudança (feat, fix, refactor, etc.) e o impacto.

**2. Faça stage das mudanças**
Use `git add` nos arquivos relevantes. Não inclua `.env`, arquivos de segredos ou binários desnecessários.

**3. Defina a mensagem do commit**
Se um argumento foi fornecido, use: $ARGUMENTS

Caso contrário, crie uma mensagem seguindo Conventional Commits:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `refactor:` refatoração sem mudança de comportamento
- `docs:` apenas documentação
- `style:` formatação, CSS, variáveis visuais
- `chore:` tarefas de manutenção (deps, configs)
- `test:` adição ou correção de testes

Escopo opcional entre parênteses: `feat(atoms):`, `fix(dashboard):`, `refactor(organisms):`

Exemplo: `feat(atoms): adicionar variante ghost ao BaseButton`

**4. Crie o commit**
Execute `git commit -m "<mensagem>"`.

**5. Confirme o resultado**
Rode `git log --oneline -3` e mostre o commit criado.
