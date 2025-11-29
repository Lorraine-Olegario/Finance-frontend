<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-dialog modal-dialog-sm">
      <div class="modal-content">
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
              <component :is="iconPath" />
            </svg>
            {{ title }}
          </h3>
          <button type="button" class="btn-close" @click="close" aria-label="Fechar"></button>
        </div>
        
        <div class="modal-body">
          <p>{{ message }}</p>
          <p v-if="warningMessage" class="text-warning">
            <strong>Atenção:</strong> {{ warningMessage }}
          </p>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn"
            :class="`btn-${type}`"
            @click="handleConfirm"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ loading ? loadingText : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
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
  computed: {
    iconPath() {
      const icons = {
        success: 'polygon',
        danger: 'trash',
        warning: 'pause',
        info: 'eye',
        primary: 'check'
      }
      
      const paths = {
        polygon: () => 'polygon points="5 3 19 12 5 21 5 3"',
        trash: () => ['polyline points="3 6 5 6 21 6"', 'path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"'].join(''),
        pause: () => ['rect x="6" y="4" width="4" height="16"', 'rect x="14" y="4" width="4" height="16"'].join(''),
        eye: () => ['path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"', 'circle cx="12" cy="12" r="3"'].join(''),
        check: () => 'polyline points="20 6 9 17 4 12"'
      }
      
      return paths[icons[this.type]] || paths.check
    }
  },
  methods: {
    close() {
      this.loading = false
      this.$emit('close')
    },
    async handleConfirm() {
      this.loading = true
      try {
        await this.$emit('confirm')
        this.close()
      } catch (error) {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-dialog {
  max-width: 500px;
  width: 100%;
  animation: slideDown 0.3s ease;
}

.modal-dialog-sm {
  max-width: 400px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-content {
  background: var(--surface, #fff);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border, #e0e0e0);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary, #212529);
}

.modal-icon {
  width: 20px;
  height: 20px;
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

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-close::before {
  content: "×";
  font-size: 2rem;
  line-height: 1;
  color: var(--text-secondary, #6c757d);
}

.btn-close:hover {
  background-color: var(--background, #f5f5f5);
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
  color: var(--text-primary, #212529);
}

.modal-body p:last-child {
  margin-bottom: 0;
}

.text-warning {
  color: #dc3545;
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid var(--border, #e0e0e0);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary, #6200EE) 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(98, 0, 238, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(98, 0, 238, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #000;
  font-weight: 700;
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
}

.btn-info:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(23, 162, 184, 0.4);
}

.btn-secondary {
  background-color: var(--surface, #f5f5f5);
  color: var(--text-primary, #212529);
  border: 2px solid var(--border, #e0e0e0);
}

.btn-secondary:hover {
  background-color: var(--background, #e0e0e0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
  border-width: 0.2em;
}

.me-2 {
  margin-right: 0.5rem;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

@media (max-width: 576px) {
  .modal-dialog {
    max-width: 100%;
    margin: 0;
  }
  
  .modal-content {
    border-radius: 0;
  }
}
</style>
