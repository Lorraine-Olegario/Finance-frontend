<template>
  <div class="login-page">
    <div class="login-page__container">
      <div class="login-page__card">
        <div class="login-page__header">
          <h1 class="login-page__title">Finance</h1>
          <p class="login-page__subtitle">Sistema de Gerenciamento de Ativos</p>
        </div>

        <form
          class="login-page__form"
          @submit.prevent="handleLogin"
        >
          <div class="login-page__field">
            <label
              for="email"
              class="login-page__label"
            >
              Email
            </label>
            <BaseInput
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
              :disabled="loading"
            />
          </div>

          <div class="login-page__field">
            <label
              for="password"
              class="login-page__label"
            >
              Senha
            </label>
            <BaseInput
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              :disabled="loading"
            />
          </div>

          <AlertMessage
            v-if="error"
            type="error"
            :message="error"
            class="login-page__alert"
          />

          <BaseButton
            type="submit"
            variant="primary"
            :loading="loading"
            :disabled="loading"
            class="login-page__submit"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import AlertMessage from '@/components/atoms/AlertMessage.vue'

// ── State ─────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

// ── Functions ─────────────────────────────────────────────────────────────────
async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'Erro ao fazer login. Verifique suas credenciais.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  padding: 1rem;
}

.login-page__container {
  width: 100%;
  max-width: 420px;
}

.login-page__card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.login-page__header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-page__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 0.5rem;
}

.login-page__subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.login-page__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-page__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-page__label {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.login-page__alert {
  margin: 0;
}

.login-page__submit {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  justify-content: center;
}
</style>
