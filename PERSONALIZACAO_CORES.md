# Personalização de Cores das Categorias

## ✅ Implementado

### Funcionalidade
Agora você pode personalizar as cores das categorias diretamente no modal de edição de ativos na página "Meus Ativos".

### Como Usar

1. **Acessar a Edição**
   - Vá para a página "Meus Ativos"
   - Clique no botão "Editar" (✏️) de qualquer ativo

2. **Personalizar a Cor**
   - No modal de edição, você verá uma nova seção "Cor da Categoria"
   - Use o seletor de cor para escolher a cor desejada
   - A cor será aplicada a TODOS os ativos da mesma categoria

3. **Restaurar Cor Padrão**
   - Clique no botão de reset (🔄) para restaurar a cor padrão da categoria

4. **Salvar**
   - Clique em "Salvar Alterações" para aplicar a nova cor

### Cores Padrão

- **Ações**: `#ff6b35` (laranja)
- **FIIs**: `#004e89` (azul)
- **Outras**: `#6200EE` (roxo)

### Características

- ✅ Seletor de cor visual com preview
- ✅ Exibição do código hexadecimal da cor
- ✅ Botão para restaurar cor padrão
- ✅ A cor é aplicada a todos os ativos da categoria
- ✅ Persistência no backend
- ✅ Sincronização entre todas as páginas (Dashboard, Ativos, Cotações)

## 🗑️ Removido

### Página de Configurações
A página separada de configurações foi removida porque:
- A personalização de cores agora está integrada no fluxo de edição de ativos
- Mais intuitivo e contextual
- Reduz navegação desnecessária

### Arquivos Afetados

**Modificados:**
- `src/views/Assets.vue` - Adicionado seletor de cor no modal de edição
- `src/router/index.js` - Removida rota `/settings`
- `src/components/Sidebar.vue` - Removido link "Configurações"

**Mantidos mas não utilizados:**
- `src/views/Settings.vue` - Pode ser removido ou usado para outras configurações futuras

## 🎨 Interface

### Modal de Edição - Nova Seção

```
┌─────────────────────────────────────┐
│ Cor da Categoria: Ações             │
│ [🎨] [━━━━━━━━━] [🔄]               │
│      #ff6b35                        │
│ Esta cor será aplicada a todos...   │
└─────────────────────────────────────┘
```

- **[🎨]** = Seletor de cor nativo do navegador
- **[━━━━━━━━━]** = Preview da cor com código hexadecimal
- **[🔄]** = Botão para restaurar cor padrão

## 💡 Benefícios

1. **Melhor UX**: Editar cor no contexto de edição do ativo
2. **Menos Cliques**: Não precisa navegar para página separada
3. **Visualização Imediata**: Ver a cor aplicada em tempo real
4. **Menos Confusão**: Clara indicação de que a cor afeta toda a categoria

## 🔧 Técnico

### Fluxo de Atualização

1. Usuário abre modal de edição de ativo
2. Cor atual da categoria é carregada em `editCategoryColor`
3. Usuário modifica a cor
4. Ao salvar, se a cor foi alterada:
   - Backend é atualizado via `assetService.updateCategoryColors()`
   - Store local `categoryColors` é atualizado
   - Todos os badges da categoria refletem a nova cor

### API Utilizada

```javascript
// Endpoint backend
PUT /user/category-colors?user_id={userId}

// Payload
{
  "colors": {
    "Ações": "#ff6b35",
    "FIIs": "#004e89"
  }
}
```

### Persistência

As cores são salvas no backend e sincronizadas em todas as visualizações que usam `getCategoryColor()`:
- Dashboard (gráficos)
- Ativos (badges)
- Cotações (badges)
