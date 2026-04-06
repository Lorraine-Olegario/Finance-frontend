<template>
  <MainLayout page-title="Meu Perfil">
    <div class="user-profile-page">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e segurança da conta"
      />

      <!-- User Banner -->
      <div class="user-profile-page__banner">
        <div class="user-profile-page__avatar">
          {{ userInitials }}
        </div>
        <div class="user-profile-page__banner-info">
          <h2 class="user-profile-page__banner-name">
            {{ authStore.user?.name }}
          </h2>
          <p class="user-profile-page__banner-email">
            {{ authStore.user?.email }}
          </p>
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="user-profile-page__grid">
        <!-- Personal Info Card -->
        <div class="user-profile-page__card">
          <div class="user-profile-page__card-header">
            <SvgIcon
              name="user"
              :size="22"
              class="user-profile-page__card-icon"
            />
            <h3 class="user-profile-page__card-title">Informações Pessoais</h3>
          </div>

          <form
            class="user-profile-page__form"
            @submit.prevent="updateProfile"
          >
            <div class="user-profile-page__field">
              <label
                for="profile-name"
                class="user-profile-page__label"
              >
                Nome Completo
              </label>
              <BaseInput
                id="profile-name"
                v-model="profileForm.name"
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div class="user-profile-page__field">
              <label
                for="profile-email"
                class="user-profile-page__label"
              >
                E-mail
              </label>
              <BaseInput
                id="profile-email"
                v-model="profileForm.email"
                type="email"
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <AlertMessage
              v-if="profileError"
              type="error"
              :message="profileError"
              :dismissible="true"
              class="user-profile-page__alert"
              @dismiss="profileError = ''"
            />

            <AlertMessage
              v-if="profileSuccess"
              type="success"
              :message="profileSuccess"
              :dismissible="true"
              class="user-profile-page__alert"
              @dismiss="profileSuccess = ''"
            />

            <div class="user-profile-page__form-actions">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="savingProfile"
              >
                <template #icon-left>
                  <SvgIcon
                    name="check-circle"
                    :size="16"
                  />
                </template>
                Salvar Alterações
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Change Password Card -->
        <div class="user-profile-page__card">
          <div class="user-profile-page__card-header">
            <SvgIcon
              name="settings"
              :size="22"
              class="user-profile-page__card-icon"
            />
            <h3 class="user-profile-page__card-title">Alterar Senha</h3>
          </div>

          <form
            class="user-profile-page__form"
            @submit.prevent="updatePassword"
          >
            <div class="user-profile-page__field">
              <label
                for="current-password"
                class="user-profile-page__label"
              >
                Senha Atual
              </label>
              <div class="user-profile-page__password-wrap">
                <BaseInput
                  id="current-password"
                  v-model="passwordForm.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  placeholder="Digite sua senha atual"
                  required
                />
                <button
                  type="button"
                  class="user-profile-page__pw-toggle"
                  :aria-label="
                    showCurrentPassword ? 'Ocultar senha' : 'Mostrar senha'
                  "
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <SvgIcon
                    :name="showCurrentPassword ? 'eye-off' : 'eye'"
                    :size="18"
                  />
                </button>
              </div>
            </div>

            <div class="user-profile-page__field">
              <label
                for="new-password"
                class="user-profile-page__label"
              >
                Nova Senha
              </label>
              <div class="user-profile-page__password-wrap">
                <BaseInput
                  id="new-password"
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button
                  type="button"
                  class="user-profile-page__pw-toggle"
                  :aria-label="
                    showNewPassword ? 'Ocultar senha' : 'Mostrar senha'
                  "
                  @click="showNewPassword = !showNewPassword"
                >
                  <SvgIcon
                    :name="showNewPassword ? 'eye-off' : 'eye'"
                    :size="18"
                  />
                </button>
              </div>
            </div>

            <div class="user-profile-page__field">
              <label
                for="confirm-password"
                class="user-profile-page__label"
              >
                Confirmar Nova Senha
              </label>
              <div class="user-profile-page__password-wrap">
                <BaseInput
                  id="confirm-password"
                  v-model="passwordForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Repita a nova senha"
                  required
                />
                <button
                  type="button"
                  class="user-profile-page__pw-toggle"
                  :aria-label="
                    showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'
                  "
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <SvgIcon
                    :name="showConfirmPassword ? 'eye-off' : 'eye'"
                    :size="18"
                  />
                </button>
              </div>
            </div>

            <AlertMessage
              v-if="passwordError"
              type="error"
              :message="passwordError"
              :dismissible="true"
              class="user-profile-page__alert"
              @dismiss="passwordError = ''"
            />

            <AlertMessage
              v-if="passwordSuccess"
              type="success"
              :message="passwordSuccess"
              :dismissible="true"
              class="user-profile-page__alert"
              @dismiss="passwordSuccess = ''"
            />

            <div class="user-profile-page__form-actions">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="savingPassword"
              >
                <template #icon-left>
                  <SvgIcon
                    name="settings"
                    :size="16"
                  />
                </template>
                Alterar Senha
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MainLayout from '@/components/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import AlertMessage from '@/components/atoms/AlertMessage.vue'
import SvgIcon from '@/components/atoms/SvgIcon.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()

const profileForm = ref({ name: '', email: '' })
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const savingProfile = ref(false)
const savingPassword = ref(false)
const profileError = ref('')
const profileSuccess = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const userInitials = computed(() => {
  if (!authStore.user?.name) return '?'
  return authStore.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

function loadUserData() {
  if (authStore.user) {
    profileForm.value.name = authStore.user.name
    profileForm.value.email = authStore.user.email
  }
}

async function updateProfile() {
  profileError.value = ''
  profileSuccess.value = ''
  savingProfile.value = true
  try {
    const response = await api.put('/user/profile', {
      name: profileForm.value.name,
      email: profileForm.value.email
    })
    authStore.user = response.data.user
    profileSuccess.value = 'Perfil atualizado com sucesso!'
    setTimeout(() => {
      profileSuccess.value = ''
    }, 3000)
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err)
    profileError.value =
      err.response?.data?.message ?? 'Erro ao atualizar perfil'
  } finally {
    savingProfile.value = false
  }
}

async function updatePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'As senhas não coincidem'
    return
  }
  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'A senha deve ter no mínimo 8 caracteres'
    return
  }

  savingPassword.value = true
  try {
    await api.put('/user/password', {
      current_password: passwordForm.value.currentPassword,
      new_password: passwordForm.value.newPassword,
      new_password_confirmation: passwordForm.value.confirmPassword
    })
    passwordSuccess.value = 'Senha alterada com sucesso!'
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    setTimeout(() => {
      passwordSuccess.value = ''
    }, 3000)
  } catch (err) {
    console.error('Erro ao alterar senha:', err)
    passwordError.value = err.response?.data?.message ?? 'Erro ao alterar senha'
  } finally {
    savingPassword.value = false
  }
}

onMounted(loadUserData)
</script>

<style scoped>
.user-profile-page {
  max-width: 1100px;
  margin: 0 auto;
}

/* Banner */
.user-profile-page__banner {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: linear-gradient(135deg, var(--primary), #7c3aed);
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 16px rgba(98, 0, 238, 0.2);
}

.user-profile-page__avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.35);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-profile-page__banner-name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.user-profile-page__banner-email {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
}

/* Grid */
.user-profile-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

/* Cards */
.user-profile-page__card {
  background: var(--bg-primary);
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.user-profile-page__card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
}

.user-profile-page__card-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.user-profile-page__card-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Forms */
.user-profile-page__form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.user-profile-page__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.user-profile-page__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* Password field with visibility toggle */
.user-profile-page__password-wrap {
  position: relative;
}

.user-profile-page__password-wrap :deep(.base-input) {
  padding-right: 2.75rem;
}

.user-profile-page__pw-toggle {
  position: absolute;
  right: 0.625rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
  line-height: 0;
}

.user-profile-page__pw-toggle:hover {
  color: var(--primary);
}

/* Alert */
.user-profile-page__alert {
  margin-top: 0.25rem;
}

/* Form actions */
.user-profile-page__form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .user-profile-page__grid {
    grid-template-columns: 1fr;
  }

  .user-profile-page__banner {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .user-profile-page__avatar {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}
</style>
