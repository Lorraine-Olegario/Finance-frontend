# Página de Ativos Observados - Documentação

## 📋 Resumo

Foi criada uma página completa para gerenciamento de ativos observados com funcionalidades de listagem, filtros, edição de alertas e remoção da observação.

## 🎯 Funcionalidades Implementadas

### 1. **Página de Ativos Observados** (`/observed`)
- **Localização**: `/front_finance/src/views/ObservedAssets.vue`
- **Rota**: `/observed`
- **Componentes**:
  - Listagem em tabela responsiva
  - Sistema de filtros (busca, categoria, status de alerta)
  - Cards de resumo (total, com alertas, sem alertas)
  - Estados de loading, erro e vazio

### 2. **Modal de Edição de Alertas**
- **Localização**: `/front_finance/src/components/EditAlertModal.vue`
- **Funcionalidades**:
  - Configurar valor mínimo e máximo
  - Ativar/desativar notificações para cada limite
  - Configurar frequência de notificação (todas as vezes, diário, semanal)
  - Ativar/desativar alerta
  - Validação de formulário

### 3. **Serviços de API** (Frontend)
- **Localização**: `/front_finance/src/services/assetService.js`
- **Métodos adicionados**:
  - `getAssetAlerts(userId)` - Lista todos os alertas do usuário
  - `saveAssetAlert(userId, alertData)` - Cria/atualiza alerta
  - `updateAssetAlert(alertId, alertData)` - Atualiza alerta existente
  - `deleteAssetAlert(alertId)` - Remove alerta
  - `stopObservingAsset(userId, ativoId)` - Para de observar ativo

### 4. **Backend - Controller de Alertas**
- **Localização**: `/back_finance/app/Http/Controllers/Api/AlertaAtivosController.php`
- **Endpoints implementados**:
  - `GET /api/v1/user/alertas?user_id={id}` - Lista alertas
  - `POST /api/v1/user/alertas?user_id={id}` - Cria/atualiza alerta
  - `GET /api/v1/user/alertas/{id}` - Busca alerta específico
  - `PUT /api/v1/user/alertas/{id}` - Atualiza alerta
  - `DELETE /api/v1/user/alertas/{id}` - Remove alerta

### 5. **Backend - Model**
- **Localização**: `/back_finance/app/Models/AlertaAtivos.php`
- **Campos**:
  - `user_id` - ID do usuário
  - `ativo_id` - ID do ativo
  - `valor_min` - Valor mínimo (decimal)
  - `valor_max` - Valor máximo (decimal)
  - `notificar_valor_min` - Flag de notificação mínimo (boolean)
  - `notificar_valor_max` - Flag de notificação máximo (boolean)
  - `status` - Status do alerta (ativo/inativo)
  - `frequencia` - Frequência de notificação (todas_as_vezes/diario/semanal)

## 🔧 Filtros Disponíveis

1. **Busca por texto**: Filtra por código ou nome do ativo
2. **Categoria**: Filtra por categoria (Ação, FII, ETF, BDR, Cripto)
3. **Status de Alerta**: 
   - Todos
   - Com alerta configurado
   - Sem alerta

## 📊 Tabela de Ativos

### Colunas:
- **Código**: Código do ativo (ex: PETR4)
- **Nome**: Nome do ativo
- **Categoria**: Badge colorido com a categoria
- **Valor Mínimo**: Valor configurado para alerta mínimo
- **Valor Máximo**: Valor configurado para alerta máximo
- **Status Alerta**: Status do alerta (Ativo/Inativo)
- **Ações**: Botões de editar e parar de observar

### Ações:
1. **Editar Alerta** (ícone lápis): Abre modal para configurar/editar alertas
2. **Parar de Observar** (ícone olho cortado): Remove o ativo da observação

## 🎨 Interface

### Design:
- Minimalista e responsivo
- Cards informativos com resumo
- Badges coloridos por categoria
- Ícones SVG para melhor visualização
- Estados visuais claros (loading, erro, vazio)
- Feedback visual em hover e ações

### Responsividade:
- Desktop: Tabela completa com todas as colunas
- Tablet/Mobile: Tabela com scroll horizontal
- Filtros empilhados em mobile

## 🔐 Segurança

- Todas as rotas protegidas por autenticação (`auth:sanctum`)
- Validação de usuário em todas as requisições
- Verificação de permissões no backend

## 📝 Uso

1. **Acessar a página**: Menu lateral > "Ativos Observados"
2. **Filtrar ativos**: Use os filtros no topo da página
3. **Configurar alerta**: Clique no botão de editar (lápis)
   - Configure valores min/max
   - Ative as notificações desejadas
   - Escolha a frequência
   - Salve o alerta
4. **Parar de observar**: Clique no botão de olho cortado e confirme

## 🚀 Próximos Passos (Opcional)

- Implementar envio de notificações por e-mail/SMS
- Adicionar gráfico de histórico de alertas disparados
- Implementar sistema de jobs para verificação periódica dos valores
- Adicionar notificações em tempo real via WebSocket
- Criar dashboard de alertas ativos

## 📦 Arquivos Criados/Modificados

### Criados:
- `/front_finance/src/views/ObservedAssets.vue`
- `/front_finance/src/components/EditAlertModal.vue`
- `/back_finance/app/Models/AlertaAtivos.php`

### Modificados:
- `/front_finance/src/services/assetService.js`
- `/front_finance/src/router/index.js`
- `/front_finance/src/components/Sidebar.vue`
- `/back_finance/app/Http/Controllers/Api/AlertaAtivosController.php`
- `/back_finance/routes/api.php`

## 🗄️ Banco de Dados

A tabela `alerta_ativos` já existe no banco de dados (migration: `2025_10_12_132839_create_asset_alerts_table.php`)

**Estrutura:**
```sql
CREATE TABLE alerta_ativos (
    id BIGINT PRIMARY KEY,
    user_id BIGINT FOREIGN KEY,
    ativo_id BIGINT FOREIGN KEY,
    valor_min DECIMAL(15,2) NULL,
    valor_max DECIMAL(15,2) NULL,
    notificar_valor_min BOOLEAN DEFAULT false,
    notificar_valor_max BOOLEAN DEFAULT false,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    frequencia ENUM('todas_as_vezes', 'diario', 'semanal') DEFAULT 'todas_as_vezes',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```
