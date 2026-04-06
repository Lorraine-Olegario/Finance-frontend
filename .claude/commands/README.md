# Claude Code — Comandos do Projeto

Comandos personalizados para o Finance Frontend usando Claude Code CLI.

---

## Parte 1 — Instalação do Claude Code (fazer só uma vez)

### Pré-requisito: Node 18+

O Claude Code exige Node 18 ou superior. Este projeto usa Node 20 via nvm.

```bash
# Ativar nvm e trocar para Node 20
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20
```

Verifique:
```bash
node -v   # deve mostrar v20.x.x
npm -v    # deve mostrar 10.x.x
```

### Instalar o Claude Code globalmente

```bash
npm install -g @anthropic-ai/claude-code
```

### Verificar instalação

```bash
claude --version
```

Se aparecer a versão, está pronto. Se aparecer `command not found`, reinicie o terminal e tente novamente.

### Login na primeira vez

```bash
claude
```

Na primeira execução, o Claude Code vai pedir para você autenticar com sua conta Anthropic. Siga as instruções na tela (abre o browser automaticamente).

---

## Parte 2 — Como abrir o Claude Code

**Sempre** que quiser usar o Claude Code, faça assim:

```bash
# 1. Entre na pasta do projeto
cd /Users/lorraineolegario/Documents/Finance-frontend

# 2. Ative o Node 20 (necessário para os comandos rodarem corretamente)
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20

# 3. Abra o Claude Code
claude
```

Você vai ver um prompt interativo assim:
```
✻ Welcome to Claude Code!
...
>
```

Agora você está dentro do Claude Code. Os comandos abaixo funcionam aqui.

---

## Parte 3 — Usando os comandos

Os comandos são digitados **dentro do chat do Claude Code** (depois que o `claude` abre). Não funcionam no terminal normal do zsh.

---

### `/commit` — Criar um commit convencional

Analisa o diff, faz stage e cria um commit no padrão Conventional Commits.

```
/commit
```

Com mensagem personalizada:
```
/commit feat(atoms): adicionar variante outline ao BaseButton
```

**O que ele faz:**
1. Lê `git status` e `git diff`
2. Faz `git add` nos arquivos relevantes
3. Gera mensagem no formato `tipo(escopo): descrição`
4. Executa `git commit`
5. Confirma com `git log --oneline -3`

**Tipos:** `feat` · `fix` · `refactor` · `docs` · `style` · `chore` · `test`

---

### `/optimize` — Qualidade e conformidade do código

Roda formatação, verifica build e checa se o código segue as convenções do projeto.

```
/optimize
```

Focado em um arquivo específico:
```
/optimize src/components/atoms/BaseButton.vue
```

**O que ele faz:**
1. `npm run fix` — minifica SVGs inline + Prettier
2. `npm run build` — verifica erros de compilação
3. Revisa arquivos alterados:
   - Cores via `var(--primary)` etc. (sem hardcode)
   - Componente na pasta Atomic Design correta
   - `<script setup>` em vez de Options API
   - API só em `src/services/` ou Pinia stores
4. Corrige violações encontradas
5. Mostra relatório final

---

### `/pr` — Abrir Pull Request no GitHub

Pipeline completo: fix → build → commit → push → cria PR.

```
/pr
```

Com título personalizado:
```
/pr feat: nova tela de relatórios mensais
```

**O que ele faz:**
1. `npm run fix`
2. `npm run build`
3. Commita mudanças pendentes (se houver)
4. `git push -u origin <branch-atual>`
5. Cria o PR via `gh pr create` com título e descrição gerados
6. Mostra a URL do PR criado

**Pré-requisito extra:** GitHub CLI (`gh`) instalado e autenticado.

```bash
# Instalar gh (se não tiver)
brew install gh

# Autenticar
gh auth login
```

---

## Parte 4 — Fluxo de trabalho recomendado

```bash
# Abrir o projeto com Claude Code
cd /Users/lorraineolegario/Documents/Finance-frontend
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20
claude
```

Dentro do chat:

```
# Depois de desenvolver uma feature ou fix:

/optimize          ← formata, builda, revisa convenções

/commit            ← faz stage e cria o commit

/pr                ← faz push e abre o PR no GitHub
```

Ou em um único passo quando já está pronto para PR:
```
/pr                ← já inclui fix, build e commit antes de abrir o PR
```

---

## Parte 5 — Solução de problemas

| Problema | Solução |
|---|---|
| `zsh: command not found: claude` | Instale com `npm install -g @anthropic-ai/claude-code` usando Node 20 |
| `claude` abre mas `/optimize` não funciona | Verifique se está em `/Users/.../Finance-frontend` |
| Build falha dentro do `/optimize` | O Claude identifica e corrige o erro automaticamente |
| `gh: command not found` | `brew install gh` e depois `gh auth login` |
| `nvm: command not found` | `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"` |
