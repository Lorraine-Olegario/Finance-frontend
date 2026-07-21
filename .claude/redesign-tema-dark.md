# Redesign — Paleta de Cores, Ícones e Tema Escuro

> Planejamento para migração completa do sistema para um tema escuro único,
> com nova identidade visual (cores, ícones, logo) mais profissional.
> Referência visual: telas do Investidor10 (dark UI financeira).

## Decisões fechadas

- **Tema:** dark único — sem toggle claro/escuro. Substitui todas as cores atuais.
- **Fundo base:** `#141414`
- **Cor primária/marca:** `#6200ee`
- **Regra de ouro:** toda cor global vive em `src/style.css`. Nenhum componente,
  página ou organism pode hardcodar cor. Verde/amarelo/vermelho seguem
  reservados exclusivamente para status de ativos. Gradientes só em ícones e
  destaques, nunca em botões genéricos.

## Tokens propostos (`src/style.css`)

```css
:root {
  /* ── Backgrounds ── */
  --bg-primary: #141414;
  --bg-secondary: #1a1a1a;   /* sidebar, header */
  --bg-elevated: #1e1e1e;    /* cards, modais */
  --bg-elevated-hover: #242424;
  --bg-input: #1c1c1c;

  /* ── Bordas ── */
  --border-subtle: #2a2a2a;
  --border-default: #333333;

  /* ── Texto ── */
  --text-primary: #f5f5f5;
  --text-secondary: #9a9a9a;
  --text-muted: #6b6b6b;

  /* ── Marca / Primária ── */
  --primary: #6200ee;
  --primary-hover: #7722ff;
  --primary-active: #4f00c4;
  --primary-muted: rgba(98, 0, 238, 0.14);
  --primary-contrast: #ffffff; /* texto sobre --primary */

  /* ── Status (uso exclusivo — não mexer) ── */
  --status-success: #4ade80;
  --status-success-bg: rgba(74, 222, 128, 0.12);
  --status-danger: #f87171;
  --status-danger-bg: rgba(248, 113, 113, 0.12);
  --status-warning: #facc15;
  --status-warning-bg: rgba(250, 204, 21, 0.12);

  /* ── Dados/gráficos (não é status) ── */
  --chart-blue: #5b8def;
  --chart-blue-light: #a8c5f7;
  --chart-primary: #6200ee;

  /* ── Elevação (sem box-shadow preto — usar borda) ── */
  --shadow-elevated: 0 0 0 1px var(--border-subtle);
}
```

**Decisão assumida:** botões de ação principal (ex.: "Adicionar Lançamento")
passam a usar `--primary` (`#6200ee`) em vez de branco sólido. Estados
disabled/secondary/ghost seguem neutros (`--bg-elevated` / `--border-default`).

## Fases

### Fase 0 — Discovery & Definição de Identidade (pré-código)
- [x] Definir paleta base (fundo, primária, neutros)
- [x] Definir dark único vs. toggle → **dark único**
- [ ] Definir paleta de status com contraste WCAG AA em fundo escuro
- [ ] Escolher fonte tipográfica (se for trocar) e escala de espaçamento
- [ ] Definir estilo de ícone: manter Heroicons (outline vs solid) ou trocar
- [ ] Briefing/redesenho da logo (SVG novo, versão para fundo escuro)
- [ ] Montar mini style guide de referência antes de propagar

### Fase 1 — Design Tokens (`src/style.css`)
- [x] Tokens de cor definidos (ver seção acima)
- [x] Aplicar tokens no `style.css` real do projeto
- [x] Definir tokens de sombra/elevação para modo escuro (borda sutil em vez
      de `box-shadow` preto) — `--shadow-elevated`, usado em `.card`
- [x] Atualizar variáveis de gradiente (ícones/destaques) — gradientes em
      `Login.vue`/`MainLayout.vue` usam `var(--primary)`/`var(--secondary)`/
      `var(--accent)`, que já resolvem para tons dark via bloco de
      compatibilidade
- [x] Documentar cada variável com comentário de uso pretendido (comentários
      de grupo no `:root`)

**Nota de implementação:** para não quebrar os ~150 usos de nomes antigos
(`--border`, `--surface`, `--secondary`, `--error`, `--accent-*` etc.)
espalhados em `src/pages/*.vue`, `MainLayout.vue` e `utilities.css`, foi
adicionado um bloco de **compatibilidade** no `:root` mapeando cada nome
legado para o token novo equivalente. Isso já deixa o app inteiro escuro.
Remover esse bloco só depois que as Fases 3-8 migrarem os call-sites para os
nomes semânticos novos.

### Fase 2 — Overrides do Bootstrap 5
- [ ] Mapear variáveis do Bootstrap (`--bs-primary`, `--bs-body-bg`,
      `--bs-border-color` etc.) para os tokens do `style.css`
- [ ] Revisar modais, dropdowns, tooltips, toasts em dark
- [ ] Testar `focus-ring` e estados `:disabled`

### Fase 3 — Atoms
- [ ] `Button` — variantes primary/secondary/ghost/danger em dark
- [ ] `Input` — fundo, borda, placeholder, foco/erro
- [ ] `Badge`
- [ ] `Spinner`
- [ ] Ícones — checar `fill`/`stroke` hardcoded vs `currentColor`
- [ ] Rodar `npm run fix` após ajustes de ícone

### Fase 4 — Molecules
- [ ] `SearchBar`
- [ ] `FormField`
- [ ] `StatsGrid` (atenção: mistura status com destaque — checar reserva de cor)
- [ ] `PageHeader`
- [ ] `TableActions`

### Fase 5 — Organisms
> Maior impacto visual percebido — pode ser adiantada logo após a Fase 1.
- [ ] **Sidebar** (menu principal) — mostrar preview antes de aplicar
- [ ] **Header** — logo nova + área de usuário
- [ ] `DataTable` — zebra, hover, ordenação, contraste em dark
- [ ] `AddAssetModal` e demais modais — fundo elevado, overlay escuro
- [ ] **Cards** de ativos/dashboard — sombra/borda/hierarquia

### Fase 6 — Templates
- [ ] `MainLayout`
- [ ] `AuthLayout`

### Fase 7 — Gráficos (Chart.js)
- [ ] Criar helper central de tema para Chart.js lendo dos tokens via JS
- [ ] Revisar todos os gráficos existentes para consumir esse helper

### Fase 8 — Páginas (`src/pages/`)
- [ ] Grep por cor hardcoded (`#`, `rgb(`, `rgba(`) fora do `style.css`
- [ ] Dashboard
- [ ] Meus Ativos
- [ ] Demais páginas de fluxo (login, cadastro, relatórios etc.)
- [ ] `DesignSystem/sections/*` — vitrine viva do novo tema

### Fase 9 — Marca e Imagens
- [ ] Substituir logo em todos os pontos de uso (Sidebar, Header, favicon, login)
- [ ] Revisar imagens/ilustrações de empty state (PNGs com fundo branco)
- [ ] Gerar favicon e meta tags de preview (og:image)

### Fase 10 — QA, Acessibilidade e Rollout
- [ ] Auditoria de contraste WCAG AA (texto sobre fundo escuro, status sobre cards)
- [ ] Teste responsivo (mobile/tablet)
- [ ] Teste de estados: loading, erro, vazio, hover, foco, disabled
- [ ] Grep final por hex/rgb hardcoded fora de `style.css`
- [ ] Revisão cruzada com `docs/naming-conventions.md` e `docs/patterns/page-pattern.md`
- [ ] Deploy incremental (feature flag, se possível)

## Observações estratégicas

- **Ordem recomendada:** tokens → Bootstrap → atoms → molecules → organisms
  → templates → páginas.
- **Adiantar Sidebar + Header + Cards** logo após os tokens, se precisar
  mostrar progresso rápido.
- **Chart.js é o ponto cego mais comum** — costuma ficar esquecido até o
  final e gera retrabalho.
- **Menu (Sidebar):** exibir preview visual antes de aplicar no código, por
  combinado com o time.
