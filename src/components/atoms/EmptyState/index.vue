<template>
  <div class="empty-state">
    <div class="empty-state__icon-wrapper">
      <slot name="icon">
        <SvgIcon
          name="info"
          :size="64"
          class="empty-state__icon"
        />
      </slot>
    </div>
    <h3 class="empty-state__title">
      {{ title }}
    </h3>
    <p class="empty-state__description">
      {{ description }}
    </p>
    <div
      v-if="$slots.action"
      class="empty-state__action"
    >
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true }
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
