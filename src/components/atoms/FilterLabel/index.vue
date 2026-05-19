<template>
  <div class="filter-label-wrap">
    <label
      :for="forId"
      class="filter-label"
    >
      <span
        v-if="$slots.icon"
        class="filter-label-icon"
      >
        <slot name="icon" />
      </span>
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  forId: {
    type: String,
    default: null,
  },
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
