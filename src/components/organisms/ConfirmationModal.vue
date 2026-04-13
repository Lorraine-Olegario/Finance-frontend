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

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import SvgIcon from '@/components/atoms/SvgIcon.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  size: {
    type: String,
    default: 'medium',
    validator: v => ['small', 'medium', 'large'].includes(v)
  },
  type: {
    type: String,
    default: 'primary',
    validator: v =>
      ['primary', 'success', 'danger', 'warning', 'info'].includes(v)
  },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  warningMessage: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirmar' },
  loadingText: { type: String, default: 'Processando...' }
})

const emit = defineEmits(['close', 'confirm'])

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

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9999;
  overflow-y: auto;
  pointer-events: auto;
}

.modal-container {
  width: 100%;
  max-width: 600px;
  margin: auto;
  pointer-events: auto;
}

.modal-container--small {
  max-width: 420px;
}

.modal-container--medium {
  max-width: 600px;
}

.modal-container--large {
  max-width: 900px;
}

.modal-dialog {
  background: var(--surface);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  z-index: 10000;
  pointer-events: auto;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
}

.modal-header__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-header__icon--success {
  color: var(--success);
}

.modal-header__icon--danger {
  color: var(--danger);
}

.modal-header__icon--warning {
  color: var(--accent-yellow);
}

.modal-header__icon--info {
  color: var(--accent-blue);
}

.modal-header__icon--primary {
  color: var(--primary);
}

.modal-header__close {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s;
  padding: 0;
  flex-shrink: 0;
}

.modal-header__close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

/* Body */
.modal-body {
  padding: 1.5rem;
}

.modal-body__message {
  margin: 0 0 1rem;
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.5;
}

.modal-body__warning {
  margin: 0;
  padding: 1rem;
  background: #fff3cd;
  border: 1px solid var(--accent-yellow);
  border-radius: 8px;
  color: #856404;
  font-size: 0.9rem;
}

.modal-body__warning strong {
  display: block;
  margin-bottom: 0.25rem;
}

/* Footer */
.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--bg-secondary);
}

.modal-footer__btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.modal-footer__btn--cancel {
  background: var(--surface);
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.modal-footer__btn--cancel:hover:not(:disabled) {
  background: var(--bg-hover);
}

.modal-footer__btn--confirm {
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-footer__btn--primary {
  background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
}

.modal-footer__btn--primary:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(98, 0, 238, 0.4);
  transform: translateY(-2px);
}

.modal-footer__btn--success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.modal-footer__btn--success:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  transform: translateY(-2px);
}

.modal-footer__btn--danger {
  background: linear-gradient(135deg, var(--danger) 0%, #c82333 100%);
}

.modal-footer__btn--danger:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
  transform: translateY(-2px);
}

.modal-footer__btn--warning {
  background: linear-gradient(135deg, var(--accent-yellow) 0%, #e0a800 100%);
}

.modal-footer__btn--warning:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  transform: translateY(-2px);
}

.modal-footer__btn--info {
  background: linear-gradient(
    135deg,
    var(--accent-blue) 0%,
    var(--accent-blue-dark) 100%
  );
}

.modal-footer__btn--info:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.modal-footer__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.modal-footer__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: modal-spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes modal-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  transform: scale(0.9) translateY(-20px);
}

@media (max-width: 576px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .modal-header__title {
    font-size: 1.1rem;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>
