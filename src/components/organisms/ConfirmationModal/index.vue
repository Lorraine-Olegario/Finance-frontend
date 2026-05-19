<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click.self="close"
      >
        <div :class="['modal-container', `modal-container--${size}`]">
          <div class="modal-dialog">
            <div class="modal-header">
              <h3 class="modal-header__title">
                <SvgIcon
                  :name="typeIcon"
                  :size="24"
                  class="modal-header__icon"
                  :class="`modal-header__icon--${type}`"
                />
                {{ title }}
              </h3>
              <button
                type="button"
                class="modal-header__close"
                aria-label="Fechar"
                @click="close"
              >
                <SvgIcon
                  name="close"
                  :size="20"
                />
              </button>
            </div>

            <div class="modal-body">
              <p
                v-if="message"
                class="modal-body__message"
              >
                {{ message }}
              </p>
              <p
                v-if="warningMessage"
                class="modal-body__warning"
              >
                <strong>⚠️ Atenção:</strong>
                {{ warningMessage }}
              </p>
              <slot />
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button
                  type="button"
                  class="modal-footer__btn modal-footer__btn--cancel"
                  :disabled="loading"
                  @click="close"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="modal-footer__btn modal-footer__btn--confirm"
                  :class="`modal-footer__btn--${type}`"
                  :disabled="loading"
                  @click="handleConfirm"
                >
                  <span
                    v-if="loading"
                    class="modal-footer__spinner"
                  />
                  {{ loading ? loadingText : confirmText }}
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v: string) => ['small', 'medium', 'large'].includes(v),
  },
  type: {
    type: String,
    default: 'primary',
    validator: (v: string) => ['primary', 'success', 'danger', 'warning', 'info'].includes(v),
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  warningMessage: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: 'Confirmar',
  },
  loadingText: {
    type: String,
    default: 'Processando...',
  },
})

const emit = defineEmits<{
  close: []
  confirm: [handlers: Record<string, unknown>]
}>()

const loading = ref(false)

const TYPE_ICONS = {
  success: 'check-circle',
  danger: 'trash',
  warning: 'alert-triangle',
  info: 'info',
  primary: 'check-circle'
}

const typeIcon = computed(() => TYPE_ICONS[props.type] ?? 'check-circle')

watch(
  () => props.isOpen,
  isOpen => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    if (!isOpen) loading.value = false
  }
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

function close() {
  if (loading.value) return
  emit('close')
}

async function handleConfirm() {
  loading.value = true
  try {
    await new Promise((resolve, reject) => {
      emit('confirm', { resolve, reject })
      setTimeout(resolve, 500)
    })
    await new Promise(r => setTimeout(r, 300))
    loading.value = false
    emit('close')
  } catch (err) {
    console.error('[ConfirmationModal] Erro ao confirmar:', err)
    loading.value = false
    alert(err.message || 'Erro ao processar a ação. Tente novamente.')
  }
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
