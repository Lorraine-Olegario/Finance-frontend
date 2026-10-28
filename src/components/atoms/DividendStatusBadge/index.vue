<template>
  <span :class="['dividend-status-badge', `dividend-status-badge--${status}`]">
    {{ status === 'paid' ? 'Pago' : 'A receber' }}
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
    validator: value => ['paid', 'pending'].includes(value)
  }
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
