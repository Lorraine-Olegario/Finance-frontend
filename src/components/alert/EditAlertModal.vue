<template>
  <ConfirmationModal
    :is-open="true"
    size="large"
    type="primary"
    :title="`Configurar Alerta - ${asset.codigo}`"
    :message="''"
    warning-message=""
    confirm-text="Salvar Alerta"
    loading-text="Salvando..."
    @close="$emit('close')"
  >
    <template #default>
      <div v-if="error" class="error-message" role="alert">
        {{ error }}
      </div>
      <div class="asset-info">
        <div class="info-item">
          <span class="label">Código:</span>
          <span class="value">{{ asset.codigo }}</span>
        </div>
        <div v-if="asset.currentPrice" class="info-item">
          <span class="label">Valor Atual:</span>
          <span class="value current-value">R$ {{ formatPrice(asset.currentPrice) }}</span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="valor_min">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Valor Mínimo (R$)
          </label>
          <input id="valor_min" v-model.number="formData.valor_min" type="number" step="0.01" min="0" placeholder="Ex: 10.50" />
          <small class="help-text">Você será notificado quando o valor cair abaixo deste limite</small>
        </div>

        <div class="form-group">
          <label for="valor_max">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
            Valor Máximo (R$)
          </label>
          <input id="valor_max" v-model.number="formData.valor_max" type="number" step="0.01" min="0" placeholder="Ex: 50.00" />
          <small class="help-text">Você será notificado quando o valor ultrapassar este limite</small>
        </div>

        <div class="checkbox-group">
          <label class="checkbox-label">
            <input v-model="formData.notificar_valor_min" type="checkbox" />
            <span>Notificar ao atingir valor mínimo</span>
          </label>
        </div>

        <div class="checkbox-group">
          <label class="checkbox-label">
            <input v-model="formData.notificar_valor_max" type="checkbox" />
            <span>Notificar ao atingir valor máximo</span>
          </label>
        </div>

        <div class="form-group">
          <label for="frequencia">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Frequência de Notificação
          </label>
          <select id="frequencia" v-model="formData.frequencia">
            <option value="todas_as_vezes">Todas as vezes</option>
            <option value="diario">Diário</option>
            <option value="semanal">Semanal</option>
          </select>
        </div>

        <div class="form-group">
          <label for="status">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg>
            Status do Alerta
          </label>
          <select id="status" v-model="formData.status">
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </form>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
      <button type="button" class="btn btn-primary" :disabled="saving" @click="handleSubmit">
        <svg v-if="!saving" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        {{ saving ? "Salvando..." : "Salvar Alerta" }}
      </button>
    </template>
  </ConfirmationModal>
</template>

<script>
  import ConfirmationModal from "../my-assets/ConfirmationModal.vue";

  export default {
    components: { ConfirmationModal },
    name: "EditAlertModal",
    emits: ["close", "save"],
    props: {
      asset: {
        type: Object,
        required: true,
      },
      alert: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        saving: false,
        error: "",
        formData: {
          valor_min: null,
          valor_max: null,
          notificar_valor_min: false,
          notificar_valor_max: false,
          frequencia: "todas_as_vezes",
          status: "ativo",
        },
      };
    },
    mounted() {
      // Populate form with existing alert data if available
      if (this.alert) {
        this.formData = {
          valor_min: this.alert.valor_min,
          valor_max: this.alert.valor_max,
          notificar_valor_min: this.alert.notificar_valor_min || false,
          notificar_valor_max: this.alert.notificar_valor_max || false,
          frequencia: this.alert.frequencia || "todas_as_vezes",
          status: this.alert.status || "ativo",
        };
      }
    },
    methods: {
      handleSubmit() {
        this.error = "";

        if (!this.formData.valor_min && !this.formData.valor_max) {
          this.error = "Por favor, configure pelo menos um valor (mínimo ou máximo).";
          return;
        }

        if (this.formData.valor_min && !this.formData.notificar_valor_min) {
          this.error = "Valor mínimo definido, ative a notificação para receber alertas.";
          return;
        }

        if (this.formData.valor_max && !this.formData.notificar_valor_max) {
          this.error = "Valor máximo definido, ative a notificação para receber alertas.";
          return;
        }

        this.$emit("save", {
          ativo_id: this.asset.id,
          ...this.formData,
        });
      },
      formatPrice(value) {
        if (!value) return "0,00";
        return parseFloat(value).toFixed(2).replace(".", ",");
      },
    },
  };
</script>

<style scoped>
  .error-message {
    color: #842029;
    background: #f8d7da;
    border: 1px solid #f5c2c7;
    padding: 10px 12px;
    border-radius: 8px;
    margin-bottom: 12px;
    font-weight: 500;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: var(--bg-primary);
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
  }

  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .modal-header .icon {
    width: 24px;
    height: 24px;
    color: var(--accent-yellow);
  }

  .close-btn {
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  .close-btn svg {
    width: 20px;
    height: 20px;
  }

  .modal-body {
    padding: 24px;
  }

  .asset-info {
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .info-item .label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .info-item .value {
    color: var(--text-primary);
    font-weight: 500;
  }

  .info-item .current-value {
    color: var(--accent-blue);
    font-weight: 600;
    font-size: 1.1rem;
  }

  .badge {
    background: var(--accent-blue);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.875rem;
  }

  .form-group label .icon {
    width: 18px;
    height: 18px;
    color: var(--accent-blue);
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--accent-blue);
    background: var(--bg-primary);
  }

  .help-text {
    display: block;
    margin-top: 6px;
    color: var(--text-secondary);
    font-size: 0.75rem;
  }

  .checkbox-group {
    margin-bottom: 16px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 12px;
    background: var(--bg-secondary);
    border-radius: 8px;
    transition: all 0.2s;
  }

  .checkbox-label:hover {
    background: var(--bg-hover);
  }

  .checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--accent-blue);
  }

  .checkbox-label span {
    color: var(--text-primary);
    font-size: 0.875rem;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--border-color);
  }

  .btn {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .btn .icon {
    width: 18px;
    height: 18px;
  }

  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  .btn-secondary:hover {
    background: var(--bg-hover);
  }

  .btn-primary {
    background: var(--accent-blue);
    color: white;
  }

  .btn-primary:hover {
    background: var(--accent-blue-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 640px) {
    .modal-content {
      max-width: 100%;
      max-height: 100vh;
      border-radius: 0;
    }

    .modal-header {
      padding: 16px;
    }

    .modal-body {
      padding: 16px;
    }

    .asset-info {
      flex-direction: column;
      gap: 12px;
    }

    .modal-actions {
      flex-direction: column-reverse;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
