<template>
  <tr class="asset-row">
    <td>
      <div class="asset-code">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <strong>{{ asset.codigo }}</strong>
      </div>
    </td>
    <td>
      <span class="asset-name">{{ asset.nome || 'N/A' }}</span>
    </td>
    <td>
      <span class="badge" :style="getCategoryStyle(asset.categoria)">
        {{ asset.categoria || 'N/A' }}
      </span>
    </td>
    <td class="text-center">
      <div v-if="asset.currentPrice !== null && asset.currentPrice !== undefined" class="current-price">
        <span class="price-value">R$ {{ formatPrice(asset.currentPrice) }}</span>
      </div>
      <span v-else class="text-muted">-</span>
    </td>
    <td class="text-center">
      <span v-if="asset.alert && asset.alert.valor_min" class="price">
        R$ {{ formatPrice(asset.alert.valor_min) }}
      </span>
      <span v-else class="text-muted">-</span>
    </td>
    <td class="text-center">
      <span v-if="asset.alert && asset.alert.valor_max" class="price">
        R$ {{ formatPrice(asset.alert.valor_max) }}
      </span>
      <span v-else class="text-muted">-</span>
    </td>
    <td class="text-center">
      <span v-if="asset.alert" :class="['status-badge', asset.alert.status]">
        {{ asset.alert.status === 'ativo' ? 'Ativo' : 'Inativo' }}
      </span>
      <span v-else class="text-muted">Sem alerta</span>
    </td>
    <td class="text-center">
      <div class="action-buttons">
        <button @click="$emit('edit', asset)" class="action-btn edit-btn" :title="asset.alert ? 'Editar alerta' : 'Configurar alerta'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
        <button @click="$emit('stop', asset)" class="action-btn delete-btn" title="Parar de observar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <path d="m1 1 22 22"></path>
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'AssetRow',
  props: {
    asset: { type: Object, required: true }
  },
  emits: ['edit', 'stop'],
  methods: {
    formatPrice(value) {
      if (!value) return '0,00'
      return parseFloat(value).toFixed(2).replace('.', ',')
    },
    getCategoryStyle(categoria) {
      const colors = {
        'Ação': '#3b82f6',
        'FII': '#10b981',
        'ETF': '#f59e0b',
        'BDR': '#8b5cf6',
        'Cripto': '#ec4899'
      }
      const color = colors[categoria] || '#6b7280'
      return { backgroundColor: color, color: 'white' }
    }
  }
}
</script>

<style scoped>
.asset-row {
  transition: background-color 0.2s;
}

.asset-row:hover {
  background-color: var(--bg-hover);
}

.asset-code {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-code .icon {
  width: 18px;
  height: 18px;
  color: var(--primary);
  flex-shrink: 0;
}

.asset-name {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.current-price {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.price-value {
  font-weight: 600;
  color: var(--text-primary);
}

.price {
  font-weight: 500;
  color: var(--text-primary);
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.ativo {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.inativo {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
}

.action-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.edit-btn {
  background: #f59e0b;
  color: white;
}

.edit-btn:hover {
  background: #d97706;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.text-center {
  text-align: center;
}

.text-muted {
  color: var(--text-secondary);
  opacity: 0.7;
}
</style>
