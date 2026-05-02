<template>
  <div class="dashboard-card">
    <div class="dashboard-card__header">
      <span
        v-if="$slots.icon"
        class="dashboard-card__icon"
      >
        <slot name="icon" />
      </span>
      <h3 class="dashboard-card__title">
        {{ title }}
      </h3>
      <div
        v-if="$slots.actions"
        class="dashboard-card__actions"
      >
        <slot name="actions" />
      </div>
    </div>
    <div class="dashboard-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
