<template>
  <input
    class="base-input"
    v-bind="$attrs"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    @input="$emit('update:modelValue', $event.target.value)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  />
</template>

<script setup>
defineProps({
  modelValue: { default: '' },
  type: { type: String, default: 'text' }, // text|email|password|number|search|color
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
