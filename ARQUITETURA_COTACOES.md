# Arquitetura da Página de Cotações

## 📋 Visão Geral

A página de Cotações foi refatorada seguindo princípios de **componentização**, **separação de responsabilidades** e **código limpo**. A nova arquitetura facilita manutenção, testes e reutilização de código.

## 🏗️ Estrutura de Componentes

### 1. **Quotes.vue** (Componente Principal)
**Localização:** `/src/views/Quotes.vue`

**Responsabilidades:**
- Gerenciar estado da aplicação (ativos, cotações, loading, erros)
- Orquestrar a busca de dados via API
- Aplicar filtros e ordenação
- Renderizar componentes filhos
- Controlar abertura/fechamento do filtro

**Dados:**
```javascript
{
  userAssets: [],        // Ativos do usuário
  quotes: [],            // Cotações carregadas
  loading: false,        // Estado de carregamento
  error: '',             // Mensagens de erro
  isFilterOpen: false,   // Controle do sidebar de filtros
  filters: {             // Estado dos filtros
    search: '',
    variation: '',
    sortBy: 'symbol',
    sortOrder: 'asc'
  }
}
```

**Computed Properties:**
- `filteredQuotes`: Aplica busca, filtros e ordenação nas cotações

**Métodos Principais:**
- `fetchAllQuotes()`: Busca todos os ativos do usuário e suas cotações **individualmente**
- `openFilters()`: Abre sidebar de filtros
- `closeFilters()`: Fecha sidebar de filtros
- `applyFilters(newFilters)`: Aplica novos filtros

---

### 2. **QuoteCard.vue** (Componente de Apresentação)
**Localização:** `/src/components/QuoteCard.vue`

**Responsabilidades:**
- Exibir informações de uma cotação individual
- Formatar dados de preço, variação, volume, etc.
- Apresentar indicadores visuais (cores, ícones, badges)
- Gerenciar erros de imagem (logo)

**Props:**
```javascript
{
  quote: Object  // Objeto com dados da cotação
}
```

**Computed Properties:**
- `currentPrice`: Preço atual do ativo
- `change`: Variação absoluta
- `changePercent`: Variação percentual
- `isPositive`: Se a variação é positiva
- `changeClass`: Classe CSS baseada na variação ('positive' ou 'negative')
- `formattedChange`: Variação formatada com sinal
- `formattedChangePercent`: % formatado com sinal

**Métodos:**
- `formatPrice(price)`: Formata preço com 2 casas decimais
- `formatLargeNumber(num)`: Formata números grandes (B/M/K)
- `handleImageError(event)`: Esconde imagem quebrada

**Visual:**
- Badge circular com trend (subida/descida)
- Seção de preço principal
- Seção de variação com cor semântica
- Detalhes: Market Cap, Volume, Min/Max do dia

---

### 3. **QuotesFilter.vue** (Componente de Filtro)
**Localização:** `/src/components/QuotesFilter.vue`

**Responsabilidades:**
- Renderizar sidebar de filtros
- Gerenciar estado local dos filtros
- Emitir eventos de aplicação e fechamento
- Validar e resetar filtros

**Props:**
```javascript
{
  isOpen: Boolean,     // Controla visibilidade
  filters: Object      // Estado atual dos filtros
}
```

**Data Local:**
```javascript
{
  localFilters: {
    search: '',
    variation: '',
    sortBy: 'symbol',
    sortOrder: 'asc'
  }
}
```

**Métodos:**
- `applyFilters()`: Emite evento `@apply` com filtros e fecha sidebar
- `resetFilters()`: Limpa todos os filtros e aplica

**Eventos Emitidos:**
- `@apply`: Quando filtros são aplicados
- `@close`: Quando sidebar é fechada

**Visual:**
- Sidebar deslizante da direita
- Campos: Busca, Variação, Ordenar Por, Ordem
- Botões: Limpar Filtros, Aplicar

---

## 🔄 Fluxo de Dados

### 1. Carregamento Inicial
```
mounted() → fetchAllQuotes()
  ↓
getUserAssets() → Lista de ativos do usuário
  ↓
for (cada ativo) {
  getAssetQuote(codigo) → Cotação individual
}
  ↓
quotes[] = todas as cotações carregadas
```

### 2. Busca de Cotações (forEach Pattern)

**Antes (Promise.all - problema):**
```javascript
// ❌ Todas as requisições paralelas (pode sobrecarregar API)
const promises = assets.map(asset => getAssetQuote(asset.codigo))
const results = await Promise.all(promises)
```

**Agora (for...of - correto):**
```javascript
// ✓ Uma requisição por vez, sequencial e controlado
for (const asset of this.userAssets) {
  const response = await assetService.getAssetQuote(asset.codigo)
  quotesArray.push(response.data)
}
```

**Vantagens:**
- ✓ Requisições sequenciais evitam sobrecarga
- ✓ Logs detalhados de cada busca
- ✓ Tratamento de erro individualizado
- ✓ Controle de progresso ([1/10], [2/10], etc.)

### 3. Filtros e Ordenação
```
quotes[] (dados brutos)
  ↓
filteredQuotes (computed)
  ↓
Aplicar busca (symbol, shortName, longName)
  ↓
Aplicar filtro variação (positive/negative)
  ↓
Aplicar ordenação (price/change/volume/symbol)
  ↓
Resultado final renderizado
```

### 4. Interação com Filtros
```
Usuário abre filtro → isFilterOpen = true
  ↓
Usuário altera campos → localFilters atualizado
  ↓
Clica "Aplicar" → emit @apply(localFilters)
  ↓
Quotes.vue recebe → applyFilters(newFilters)
  ↓
filters atualizado → computed filteredQuotes recalcula
  ↓
QuoteCard components re-renderizados
```

---

## 🎨 Design e UX

### Layout Responsivo
- **Desktop:** Grid auto-fill com min 380px
- **Tablet:** Grid adaptável
- **Mobile:** 1 coluna

### Cores Semânticas
```css
--positive: #22c55e  /* Verde */
--negative: #ef4444  /* Vermelho */
--primary: #6200EE   /* Roxo */
```

### Estados Visuais
- **Loading:** Spinner centralizado + mensagem
- **Error:** Alert vermelho com ícone
- **Empty:** Ícone + mensagem + CTA
- **Success:** Grid de cards com animação slideUp

### Animações
- `fadeIn`: Entrada da página
- `slideUp`: Cards aparecem
- `spin`: Loading spinner
- `slide`: Sidebar de filtros

---

## 📊 Estrutura de Dados

### Objeto Quote (Exemplo)
```javascript
{
  symbol: "PETR4.SA",
  shortName: "PETROBRAS PN",
  longName: "Petróleo Brasileiro S.A. - Petrobras",
  logourl: "https://...",
  currency: "BRL",
  regularMarketPrice: 38.50,
  regularMarketChange: 0.85,
  regularMarketChangePercent: 2.26,
  regularMarketVolume: 45000000,
  marketCap: 500000000000,
  regularMarketDayHigh: 39.00,
  regularMarketDayLow: 37.80,
  priceEarnings: 5.2
}
```

---

## 🔧 Manutenibilidade

### Benefícios da Nova Arquitetura

1. **Componentização**
   - Componentes pequenos e focados
   - Fácil de testar individualmente
   - Reutilizáveis em outras páginas

2. **Separação de Responsabilidades**
   - **Quotes.vue:** Lógica de negócio e estado
   - **QuoteCard.vue:** Apresentação de dados
   - **QuotesFilter.vue:** Interface de filtros

3. **Código Limpo**
   - Métodos com responsabilidade única
   - Nomes descritivos
   - Logs para debugging
   - Tratamento de erros isolado

4. **Escalabilidade**
   - Fácil adicionar novos filtros
   - Fácil adicionar novos campos no card
   - Fácil modificar layout

### Como Adicionar um Novo Filtro

**1. Adicionar campo em QuotesFilter.vue:**
```vue
<select v-model="localFilters.category">
  <option value="">Todas</option>
  <option value="stock">Ações</option>
  <option value="crypto">Cripto</option>
</select>
```

**2. Adicionar lógica em Quotes.vue (computed):**
```javascript
if (this.filters.category) {
  result = result.filter(q => q.category === this.filters.category)
}
```

### Como Adicionar um Novo Campo no Card

**QuoteCard.vue:**
```vue
<div class="detail-item">
  <span class="detail-label">Dividendos</span>
  <span class="detail-value">{{ quote.dividendYield }}%</span>
</div>
```

---

## 🚀 Melhorias Futuras

### Performance
- [ ] Virtualização de lista (para +100 ativos)
- [ ] Debounce na busca de filtros
- [ ] Cache de cotações (5min)
- [ ] Lazy loading de logos

### Funcionalidades
- [ ] WebSocket para cotações em tempo real
- [ ] Alertas de preço
- [ ] Gráficos de histórico
- [ ] Comparação entre ativos
- [ ] Exportar para CSV/PDF

### UX
- [ ] Dark mode toggle
- [ ] Favoritar ativos
- [ ] Customizar layout (cards/table)
- [ ] Atalhos de teclado

---

## 📝 Logs e Debugging

O método `fetchAllQuotes()` inclui logs detalhados:

```
Total de ativos do usuário: 5
[1/5] Buscando cotação: PETR4
  ✓ Cotação adicionada
[2/5] Buscando cotação: VALE3
  ✓ Cotação adicionada
[3/5] Buscando cotação: ITUB4
  ✗ Erro ao buscar ITUB4: Network error
[4/5] Buscando cotação: BBDC4
  ✓ Adicionadas 2 cotação(ões)
[5/5] Buscando cotação: MGLU3
  ✓ Cotação adicionada
✓ Total de cotações carregadas: 4
```

---

## 🎯 Conclusão

A nova arquitetura da página de Cotações segue **best practices** de Vue.js:
- ✅ Componentes reutilizáveis e testáveis
- ✅ Props e eventos bem definidos
- ✅ Computed properties para lógica reativa
- ✅ Métodos com responsabilidade única
- ✅ Código limpo e documentado
- ✅ Layout profissional e responsivo
- ✅ Busca sequencial de cotações (forEach pattern)
- ✅ Sistema de filtros robusto

**Resultado:** Código escalável, manutenível e com excelente experiência de usuário.
