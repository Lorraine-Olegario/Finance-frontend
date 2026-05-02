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
    validator: v => ['ativo', 'observando', 'inativo', 'pausado'].includes(v),
  },
})

const STATUS_LABELS = {
  ativo: 'Ativo',
  observando: 'Observando',
  inativo: 'Inativo',
  pausado: 'Pausado'
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
