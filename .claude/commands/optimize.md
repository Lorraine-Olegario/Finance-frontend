---
allowed-tools: Bash(npm run:*), Bash(git diff:*), Bash(git status:*), Read, Grep, Glob
argument-hint: "[arquivo ou pasta opcional]"
description: Roda lint/format, verifica build e revisa qualidade do código alterado
---

## Contexto

- Branch atual: !`git branch --show-current`
- Arquivos alterados: !`git diff --name-only HEAD`
- Status: !`git status --short`

## Tarefa

Execute os passos abaixo em ordem:

**1. Rode o pipeline de qualidade**

```bash
NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20 && npm run fix
```

`npm run fix` executa: `minify:inline-svgs` → `format` (Prettier). Reporte erros se ocorrerem.

**2. Verifique o build**

```bash
NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20 && npm run build
```

Se o build falhar, identifique e corrija os erros antes de continuar.

**3. Revise os arquivos alterados**

Se $ARGUMENTS for fornecido, foque nesse arquivo/pasta. Caso contrário, revise todos os arquivos no diff.

Para cada arquivo alterado, verifique:

- [ ] Usa `<script setup>` (nunca Options API)
- [ ] Cores via variáveis CSS (`var(--primary)`, `var(--border)`, etc.) — sem valores hardcoded
- [ ] Novo componente está na pasta correta do Atomic Design (`atoms/`, `molecules/`, `organisms/`, `templates/`)
- [ ] Sem chamadas de API fora de `src/services/` ou Pinia stores
- [ ] Sem estado global via `provide/inject`
- [ ] Componente atom não importa organisms ou pages
- [ ] Sem `src/views/` sendo referenciada em imports novos

**4. Corrija os problemas encontrados**

Aplique correções diretas para qualquer violação das convenções acima. Não faça refatorações além do necessário.

**5. Relatório final**

Liste:
- O que foi formatado pelo Prettier
- Violações encontradas e corrigidas
- Status do build (OK / erros)
- Arquivos modificados após as correções
