<template>
  <div
    class="loading-spinner"
    :class="{ 'loading-spinner--fullscreen': fullscreen }"
  >
    <div
      class="loading-spinner__spinner"
      :style="{ width: size, height: size }"
    />
    <p
      v-if="message"
      class="loading-spinner__message"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Carregando...',
  },
  size: {
    type: String,
    default: '48px',
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
