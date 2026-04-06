<template>
  <ConfirmationModal
    :is-open="isOpen"
    :title="isEdit ? 'Editar Usuário' : 'Novo Usuário'"
    type="primary"
    size="medium"
    @close="handleClose"
  >
    <div class="user-form-modal">
      <AlertMessage
        v-if="validationError"
        type="error"
        :message="validationError"
        class="user-form-modal__alert"
      />
      <AlertMessage
        v-if="error"
        type="error"
        :message="error"
        class="user-form-modal__alert"
      />

      <div class="user-form-modal__grid">
        <div class="user-form-modal__field">
          <label
            for="ufm-name"
            class="user-form-modal__label"
          >
            Nome *
          </label>
          <BaseInput
            id="ufm-name"
            v-model="form.name"
            placeholder="Ex: João Silva"
            required
          />
        </div>

        <div class="user-form-modal__field">
          <label
            for="ufm-email"
            class="user-form-modal__label"
          >
            E-mail *
          </label>
          <BaseInput
            id="ufm-email"
            v-model="form.email"
            type="email"
            placeholder="Ex: joao@exemplo.com"
            required
          />
        </div>

        <template v-if="!isEdit">
          <div class="user-form-modal__field">
            <label
              for="ufm-password"
              class="user-form-modal__label"
            >
              Senha *
            </label>
            <BaseInput
              id="ufm-password"
              v-model="form.password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              required
            />
          </div>

          <div class="user-form-modal__field">
            <label
              for="ufm-password-confirm"
              class="user-form-modal__label"
            >
              Confirmar Senha *
            </label>
            <BaseInput
              id="ufm-password-confirm"
              v-model="form.passwordConfirmation"
              type="password"
              placeholder="Repita a senha"
              required
            />
          </div>
        </template>

        <div class="user-form-modal__field">
          <label
            for="ufm-role"
            class="user-form-modal__label"
          >
            Perfil *
          </label>
          <BaseSelect
            id="ufm-role"
            v-model="form.role"
            :options="ROLE_OPTIONS"
            placeholder="Selecione um perfil"
            required
          />
        </div>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        class="user-form-modal__btn user-form-modal__btn--cancel"
        :disabled="loading"
        @click="handleClose"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="user-form-modal__btn user-form-modal__btn--submit"
        :disabled="loading"
        @click="handleSubmit"
      >
        <span
          v-if="loading"
          class="user-form-modal__spinner"
          aria-hidden="true"
        />
        {{
          loading
            ? isEdit
              ? 'Salvando...'
              : 'Criando...'
            : isEdit
              ? 'Salvar'
              : 'Criar'
        }}
      </button>
    </template>
  </ConfirmationModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseSelect from '@/components/atoms/BaseSelect.vue'
import AlertMessage from '@/components/atoms/AlertMessage.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  user: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

const emit = defineEmits(['close', 'submit'])

const ROLE_OPTIONS = [
  { value: 'user', label: 'Usuário' },
  { value: 'admin', label: 'Administrador' }
]

const defaultForm = () => ({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  role: 'user'
})

const form = ref(defaultForm())
const validationError = ref('')

const isEdit = computed(() => !!props.user)

watch(
  () => props.isOpen,
  open => {
    validationError.value = ''
    if (open) {
      if (props.user) {
        form.value = {
          name: props.user.name ?? '',
          email: props.user.email ?? '',
          password: '',
          passwordConfirmation: '',
          role: props.user.role ?? 'user'
        }
      } else {
        form.value = defaultForm()
      }
    } else {
      form.value = defaultForm()
    }
  }
)

function validate() {
  if (!form.value.name.trim()) {
    validationError.value = 'O nome é obrigatório'
    return false
  }
  if (!form.value.email.trim()) {
    validationError.value = 'O e-mail é obrigatório'
    return false
  }
  if (!isEdit.value) {
    if (!form.value.password) {
      validationError.value = 'A senha é obrigatória'
      return false
    }
    if (form.value.password.length < 8) {
      validationError.value = 'A senha deve ter no mínimo 8 caracteres'
      return false
    }
    if (form.value.password !== form.value.passwordConfirmation) {
      validationError.value = 'As senhas não coincidem'
      return false
    }
  }
  if (!form.value.role) {
    validationError.value = 'O perfil é obrigatório'
    return false
  }
  validationError.value = ''
  return true
}

function handleSubmit() {
  if (!validate()) return
  const payload = {
    name: form.value.name,
    email: form.value.email,
    role: form.value.role
  }
  if (!isEdit.value) {
    payload.password = form.value.password
    payload.password_confirmation = form.value.passwordConfirmation
  }
  emit('submit', payload)
}

function handleClose() {
  if (props.loading) return
  emit('close')
}
</script>

<style scoped>
.user-form-modal {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-form-modal__alert {
  margin-bottom: 0.5rem;
}

.user-form-modal__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.user-form-modal__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.user-form-modal__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* Footer buttons — rendered inside ConfirmationModal's .modal-footer (display:flex) */
.user-form-modal__btn {
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

.user-form-modal__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.user-form-modal__btn--cancel {
  background: var(--surface);
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.user-form-modal__btn--cancel:hover:not(:disabled) {
  background: var(--bg-hover);
}

.user-form-modal__btn--submit {
  background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-form-modal__btn--submit:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(98, 0, 238, 0.4);
  transform: translateY(-2px);
}

.user-form-modal__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ufm-spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes ufm-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
