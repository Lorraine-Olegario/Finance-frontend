# Finance — Redesign: Fluxos e Backlog

Documento de apoio para transformar o redesign em tasks. Cobre a arquitetura de informação, os fluxos principais e uma lista de tarefas já quebrada em granularidade de ticket.

---

## 1. Diagnóstico rápido do estado atual

- Cards de métricas sem hierarquia visual clara (todos com o mesmo peso).
- Tabelas densas sem estados de empty/loading, sem ordenação, sem paginação.
- Modais (Nova Transação, Editar Ativo, Pausar Ativo) funcionais mas visualmente genéricos — sem confirmação de sucesso, sem validação visível.
- Paleta roxo/cinza de template, sem identidade própria.
- Números (moeda, %, quantidade) sem tratamento tipográfico — dificulta leitura rápida de valores.
- Navegação lateral não comunica o que está disponível vs. "em breve".

## 2. Direção de design escolhida

Um sistema "ledger" (livro-razão): números sempre em monoespaçada com alinhamento tabular, categorias tratadas como "carimbos" (stamps), cor de marca em verde-menta (ganho) + dourado (FIIs) + coral (perda), fundo quase-preto com verde-petróleo. Sparkline no card de patrimônio como assinatura visual. Protótipo em `finance-redesign-prototype.html`.

---

## 3. Arquitetura de informação (IA)

```
Finance
├── Dashboard            → visão geral (hoje: patrimônio, lucro, alocação, top variações)
├── Carteira
│   ├── Posições          → snapshot atual por ativo
│   └── Extrato            → histórico de transações (compra/venda)
├── Ativos                → cadastro/gestão dos ativos monitorados (editar, pausar, remover)
├── Ativos Observados     → watchlist (ainda não implementado)
├── Cotações              → preços em tempo real (ainda não implementado)
└── Histórico             → série temporal de patrimônio (ainda não implementado)
```

Regra de navegação: itens sem funcionalidade real ficam com badge "em breve" e estado disabled — evita a sensação de link quebrado.

---

## 4. Fluxos principais

### 4.1 Registrar transação (Compra/Venda)
```
Dashboard/Carteira → clique "Nova Transação"
  → abre modal com toggle Compra/Venda
  → preenche Código, Quantidade, Preço, Data
  → [Registrar]
      → valida campos obrigatórios
      → recalcula posição do ativo (cria se não existir)
      → recalcula patrimônio, lucro e alocação por categoria
      → fecha modal + toast de confirmação
      → tabela de Extrato atualizada no topo
```
Pontos em aberto para decidir com você:
- Se o ativo não existir em `Ativos`, criar automaticamente ou bloquear com link para cadastro?
- Venda maior que a posição atual: bloquear ou permitir posição negativa (short)?

### 4.2 Editar ativo
```
Ativos → ícone "editar" na linha
  → modal com Código, Nome, Cor da categoria
  → [Salvar alterações]
      → atualiza o ativo
      → cor de categoria propaga para todos os ativos da mesma categoria (comportamento já existente, manter)
```

### 4.3 Pausar / reativar ativo
```
Ativos → ícone "pausar"
  → modal de confirmação com aviso do impacto (sai dos cálculos do dashboard)
  → [Pausar] → status muda para PAUSADO, ícone e botão passam a oferecer "Reativar"
```
Melhoria proposta: ativo pausado deixa de contar em Patrimônio/Distribuição, mas continua visível em Ativos com badge cinza — hoje não fica claro se ele some do resto do sistema.

### 4.4 Consultar carteira (Posições vs. Extrato)
```
Carteira → tabs "Posições" | "Extrato"
  → filtro por categoria (dropdown) + busca por código (client-side, debounce)
  → Posições: código, categoria, qtd, preço médio, preço atual, valor total, rentabilidade
  → Extrato: data, código, tipo (compra/venda), qtd, preço, valor total, ações (editar/excluir)
```

### 4.5 Modo privacidade
```
Topbar → ícone de olho
  → todos os valores monetários (money, .stat-value) recebem blur
  → estado persiste durante a sessão (avaliar se deve persistir entre sessões — localStorage/preferência de usuário)
```

---

## 5. Backlog — tickets sugeridos

Granularidade pensada para virar branch/PR único cada (padrão `yt-branch`).

**Épico: Redesign visual base**
- [ ] `FIN-1` Implementar novo design system (tokens de cor, tipografia mono para números, componentes de card/stamp/pill) em CSS/Tailwind
- [ ] `FIN-2` Refatorar sidebar: estados active/disabled, badge "em breve" para páginas não implementadas
- [ ] `FIN-3` Refatorar topbar: modo privacidade com blur em valores monetários

**Épico: Dashboard**
- [ ] `FIN-4` Novo layout de stat cards (patrimônio, lucro, proventos) com sparkline no card de patrimônio
- [ ] `FIN-5` Painel de distribuição por categoria (donut + legenda) — substituir gráfico atual
- [ ] `FIN-6` Painel de "maiores variações" (positivas/negativas) no dashboard

**Épico: Carteira**
- [ ] `FIN-7` Tabela de Posições: colunas com números tabulares, badge de categoria como stamp, coluna de rentabilidade com pill colorida
- [ ] `FIN-8` Tabela de Extrato: badge Compra/Venda, ações de editar/excluir com confirmação
- [ ] `FIN-9` Filtro por categoria + busca por código (client-side) nas duas tabelas
- [ ] `FIN-10` Estado vazio (empty state) para quando não há posições/transações

**Épico: Ativos**
- [ ] `FIN-11` Modal "Nova Transação" com toggle Compra/Venda e validação de campos
- [ ] `FIN-12` Modal "Editar Ativo" com preview de cor da categoria
- [ ] `FIN-13` Modal "Pausar Ativo" com aviso de impacto + definir comportamento de cálculo para ativos pausados (decisão de produto pendente — ver seção 4.1/4.3)
- [ ] `FIN-14` Toast de confirmação de sucesso/erro para as 3 ações acima (hoje não existe feedback pós-ação)

**Épico: Fundação (não visual)**
- [ ] `FIN-15` Definir regra de negócio: venda maior que posição atual (bloquear vs. permitir)
- [ ] `FIN-16` Definir regra: criação automática de ativo ao registrar transação de código inexistente
- [ ] `FIN-17` Persistência da preferência de modo privacidade (sessão vs. usuário)

---

## 6. Referência visual

Protótipo navegável: `finance-redesign-prototype.html` (Vue 3, componente único, dados de exemplo iguais aos das suas telas atuais). Cobre Dashboard, Carteira (Posições/Extrato) e Ativos, incluindo os 3 modais.
