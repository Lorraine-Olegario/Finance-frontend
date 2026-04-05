<template>
  <span
    class="status-badge"
    :class="`status-badge--${status}`"
  >
    {{ STATUS_LABELS[status] ?? status }}
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
    validator: v => ['ativo', 'observando', 'inativo', 'pausado'].includes(v)
  }
})

const STATUS_LABELS = {
  ativo: 'Ativo',
  observando: 'Observando',
  inativo: 'Inativo',
  pausado: 'Pausado'
}
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
  border: 1px solid transparent;
}

/* Estilos de status — ver docs/style-guide.md §2 */
.status-badge--ativo {
  background: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

.status-badge--observando {
  background: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.status-badge--inativo {
  background: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

.status-badge--pausado {
  background: rgba(245, 158, 11, 0.15);
  color: var(--accent-yellow);
  border-color: rgba(245, 158, 11, 0.3);
}
</style>
