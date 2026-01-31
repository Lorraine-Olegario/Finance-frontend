<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click.self="close"
      >
        <div class="modal-container">
          <div class="modal-dialog">
            <div class="modal-header">
              <h3 class="modal-title">
                <svg
                  class="modal-icon"
                  :class="`icon-${type}`"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    v-if="type === 'success'"
                    d="M5 3 L19 12 L5 21 Z"
                  />
                  <g v-else-if="type === 'danger'">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </g>
                  <g v-else-if="type === 'warning'">
                    <rect
                      x="6"
                      y="4"
                      width="4"
                      height="16"
                    />
                    <rect
                      x="14"
                      y="4"
                      width="4"
                      height="16"
                    />
                  </g>
                  <g v-else-if="type === 'info'">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                    />
                  </g>
                  <polyline
                    v-else
                    points="20 6 9 17 4 12"
                  />
                </svg>
                {{ title }}
              </h3>
              <button
                type="button"
                class="modal-close"
                aria-label="Close"
                @click="close"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                  />
                </svg>
              </button>
            </div>

            <div class="modal-body">
              <p class="modal-message">
                {{ message }}
              </p>
              <p
                v-if="warningMessage"
                class="modal-warning"
              >
                <strong>⚠️ Atenção:</strong> {{ warningMessage }}
              </p>
              <!-- Slot para conteúdo customizado (formulários, inputs, etc.) -->
              <slot />
            </div>

            <!-- Se for fornecido um slot footer, renderiza-o; caso contrário usa os botões padrão -->
            <div class="modal-footer">
              <slot name="footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  :disabled="loading"
                  @click="close"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="btn btn-confirm"
                  :class="`btn-${type}`"
                  :disabled="loading"
                  @click="handleConfirm"
                >
                  <span
                    v-if="loading"
                    class="spinner"
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

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'danger', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    warningMessage: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    loadingText: {
      type: String,
      default: 'Processando...'
    }
  },
  emits: ['close', 'confirm'],
  data() {
    return {
      loading: false
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
        this.loading = false
      }
    }
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  },
  methods: {
    close() {
      if (this.loading) return
      this.loading = false
      this.$emit('close')
    },
    async handleConfirm() {
      this.loading = true

      try {
        // Cria uma promise que será resolvida quando o handler do pai completar
        await new Promise((resolve, reject) => {
          // Emite o evento com callbacks
          this.$emit('confirm', { resolve, reject })

          // Fallback: se não receber resposta em 5 segundos, resolve automaticamente
          setTimeout(() => {
            resolve()
          }, 5000)
        })

        // Aguarda um pequeno delay para feedback visual
        await new Promise(resolve => setTimeout(resolve, 300))

        // Fecha o modal após sucesso
        this.loading = false
        this.$emit('close')
      } catch (error) {
        console.error('Erro ao confirmar ação:', error)
        this.loading = false
        alert(error.message || 'Erro ao processar a ação. Tente novamente.')
      }
    }
  }
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

/* Modal Container */
.modal-container {
  width: 100%;
  max-width: 480px;
  margin: auto;
  pointer-events: auto;
}

.modal-dialog {
  background: var(--surface, #ffffff);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid var(--border, #e0e0e0);
  pointer-events: auto;
  position: relative;
  z-index: 10000;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border, #e0e0e0);
  background: var(--background, #f8f9fa);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary, #1a1a1a);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.icon-success {
  color: #28a745;
}

.icon-danger {
  color: #dc3545;
}

.icon-warning {
  color: #ffc107;
}

.icon-info {
  color: #17a2b8;
}

.icon-primary {
  color: var(--primary, #6200EE);
}

.modal-close {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #666);
  transition: all 0.2s;
  padding: 0;
}

.modal-close:hover {
  background: var(--background, #f0f0f0);
  color: var(--text-primary, #1a1a1a);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

/* Modal Body */
.modal-body {
  padding: 1.5rem;
}

.modal-message {
  margin: 0 0 1rem 0;
  color: var(--text-primary, #1a1a1a);
  font-size: 1rem;
  line-height: 1.5;
}

.modal-warning {
  margin: 0;
  padding: 1rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  font-size: 0.9rem;
}

.modal-warning strong {
  display: block;
  margin-bottom: 0.25rem;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border, #e0e0e0);
  background: var(--background, #f8f9fa);
}

/* Buttons */
.btn {
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

.btn-secondary {
  background: var(--surface, #ffffff);
  color: var(--text-primary, #1a1a1a);
  border: 2px solid var(--border, #e0e0e0);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--background, #f0f0f0);
  border-color: var(--text-secondary, #666);
  transform: translateY(-2px);
}

.btn-confirm {
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
}

.btn-info:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(23, 162, 184, 0.4);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary, #6200EE) 0%, #7c3aed 100%);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(98, 0, 238, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal Transitions */
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

/* Responsive */
@media (max-width: 576px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>

