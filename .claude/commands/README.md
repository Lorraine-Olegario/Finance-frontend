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
cd ~/Documentos/Finance/Finance-frontend

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

Os comandos são digitados **dentro do chat do Claude Code** (depois que o `claude` abre). Não funcionam no terminal normal do zsh/bash.

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

### `/validate` — Validação profunda antes do PR

Faz uma análise completa do código alterado contra **todas as regras do projeto** sem fazer commit ou push. Use antes de abrir um PR para garantir conformidade.

```
/validate
```

Focado em um arquivo ou pasta:
```
/validate src/components/organisms/AddAssetModal.vue
/validate src/pages/
```

**O que ele valida:**

| Bloco | Regras verificadas |
|---|---|
| Código | `<script setup>`, API só em services/stores, sem `provide/inject`, prefixos `fetch`/`load`, guard de auth |
| CSS | Sem cores hardcoded, novas cores em `style.css`, sem gradientes em botões, status colors corretas |
| Atomic Design | Pasta correta por nível, dependências proibidas entre níveis, sem pastas legadas |
| Nomenclatura | PascalCase em `.vue`, BEM em CSS, prefixos reservados (`ds-`, `is-`, `has-`, `js-`), props/eventos kebab-case |
| Contrato de API | Endpoints vs `docs/contracts/api-contract.md`, autenticação, tratamento de erros, mapeamento de campos |
| Dashboard | `<SvgIcon>`, `flush: 'post'` em watchers, cores de categoria via store/API |

**Resultado:** relatório com violações críticas (bloqueiam o PR) e avisos de convenção.

---

### `/pr` — Abrir Pull Request no GitHub

Pipeline completo: fix → build → **validação de regras** → commit → push → cria PR.

```
/pr
```

Com título personalizado:
```
/pr feat: nova tela de relatórios mensais
```

**O que ele faz:**
1. `npm run fix` (Prettier + SVGs)
2. `npm run build`
3. **Valida todas as regras do projeto** (código, CSS, Atomic Design, nomenclatura, contrato de API)
4. Corrige violações automaticamente quando possível
5. Commita mudanças pendentes (se houver)
6. `git push -u origin <branch-atual>`
7. Cria o PR via `gh pr create` com título e checklist gerados a partir do diff
8. Mostra a URL do PR criado

**Checklist gerado no PR inclui:**
- Qualidade (fix + build)
- Código (`<script setup>`, API em services, prefixos de função, guard de auth)
- CSS (variáveis, `style.css`)
- Atomic Design (pasta correta, dependências, sem pastas legadas)
- Nomenclatura (PascalCase, BEM, props/eventos)
- Contrato de API (endpoints, erros, mapeamento)

**Pré-requisito extra:** GitHub CLI (`gh`) instalado e autenticado.

```bash
# Instalar gh (se não tiver — Linux)
sudo apt install gh   # ou: sudo snap install gh

# Autenticar
gh auth login
```

---

## Parte 4 — Fluxo de trabalho recomendado

```bash
# Abrir o projeto com Claude Code
cd ~/Documentos/Finance/Finance-frontend
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20
claude
```

Dentro do chat:

```
# Após desenvolver uma feature ou fix:

/validate          ← analisa profundamente todas as regras (sem commit)

/optimize          ← formata, builda, revisa e corrige convenções

/commit            ← faz stage e cria o commit

/pr                ← faz push e abre o PR no GitHub
```

Ou em um único passo quando já está pronto para PR:
```
/pr                ← já inclui fix, build, validação e commit antes de abrir o PR
```

### Quando usar cada comando

| Situação | Comando recomendado |
|---|---|
| Quero checar conformidade antes de commitar | `/validate` |
| Quero formatar e corrigir problemas de código | `/optimize` |
| Quero apenas criar um commit | `/commit` |
| Quero abrir PR com tudo validado | `/pr` |
| Quero validar um arquivo específico | `/validate src/components/atoms/BaseButton.vue` |

---

## Parte 5 — Solução de problemas

| Problema | Solução |
|---|---|
| `zsh: command not found: claude` | Instale com `npm install -g @anthropic-ai/claude-code` usando Node 20 |
| `claude` abre mas `/optimize` não funciona | Verifique se está em `~/Documentos/Finance/Finance-frontend` |
| Build falha dentro do `/optimize` ou `/pr` | O Claude identifica e corrige o erro automaticamente |
| `gh: command not found` | `sudo apt install gh` e depois `gh auth login` |
| `nvm: command not found` | `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"` |
| `/validate` reporta violação crítica | Corrija o problema indicado e rode `/validate` novamente antes do `/pr` |
