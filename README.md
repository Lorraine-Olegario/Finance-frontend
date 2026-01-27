# Finance Frontend

Aplicação frontend para gerenciamento financeiro construída com Vue 3 + Vite.

## 🚀 Tecnologias

- Vue 3 com `<script setup>` SFCs
- Vite
- Vue Router
- Pinia (State Management)
- Docker + Nginx (Produção)

## 📋 Pré-requisitos

### Desenvolvimento Local
- Node.js 20 ou superior
- npm ou yarn

### Docker
- Docker
- Docker Compose

## 🐳 Rodando com Docker

```bash
docker compose up -d --build
```

A aplicação estará disponível em: `http://localhost:80`

> **Nota:** O Docker faz o build automaticamente durante a criação da imagem usando um multi-stage build. O container final executa apenas Nginx com os arquivos estáticos já compilados - não é necessário entrar no container ou executar comandos Node.js.

### Comandos úteis

```bash
# Ver logs
docker compose logs -f finance-frontend

# Parar o container
docker compose down

# Entrar no container
docker compose exec finance-frontend sh

# Remover containers e volumes
docker compose down -v
```

### Como funciona

O `Dockerfile` usa multi-stage build:
1. **Stage 1 (Builder):** Instala dependências Node.js e faz o build da aplicação
2. **Stage 2 (Production):** Copia apenas os arquivos buildados para um container Nginx limpo

Isso resulta em uma imagem de produção leve e segura, sem ferramentas de desenvolvimento.

### Health Check

O container possui um health check configurado que verifica a cada 30 segundos se a aplicação está respondendo.

```bash
# Verificar status do container
docker compose ps
```

## 💻 Desenvolvimento Local

> **Importante:** Esta seção é para desenvolvimento local COM Node.js instalado. Se você está usando apenas Docker, **não precisa executar estes comandos** - o build acontece automaticamente dentro do container.

### Instalação

```bash
# Instalar dependências (requer Node.js instalado localmente)
npm install
```

### Executar

```bash
# Modo desenvolvimento (hot-reload)
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```