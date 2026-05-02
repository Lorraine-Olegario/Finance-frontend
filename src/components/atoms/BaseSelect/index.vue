<template>
  <select
    class="base-select"
    v-bind="$attrs"
    :value="modelValue"
    :disabled="disabled"
    :required="required"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option
      v-if="placeholder"
      value=""
      :disabled="required"
      :selected="modelValue === '' || modelValue == null"
    >
      {{ placeholder }}
    </option>
    <option
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: { default: '' },
  options: { type: Array, default: () => [] }, // [{ value, label }]
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
