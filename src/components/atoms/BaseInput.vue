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

<style scoped>
.base-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.875rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  outline: none;
}

.base-input::placeholder {
  color: var(--text-secondary);
}

.base-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.08);
  background: var(--bg-primary);
}

.base-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-input[readonly] {
  background: var(--bg-hover);
  color: var(--text-secondary);
  cursor: default;
}
</style>
