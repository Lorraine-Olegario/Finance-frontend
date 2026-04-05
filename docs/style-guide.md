# Documentação de Cores e Componentes UI

## 1. Variáveis CSS Globais (`src/style.css`)

Usar **sempre** as variáveis abaixo. Nunca hardcodar valores de cor nos componentes.

| Variável             | Valor       | Uso                              |
|----------------------|-------------|----------------------------------|
| `--primary`          | `#6200ee`   | Ações principais, botões, links  |
| `--primary-dark`     | `#5000d0`   | Hover do primário                |
| `--secondary`        | `#3700b3`   | Ações secundárias                |
| `--accent`           | `#bb86fc`   | Destaques / accent               |
| `--surface`          | `#ffffff`   | Superfícies e cards              |
| `--bg-primary`       | `#ffffff`   | Fundo de cards e painéis         |
| `--bg-secondary`     | `#f5f5f5`   | Background geral da aplicação    |
| `--bg-hover`         | `#eeeeee`   | Hover de itens de lista          |
| `--background`       | `#f5f5f5`   | Alias de `--bg-secondary`        |
| `--text-primary`     | `#212121`   | Texto principal                  |
| `--text-secondary`   | `#757575`   | Texto secundário / muted         |
| `--border`           | `#e0e0e0`   | Bordas padrão                    |
| `--border-color`     | `#e0e0e0`   | Alias de `--border`              |
| `--error`            | `#b00020`   | Erros (Material Design)          |
| `--success`          | `#00c853`   | Sucesso (Material Design)        |
| `--danger`           | `#dc2626`   | Ações destrutivas                |
| `--accent-blue`      | `#3b82f6`   | Destaque azul                    |
| `--accent-blue-dark` | `#2563eb`   | Azul escuro (hover)              |
| `--accent-green`     | `#10b981`   | Destaque verde                   |
| `--accent-yellow`    | `#f59e0b`   | Destaque amarelo                 |

---

## 2. Status de Ativos

Cores de status usadas **exclusivamente** para indicar o estado de um ativo.

### Ativo (Verde)

```css
.status-ativo {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}
```

### Observando (Amarelo)

```css
.status-observando {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
}
```

### Inativo (Vermelho)

```css
.status-inativo {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
```

---

## 3. Gradientes

Usar apenas em ícones e elementos de destaque — nunca em botões de ação.

| Uso                        | Gradiente                                        |
|----------------------------|--------------------------------------------------|
| Ícone Observando (olho)    | `linear-gradient(135deg, #17a2b8, #138496)`      |
| Card destaque roxo         | `linear-gradient(135deg, #667eea, #764ba2)`      |
| Card destaque verde        | `linear-gradient(135deg, #10b981, #059669)`      |

---

## 4. Paleta de Gráficos (Chart.js)

Categorias de ativos usam as seguintes cores nos charts:

| Categoria  | Cor         |
|------------|-------------|
| Cripto     | `#ec4899`   |
| BDR        | `#8b5cf6`   |
| Ações      | `#3b82f6`   |
| FII        | `#10b981`   |
| Renda Fixa | `#f59e0b`   |

---

## 5. Opacidades e Overlays

Sombras e overlays usam `rgba`. Referência dos mais utilizados:

```css
/* Sombras de card */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

/* Overlays de modal */
background: rgba(0, 0, 0, 0.5);

/* Tints de cor primária */
background: rgba(98, 0, 238, 0.05);  /* hover sutil */
background: rgba(98, 0, 238, 0.1);   /* destaque leve */
```

---

## 6. Boas Práticas

- Usar `var(--primary)` para todas as ações principais.
- Cores de status (verde, amarelo, vermelho) apenas para status de ativos.
- Botões de filtro e ações neutras: usar `--bg-hover` e `--border`.
- Cards devem ser brancos (`--bg-primary`) sobre fundo `--bg-secondary`.
- Gradientes apenas em ícones ou elementos de destaque visual.
- Evitar adicionar novas cores fora das variáveis sem documentar aqui.

---

## 7. Padrão de Uso Resumido

| Componente  | Cor / Variável       | Uso                    |
|-------------|----------------------|------------------------|
| Primário    | `#6200ee`            | Ações principais       |
| Observando  | `#856404` / amarelo  | Status atenção         |
| Ativo       | `#155724` / verde    | Status funcionando     |
| Inativo     | `#721c24` / vermelho | Status erro/bloqueado  |
| Fundo       | `#f5f5f5`            | Background             |
| Card        | `#ffffff`            | Conteúdo               |
| Texto       | `#212121`            | Principal              |
| Texto soft  | `#757575`            | Secundário             |
| Borda       | `#e0e0e0`            | Separadores            |

---

## 8. Átomos disponíveis (`src/components/atoms/`)

| Componente        | Descrição                                              |
|-------------------|--------------------------------------------------------|
| `AppSpinner`      | Spinner inline para botões e áreas de conteúdo         |
| `BaseButton`      | Botão com variantes primary/secondary/ghost/danger     |
| `BaseInput`       | Input com v-model, foco e estados                      |
| `BaseSelect`      | Select com array `[{value, label}]`                    |
| `Badge`           | Badge de categoria com mapa de cores built-in          |
| `StatusBadge`     | Badge exclusivo para status de ativo                   |
| `ActionButton`    | Botão 36×36px para ícones de ação em tabelas           |
| `FilterLabel`     | Wrapper de label para campos de filtro                 |
| `LoadingSpinner`  | Spinner de seção/página com suporte a fullscreen       |
| `EmptyState`      | Estado vazio com slot de ícone e ação                  |
| `AlertMessage`    | Alert contextual com 4 tipos e dismiss                 |
| `Pagination`      | Paginação com ellipsis e cálculo automático            |
| `StatCard`        | Card de métrica com barra lateral colorida             |
| `DashboardCard`   | Container de seção do dashboard                        |
| `QuickActionCard` | Card de navegação rápida (RouterLink)                  |
| `CategoryListItem`| Linha de categoria com dot, nome, count e percentual   |

---

## 9. Moléculas disponíveis (`src/components/molecules/`)

Moléculas combinam 2+ átomos para um bloco funcional reutilizável.

| Componente     | Átomos usados                    | Descrição                                          |
|----------------|----------------------------------|----------------------------------------------------|
| `SearchBar`    | —                                | Input de busca com ícone, clear button e foco      |
| `FormField`    | `FilterLabel` + qualquer input   | Wrapper label + campo + hint/erro                  |
| `StatsGrid`    | `StatCard` (slot)                | Grid responsivo auto-fit para StatCards            |
| `PageHeader`   | —                                | Título + subtítulo + slot de ações                 |
| `TableActions` | `ActionButton` (slot)            | Container flex para botões de ação em tabelas      |

### Padrões das Moléculas

- Aceitam slot `default` ou slots nomeados para composição flexível.
- Não fazem chamadas de API — são puramente apresentacionais.
- Nunca encapsulam estado global — usam `v-model` e emits locais.
- Estilos exclusivamente com variáveis CSS — sem valores hardcoded.

