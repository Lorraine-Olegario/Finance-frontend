# Finance - Front-end

Sistema de gerenciamento de ativos financeiros com design minimalista.

## 🎨 Tema de Cores

- **Primária**: #6200EE
- **Secundária**: #3700B3
- **Destaque**: #BB86FC

## 🚀 Como Executar

### 1. Configurar ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API:

```
VITE_API_BASE_URL=http://localhost:8020/api/v1
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar em modo desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### 4. Build para produção

```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── assets/           # Recursos estáticos
├── components/       # Componentes reutilizáveis
│   ├── Sidebar.vue
│   └── MainLayout.vue
├── router/           # Configuração de rotas
│   └── index.js
├── services/         # Serviços de API
│   ├── api.js
│   ├── userService.js
│   └── assetService.js
├── views/            # Páginas/Views
│   ├── Dashboard.vue
│   ├── Users.vue
│   ├── Assets.vue
│   ├── Quotes.vue
│   └── History.vue
├── App.vue           # Componente raiz
├── main.js           # Entry point
└── style.css         # Estilos globais
```

## 📚 Funcionalidades

### 👥 Usuários
- Listar usuários
- Criar novo usuário
- Editar status de usuário

### 📊 Ativos
- Adicionar ativos para usuários (Ações e FIIs)
- Listar ativos observados
- Atualizar status dos ativos (observando, comprado, vendido)

### 💹 Cotações
- Buscar cotação em tempo real de ativos
- Visualizar preço, variação e dados de mercado
- Logos dos ativos

### 📈 Histórico
- Consultar histórico de preços
- Visualizar variações ao longo do tempo

## 🔌 API Endpoints Utilizados

- `GET /users` - Listar usuários
- `POST /users` - Criar usuário
- `PUT /users/{id}` - Atualizar usuário
- `POST /user/ativos?user_id=` - Adicionar ativos
- `PUT /user/ativos/status?user_id=` - Atualizar status
- `GET /user/ativos/observados?user_id=` - Listar ativos observados
- `GET /ativos/cotacao?codigo=` - Buscar cotação
- `GET /ativos/historico?codigo=` - Buscar histórico

## 🎯 Design

- **Minimalista**: Interface limpa e focada
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Menu Lateral**: Fixo em desktop, retrátil em mobile
- **Cards**: Componentes organizados em cards
- **Feedback Visual**: Mensagens de erro/sucesso, estados de loading

## 🛠 Tecnologias

- **Vue 3** - Framework JavaScript
- **Vue Router** - Roteamento
- **Axios** - Cliente HTTP
- **Vite** - Build tool
