<template>
  <div v-if="isOpen" class="modal fade show d-block" tabindex="-1" @click.self="close">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-header border-bottom">
          <h5 class="modal-title d-flex align-items-center gap-2">
            <svg 
              width="20" 
              height="20"
              :class="`text-${type}`"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2"
            >
              <component :is="iconPath" />
            </svg>
            {{ title }}
          </h5>
          <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
          <p class="mb-3">{{ message }}</p>
          <p v-if="warningMessage" class="text-danger mb-0">
            <strong>Atenção:</strong> {{ warningMessage }}
          </p>
        </div>

        <div class="modal-footer border-top">
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
  <div v-if="isOpen" class="modal-backdrop fade show"></div>
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
/* Minimal custom CSS - using Bootstrap classes */
.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gap-2 {
  gap: 0.5rem;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>
