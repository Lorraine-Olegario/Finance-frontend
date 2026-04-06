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
import SvgIcon from '@/components/atoms/SvgIcon.vue'

defineProps({
  label: { type: String, default: '' },
  fieldId: {
    type: String,
    default: () => `field-${Math.random().toString(36).slice(2, 7)}`
  },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false }
})
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-field__label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-primary);
}

.form-field__label :deep(svg) {
  width: 14px;
  height: 14px;
  color: var(--primary);
  flex-shrink: 0;
}

.form-field__required {
  color: var(--error);
  margin-left: 1px;
}

.form-field__hint {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.form-field__error {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  color: var(--error);
  margin: 0;
  line-height: 1.4;
}

.form-field--error :deep(input),
.form-field--error :deep(select) {
  border-color: var(--error);
}

.form-field--error :deep(input:focus),
.form-field--error :deep(select:focus) {
  box-shadow: 0 0 0 3px rgba(176, 0, 32, 0.12);
}
</style>
