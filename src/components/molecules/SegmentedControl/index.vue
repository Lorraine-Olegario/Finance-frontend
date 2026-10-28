<template>
  <div
    class="segmented-control"
    role="group"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="[
        'segmented-control__option',
        { 'segmented-control__option--active': option.value === modelValue }
      ]"
      :aria-pressed="option.value === modelValue"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  }
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
