<template>
  <MainLayout page-title="Meu Perfil">
    <div class="profile-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="user-avatar-large">
            {{ userInitials }}
          </div>
          <div>
            <h2>{{ authStore.user?.name }}</h2>
            <p class="subtitle">
              {{ authStore.user?.email }}
            </p>
          </div>
        </div>
      </div>

      <!-- Profile Forms -->
      <div class="profile-content">
        <!-- Personal Information Card -->
        <div class="profile-card">
          <div class="card-header">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" /> </svg>
            <h3>Informações Pessoais</h3>
          </div>

          <form
            class="profile-form"
            @submit.prevent="handleUpdateProfile"
          >
            <div class="form-group">
              <label for="name">Nome Completo</label>
              <input
                id="name"
                v-model="profileForm.name"
                type="text"
                placeholder="Digite seu nome"
                required
              >
            </div>

            <div class="form-group">
              <label for="email">E-mail</label>
              <input
                id="email"
                v-model="profileForm.email"
                type="email"
                placeholder="Digite seu e-mail"
                required
              >
            </div>

            <div
              v-if="profileError"
              class="error-message"
            >
              {{ profileError }}
            </div>

            <div
              v-if="profileSuccess"
              class="success-message"
            >
              {{ profileSuccess }}
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn-primary"
                :disabled="savingProfile"
              >
                <svg v-if="!savingProfile" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /> <polyline points="17 21 17 13 7 13 7 21" /> <polyline points="7 3 7 8 15 8" /> </svg>
                <span v-if="savingProfile">Salvando...</span>
                <span v-else>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Card -->
        <div class="profile-card">
          <div class="card-header">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /> </svg>
            <h3>Alterar Senha</h3>
          </div>

          <form
            class="profile-form"
            @submit.prevent="handleChangePassword"
          >
            <div class="form-group">
              <label for="current-password">Senha Atual</label>
              <div class="password-input">
                <input
                  id="current-password"
                  v-model="passwordForm.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  placeholder="Digite sua senha atual"
                  required
                >
                <button
                  type="button"
                  class="toggle-password"
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <svg v-if="showCurrentPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <circle cx="12" cy="12" r="3" /> </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <path d="m1 1 22 22" /> </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="new-password">Nova Senha</label>
              <div class="password-input">
                <input
                  id="new-password"
                  v-model="passwordForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="Digite a nova senha"
                  required
                  minlength="8"
                >
                <button
                  type="button"
                  class="toggle-password"
                  @click="showNewPassword = !showNewPassword"
                >
                  <svg v-if="showNewPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <circle cx="12" cy="12" r="3" /> </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <path d="m1 1 22 22" /> </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="confirm-password">Confirmar Nova Senha</label>
              <div class="password-input">
                <input
                  id="confirm-password"
                  v-model="passwordForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirme a nova senha"
                  required
                  minlength="8"
                >
                <button
                  type="button"
                  class="toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <circle cx="12" cy="12" r="3" /> </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <path d="m1 1 22 22" /> </svg>
                </button>
              </div>
            </div>

            <div
              v-if="passwordError"
              class="error-message"
            >
              {{ passwordError }}
            </div>

            <div
              v-if="passwordSuccess"
              class="success-message"
            >
              {{ passwordSuccess }}
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn-primary"
                :disabled="savingPassword"
              >
                <svg v-if="!savingPassword" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /> <path d="M7 11V7a5 5 0 0 1 10 0v4" /> </svg>
                <span v-if="savingPassword">Alterando...</span>
                <span v-else>Alterar Senha</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout.vue'
import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'
import api from '../services/api'

export default {
  name: 'UserProfile',
  components: {
    MainLayout
  },
  setup() {
    const authStore = useAuthStore()
    
    const userInitials = computed(() => {
      if (!authStore.user?.name) return '?'
      return authStore.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    })
    
    return {
      authStore,
      userInitials
    }
  },
  data() {
    return {
      profileForm: {
        name: '',
        email: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      savingProfile: false,
      savingPassword: false,
      profileError: null,
      profileSuccess: null,
      passwordError: null,
      passwordSuccess: null,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    }
  },
  mounted() {
    this.loadUserData()
  },
  methods: {
    loadUserData() {
      if (this.authStore.user) {
        this.profileForm.name = this.authStore.user.name
        this.profileForm.email = this.authStore.user.email
      }
    },
    async handleUpdateProfile() {
      this.profileError = null
      this.profileSuccess = null
      this.savingProfile = true

      try {
        const response = await api.put('/user/profile', {
          name: this.profileForm.name,
          email: this.profileForm.email
        })

        // Update local user data
        this.authStore.user = response.data.user

        this.profileSuccess = 'Perfil atualizado com sucesso!'
        
        setTimeout(() => {
          this.profileSuccess = null
        }, 3000)
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        this.profileError = error.response?.data?.message || 'Erro ao atualizar perfil'
      } finally {
        this.savingProfile = false
      }
    },
    async handleChangePassword() {
      this.passwordError = null
      this.passwordSuccess = null

      // Validate passwords match
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordError = 'As senhas não coincidem'
        return
      }

      // Validate password length
      if (this.passwordForm.newPassword.length < 8) {
        this.passwordError = 'A senha deve ter no mínimo 8 caracteres'
        return
      }

      this.savingPassword = true

      try {
        await api.put('/user/password', {
          current_password: this.passwordForm.currentPassword,
          new_password: this.passwordForm.newPassword,
          new_password_confirmation: this.passwordForm.confirmPassword
        })

        this.passwordSuccess = 'Senha alterada com sucesso!'
        
        // Clear form
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }

        setTimeout(() => {
          this.passwordSuccess = null
        }, 3000)
      } catch (error) {
        console.error('Erro ao alterar senha:', error)
        this.passwordError = error.response?.data?.message || 'Erro ao alterar senha'
      } finally {
        this.savingPassword = false
      }
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== PAGE HEADER ===== */
.page-header {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 2rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.page-header h2 {
  margin: 0;
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
}

.page-header .subtitle {
  margin: 4px 0 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

/* ===== PROFILE CONTENT ===== */
.profile-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.profile-card {
  background: var(--surface);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.card-header .icon {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* ===== FORMS ===== */
.profile-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.95rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 48px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.toggle-password:hover {
  color: var(--primary);
}

.toggle-password svg {
  width: 20px;
  height: 20px;
}

.error-message {
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.success-message {
  padding: 12px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  color: #059669;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary .icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .page-header {
    padding: 24px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .user-avatar-large {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }
}
</style>
