<template>
  <div
    class="form-field"
    :class="{ 'form-field--error': !!error }"
  >
    <label
      v-if="label"
      :for="fieldId"
      class="form-field__label"
    >
      <slot name="icon" />
      {{ label }}
      <span
        v-if="required"
        class="form-field__required"
        aria-hidden="true"
      >
        *
      </span>
    </label>

    <slot :field-id="fieldId" />

    <p
      v-if="hint && !error"
      class="form-field__hint"
    >
      {{ hint }}
    </p>
    <p
      v-if="error"
      class="form-field__error"
      role="alert"
    >
      <SvgIcon
        name="alert-circle"
        size="12"
        :stroke-width="2.5"
      />
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

defineProps({
  label: {
    type: String,
    default: '',
  },
  fieldId: {
    type: String,
    default: () => `field-${Math.random().toString(36).slice(2, 7)}`,
  },
  hint: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
