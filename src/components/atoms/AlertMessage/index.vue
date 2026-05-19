<template>
  <div
    class="alert-msg"
    :class="`alert-msg--${type}`"
    role="alert"
  >
    <SvgIcon
      :name="iconMap[type]"
      class="alert-msg__icon"
    />

    <div class="alert-msg__content">
      <h4
        v-if="title"
        class="alert-msg__title"
      >
        {{ title }}
      </h4>
      <p class="alert-msg__text">
        {{ message }}
      </p>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="alert-msg__close"
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

<script setup lang="ts">
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

defineProps({
  type: {
    type: String,
    default: 'error',
    validator: (v: string) => ['error', 'warning', 'success', 'info'].includes(v),
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
})

defineEmits<{
  dismiss: []
}>()

const iconMap = {
  error: 'alert-circle',
  warning: 'alert-triangle',
  success: 'check-circle',
  info: 'info'
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
