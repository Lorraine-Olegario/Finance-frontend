# 🧩 Componentes Reutilizáveis

## 📋 Visão Geral

Componentes criados para serem reutilizados em todo o sistema, reduzindo duplicação de código e mantendo consistência visual.

---

## 1. 🔄 LoadingSpinner

**Localização:** `/src/components/LoadingSpinner.vue`

### Descrição
Componente de loading com spinner animado e mensagem customizável.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `message` | String | `'Carregando...'` | Mensagem exibida abaixo do spinner |
| `size` | String | `'48px'` | Tamanho do spinner (width/height) |
| `fullscreen` | Boolean | `false` | Se true, ocupa tela inteira com overlay |

### Uso Básico

```vue
<!-- Loading simples -->
<LoadingSpinner />

<!-- Loading com mensagem customizada -->
<LoadingSpinner message="Buscando dados..." />

<!-- Loading menor -->
<LoadingSpinner message="Processando..." size="32px" />

<!-- Loading fullscreen (modal) -->
<LoadingSpinner message="Salvando..." :fullscreen="true" />
```

### Exemplos Práticos

```vue
<template>
  <div>
    <!-- Dentro de um container -->
    <LoadingSpinner v-if="loading" message="Carregando cotações..." />
    
    <!-- Fullscreen durante operação crítica -->
    <LoadingSpinner 
      v-if="saving" 
      message="Salvando alterações..."
      :fullscreen="true"
    />
  </div>
</template>
```

### Estilos
- Animação `spin` suave (0.8s linear infinite)
- Cores usando variáveis CSS do tema
- Modo fullscreen com backdrop semi-transparente

---

## 2. ⚠️ ErrorAlert

**Localização:** `/src/components/ErrorAlert.vue`

### Descrição
Componente de alerta para exibir mensagens de erro, warning, sucesso ou info.

### Props

| Prop | Tipo | Padrão | Obrigatório | Descrição |
|------|------|--------|-------------|-----------|
| `type` | String | `'error'` | Não | Tipo: `error`, `warning`, `success`, `info` |
| `title` | String | `''` | Não | Título do alerta (opcional) |
| `message` | String | - | **Sim** | Mensagem do alerta |
| `dismissible` | Boolean | `false` | Não | Se pode ser fechado |

### Eventos

| Evento | Parâmetros | Descrição |
|--------|-----------|-----------|
| `@dismiss` | - | Emitido quando usuário clica no botão fechar |

### Uso Básico

```vue
<!-- Erro simples -->
<ErrorAlert message="Erro ao carregar dados" />

<!-- Erro com título -->
<ErrorAlert 
  type="error"
  title="Falha na Conexão"
  message="Não foi possível conectar ao servidor"
/>

<!-- Warning -->
<ErrorAlert 
  type="warning"
  message="Alguns dados podem estar desatualizados"
/>

<!-- Sucesso -->
<ErrorAlert 
  type="success"
  message="Operação realizada com sucesso!"
/>

<!-- Dismissível -->
<ErrorAlert 
  message="Erro ao salvar"
  :dismissible="true"
  @dismiss="error = ''"
/>
```

### Exemplos Práticos

```vue
<template>
  <div>
    <!-- Erro com dismiss -->
    <ErrorAlert 
      v-if="error"
      type="error"
      :message="error"
      dismissible
      @dismiss="error = ''"
    />
    
    <!-- Sucesso temporário -->
    <ErrorAlert 
      v-if="success"
      type="success"
      message="Dados salvos com sucesso!"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: '',
      success: false
    }
  },
  methods: {
    async saveData() {
      try {
        await api.save()
        this.success = true
        setTimeout(() => this.success = false, 3000)
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>
```

### Cores Semânticas

| Tipo | Cor | Background | Border |
|------|-----|------------|--------|
| `error` | `#ef4444` | `rgba(239, 68, 68, 0.1)` | `rgba(239, 68, 68, 0.3)` |
| `warning` | `#f59e0b` | `rgba(245, 158, 11, 0.1)` | `rgba(245, 158, 11, 0.3)` |
| `success` | `#22c55e` | `rgba(34, 197, 94, 0.1)` | `rgba(34, 197, 94, 0.3)` |
| `info` | `#3b82f6` | `rgba(59, 130, 246, 0.1)` | `rgba(59, 130, 246, 0.3)` |

---

## 3. 📭 EmptyState

**Localização:** `/src/components/EmptyState.vue`

### Descrição
Componente para exibir estados vazios com ícone, título, descrição e ação.

### Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `title` | String | **Sim** | Título do estado vazio |
| `description` | String | **Sim** | Descrição detalhada |

### Slots

| Slot | Descrição |
|------|-----------|
| `icon` | Slot para ícone customizado |
| `action` | Slot para botões/ações |

### Uso Básico

```vue
<!-- Estado vazio simples -->
<EmptyState
  title="Nenhum item encontrado"
  description="Você ainda não adicionou nenhum item."
/>

<!-- Com ícone customizado -->
<EmptyState
  title="Lista vazia"
  description="Comece adicionando um novo item."
>
  <template #icon>
    <svg class="empty-icon" viewBox="0 0 24 24">
      <!-- Seu ícone SVG aqui -->
    </svg>
  </template>
</EmptyState>

<!-- Com botão de ação -->
<EmptyState
  title="Sem resultados"
  description="Tente ajustar os filtros."
>
  <template #action>
    <button @click="resetFilters" class="btn btn-primary">
      Limpar Filtros
    </button>
  </template>
</EmptyState>
```

### Exemplos Práticos

```vue
<template>
  <div>
    <!-- Estado vazio: sem dados -->
    <EmptyState
      v-if="!loading && items.length === 0"
      title="Nenhum ativo encontrado"
      description="Você ainda não possui ativos cadastrados."
    >
      <template #icon>
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </template>
      <template #action>
        <router-link to="/add" class="btn btn-primary">
          Adicionar Ativo
        </router-link>
      </template>
    </EmptyState>
    
    <!-- Estado vazio: busca sem resultados -->
    <EmptyState
      v-if="!loading && searchQuery && filteredItems.length === 0"
      title="Nenhum resultado encontrado"
      description="Tente usar palavras-chave diferentes."
    >
      <template #action>
        <button @click="clearSearch" class="btn btn-secondary">
          Limpar Busca
        </button>
      </template>
    </EmptyState>
  </div>
</template>
```

### Layout
- Centralizado com padding generoso
- Ícone: 80x80px, opacidade 0.5
- Título: 1.75rem, bold
- Descrição: max-width 500px
- Ações: flexbox centralizado com gap

---

## 🎨 Boas Práticas de Uso

### 1. LoadingSpinner

**✅ Fazer:**
```vue
<!-- Mostrar durante operações assíncronas -->
<LoadingSpinner v-if="loading" message="Carregando dados..." />

<!-- Usar fullscreen para operações críticas -->
<LoadingSpinner v-if="saving" message="Salvando..." :fullscreen="true" />
```

**❌ Evitar:**
```vue
<!-- Não usar múltiplos spinners -->
<LoadingSpinner />
<LoadingSpinner />

<!-- Não usar sem condição -->
<LoadingSpinner message="Sempre visível" />
```

### 2. ErrorAlert

**✅ Fazer:**
```vue
<!-- Sempre permitir dismiss em erros não-críticos -->
<ErrorAlert 
  v-if="error" 
  :message="error"
  dismissible
  @dismiss="error = ''"
/>

<!-- Usar tipo apropriado -->
<ErrorAlert type="warning" message="Atenção!" />
<ErrorAlert type="success" message="Sucesso!" />
```

**❌ Evitar:**
```vue
<!-- Não usar múltiplos alertas simultâneos -->
<ErrorAlert message="Erro 1" />
<ErrorAlert message="Erro 2" />

<!-- Não omitir dismiss em erros recuperáveis -->
<ErrorAlert message="Erro" />
```

### 3. EmptyState

**✅ Fazer:**
```vue
<!-- Sempre fornecer ação quando possível -->
<EmptyState title="Vazio" description="Descrição">
  <template #action>
    <button>Adicionar</button>
  </template>
</EmptyState>

<!-- Usar ícones relevantes -->
<EmptyState title="Sem conexão" description="...">
  <template #icon>
    <WifiOffIcon />
  </template>
</EmptyState>
```

**❌ Evitar:**
```vue
<!-- Não usar sem ação em contextos acionáveis -->
<EmptyState title="Nenhum item" description="Lista vazia" />

<!-- Não usar descrições genéricas -->
<EmptyState title="Vazio" description="Sem dados" />
```

---

## 🔄 Integração com o Sistema

### Exemplo Completo: Página de Listagem

```vue
<template>
  <MainLayout>
    <!-- Loading -->
    <LoadingSpinner v-if="loading" message="Carregando itens..." />
    
    <!-- Erro -->
    <ErrorAlert 
      v-if="error"
      type="error"
      :message="error"
      dismissible
      @dismiss="error = ''"
    />
    
    <!-- Lista de itens -->
    <div v-if="!loading && items.length" class="items-grid">
      <ItemCard v-for="item in items" :key="item.id" :item="item" />
    </div>
    
    <!-- Estado vazio -->
    <EmptyState
      v-if="!loading && !error && items.length === 0"
      title="Nenhum item encontrado"
      description="Comece adicionando seu primeiro item."
    >
      <template #icon>
        <InboxIcon />
      </template>
      <template #action>
        <button @click="openAddModal" class="btn btn-primary">
          Adicionar Item
        </button>
      </template>
    </EmptyState>
  </MainLayout>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  components: {
    LoadingSpinner,
    ErrorAlert,
    EmptyState
  },
  data() {
    return {
      items: [],
      loading: false,
      error: ''
    }
  },
  methods: {
    async loadItems() {
      this.loading = true
      this.error = ''
      try {
        const response = await api.getItems()
        this.items = response.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.loadItems()
  }
}
</script>
```

---

## 📊 Casos de Uso no Sistema

### Quotes.vue
```vue
<LoadingSpinner v-if="loading" message="Carregando cotações..." />
<ErrorAlert v-if="error" :message="error" dismissible @dismiss="error = ''" />
<EmptyState v-if="quotes.length === 0" title="..." description="...">
  <template #action>...</template>
</EmptyState>
```

### Assets.vue
```vue
<LoadingSpinner v-if="loading" />
<ErrorAlert v-if="error" type="error" :message="error" />
<EmptyState v-if="!assets.length" title="..." description="...">
  <template #action>
    <button @click="openAddModal">Adicionar Ativo</button>
  </template>
</EmptyState>
```

### User.vue
```vue
<LoadingSpinner v-if="saving" message="Salvando perfil..." :fullscreen="true" />
<ErrorAlert v-if="success" type="success" message="Perfil atualizado!" />
<ErrorAlert v-if="error" type="error" :message="error" dismissible />
```

---

## 🎯 Benefícios

### 1. **Consistência Visual**
- Todos os loadings têm o mesmo estilo
- Todos os erros seguem o mesmo padrão
- Estados vazios unificados

### 2. **Manutenibilidade**
- Alterar o spinner em 1 lugar atualiza todo o sistema
- Cores e estilos centralizados
- Menos código duplicado

### 3. **Reutilização**
- Componentes genéricos funcionam em qualquer contexto
- Props flexíveis para customização
- Slots para extensibilidade

### 4. **Developer Experience**
- API simples e intuitiva
- Props bem documentadas
- Exemplos de uso claros

---

## 🚀 Próximos Componentes Sugeridos

- **ConfirmDialog:** Modal de confirmação reutilizável
- **Toast/Notification:** Notificações temporárias
- **Pagination:** Paginação padronizada
- **SearchInput:** Input de busca com debounce
- **DataTable:** Tabela com ordenação e filtros
- **Modal:** Modal genérico com slots
- **Dropdown:** Menu dropdown customizável
- **Badge:** Badges de status/categorias

---

## 📝 Conclusão

Estes componentes reutilizáveis formam a base para um sistema consistente e manutenível. Use-os sempre que precisar exibir loading, erros ou estados vazios, garantindo uma experiência uniforme para o usuário.
