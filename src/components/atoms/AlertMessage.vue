<template>
  <div
    class="alert-msg"
    :class="`alert-msg--${type}`"
    role="alert"
  >
    <SvgIcon
      :name="iconMap[type]"
      class="alert-icon"
    />

    <div class="alert-content">
      <h4
        v-if="title"
        class="alert-title"
      >
        {{ title }}
      </h4>
      <p class="alert-text">
        {{ message }}
      </p>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="alert-close"
      aria-label="Fechar"
      @click="$emit('dismiss')"
    >
      <SvgIcon
        name="close"
        :size="16"
      />
    </button>
  </div>
</template>

<script setup>
import SvgIcon from '@/components/atoms/SvgIcon.vue'

defineProps({
  type: {
    type: String,
    default: 'error',
    validator: v => ['error', 'warning', 'success', 'info'].includes(v)
  },
  title: { type: String, default: '' },
  message: { type: String, required: true },
  dismissible: { type: Boolean, default: false }
})

defineEmits(['dismiss'])

const iconMap = {
  error: 'alert-circle',
  warning: 'alert-triangle',
  success: 'check-circle',
  info: 'info'
}
</script>

<style scoped>
.alert-msg {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid;
}

.alert-msg--error {
  background: rgba(176, 0, 32, 0.08);
  border-color: rgba(176, 0, 32, 0.25);
  color: var(--error);
}
.alert-msg--warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: var(--accent-yellow);
}
.alert-msg--success {
  background: rgba(0, 200, 83, 0.1);
  border-color: rgba(0, 200, 83, 0.3);
  color: var(--success);
}
.alert-msg--info {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: var(--accent-blue);
}

.alert-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 1px;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: inherit;
}

.alert-text {
  font-size: 0.9375rem;
  line-height: 1.5;
  margin: 0;
  color: inherit;
}

.alert-close {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  flex-shrink: 0;
  transition: background 0.15s;
  padding: 0;
}

.alert-close:hover {
  background: rgba(0, 0, 0, 0.1);
}
.alert-close svg {
  width: 16px;
  height: 16px;
}
</style>
