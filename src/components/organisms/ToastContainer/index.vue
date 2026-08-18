<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          role="status"
        >
          <SvgIcon
            :name="toast.type === 'success' ? 'check-circle' : 'alert-triangle'"
            :size="18"
            class="toast__icon"
          />
          <span class="toast__message">{{ toast.message }}</span>
          <button
            type="button"
            class="toast__close"
            aria-label="Fechar"
            @click="toastStore.remove(toast.id)"
          >
            <SvgIcon
              name="close"
              :size="14"
            />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
