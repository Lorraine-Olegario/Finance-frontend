---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git push:*), Bash(git branch:*), Bash(npm run:*), Bash(gh pr:*)
argument-hint: "[título do PR opcional]"
description: Roda fix, build, faz commit se necessário, push e abre o PR no GitHub
---

## Contexto

- Branch atual: !`git branch --show-current`
- Status: !`git status --short`
- Diff em relação ao main: !`git log --oneline main..HEAD`
- Arquivos alterados: !`git diff --name-only main..HEAD`

## Tarefa

Execute os passos abaixo **em ordem**. Pare e reporte se algum step crítico falhar.

---

**1. Rode o pipeline de qualidade**

```bash
NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20 && npm run fix
```

---

**2. Verifique o build**

```bash
NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20 && npm run build
```

Se o build falhar, corrija os erros antes de continuar.

---

**3. Commit de mudanças pendentes (se houver)**

Se `git status` mostrar arquivos modificados não commitados:
- Faça `git add` nos arquivos relevantes (evite `.env`, binários)
- Crie um commit convencional descrevendo as mudanças do fix/build

---

**4. Push da branch**

```bash
git push -u origin $(git branch --show-current)
```

---

**5. Crie o Pull Request**

Se $ARGUMENTS foi fornecido, use como título.

Caso contrário, analise o diff completo (`git diff main..HEAD`) e escreva:

**Título** — curto, imperativo, em português:
- Padrão: `feat: descrição` / `fix: descrição` / `refactor: descrição`

**Corpo** no formato:

```
## O que mudou
- (lista dos principais pontos)

## Por que mudou
- (contexto / motivação)

## Checklist
- [ ] `npm run fix` passou
- [ ] Build sem erros
- [ ] Sem cores hardcoded (usa variáveis CSS)
- [ ] Componentes novos na pasta Atomic Design correta
- [ ] Sem imports apontando para `src/views/`

🤖 Generated with [Claude Code](https://claude.ai/claude-code)
```

Execute:

```bash
gh pr create --title "<título>" --body "<corpo gerado>" --base main
```

---

**6. Confirme**

Mostre a URL do PR criado.
