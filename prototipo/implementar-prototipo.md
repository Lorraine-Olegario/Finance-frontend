---
description: Lê os arquivos da pasta prototipo/, transforma o backlog em tasks e implementa o redesign, usando múltiplos agentes quando as tarefas forem independentes
---

# Implementar Redesign do Finance

Argumento opcional: $ARGUMENTS (caminho da pasta do protótipo; padrão `prototipo/`).

## 1. Leitura

Leia os dois arquivos da pasta indicada (padrão `prototipo/`):
- `finance-redesign-prototype.html` — protótipo funcional em Vue 3. É a referência de estrutura de telas, componentes, estados (empty, pausado, hover), copy dos textos e comportamento de cada fluxo. Não é pra copiar HTML/CSS cru — é pra copiar a intenção de design e adaptar aos componentes Vue/Blade reais do projeto.
- `finance-redesign-fluxos.md` — arquitetura de informação, os 5 fluxos principais e o backlog (tickets `FIN-1` a `FIN-17`) na seção 5.

Antes de codar qualquer coisa, mapeie o código-fonte atual do projeto (telas de Dashboard, Carteira, Ativos, componentes de modal, rotas) e identifique onde cada ticket do backlog vai tocar.

## 2. Planejamento

Use a lista de todos para transformar os tickets da seção 5 do `fluxos.md` em tarefas rastreáveis. Ordem de execução:

1. `FIN-1` (design system/tokens) primeiro — é pré-requisito de tudo que é visual.
2. `FIN-15`, `FIN-16` (decisões de negócio) — não implemente sem resposta, ver passo 4.
3. Demais tickets, agrupados por tela (Dashboard, Carteira, Ativos), podem rodar em paralelo entre si depois que o passo 1 estiver pronto.

## 3. Execução com subagentes

Depois do design system estar pronto, dispare um agente por área quando as tarefas forem independentes (não mexem no mesmo arquivo):
- Agente A → Dashboard (`FIN-4`, `FIN-5`, `FIN-6`)
- Agente B → Carteira (`FIN-7`, `FIN-8`, `FIN-9`, `FIN-10`)
- Agente C → Ativos + modais (`FIN-11`, `FIN-12`, `FIN-13`, `FIN-14`)

Cada agente deve:
- Ler apenas os trechos do protótipo e do código relevantes à sua área.
- Seguir os padrões do skill `braip-conventions` (DTO/Service/Repository, sem `else`, compatibilidade PHP 7.2/Laravel 5.8).
- Não alterar arquivos fora do seu escopo (ex: se dois agentes precisarem do mesmo componente compartilhado, isso deveria ter sido resolvido no `FIN-1`).

Tarefas que compartilham arquivo ou dependem uma da outra rodam sequencialmente, nunca em paralelo.

## 4. Perguntas de produto obrigatórias

Pare e pergunte à Lorraine antes de implementar `FIN-11` e `FIN-13`:
- Venda maior que a posição atual do ativo: bloquear ou permitir posição negativa?
- Ativo pausado deve sair dos cálculos de patrimônio/distribuição no dashboard?
- Transação com código de ativo inexistente: criar o ativo automaticamente ou bloquear com link para cadastro?

Não assuma resposta padrão para essas três — são regras de negócio, não de design.

## 5. Revisão e finalização

Para cada ticket:
- Crie a branch com o alias `yt-branch FIN-x` antes de começar.
- Rode lint/testes existentes no projeto ao final da implementação.
- Revise o diff antes de marcar a task como concluída.
- Finalize com commit referenciando o ticket.

## 6. Resumo final

Ao terminar todos os tickets (ou ao pausar por falta de resposta de produto), apresente um resumo: o que foi implementado, o que ficou bloqueado aguardando decisão, e o que sugere como próximo passo.
