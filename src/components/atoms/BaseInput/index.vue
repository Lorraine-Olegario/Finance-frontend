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

<script setup lang="ts">
defineProps({
  modelValue: {
    default: '',
  },
  type: {
    type: String,
    default: 'text',
    validator: (v: string) => ['text', 'email', 'password', 'number', 'search', 'color'].includes(v),
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
