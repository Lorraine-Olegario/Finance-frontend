<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card card">
        <div class="login-header">
          <h1>Finance</h1>
          <p>Sistema de Gerenciamento de Ativos</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="formData.email" type="email" required placeholder="seu@email.com" :disabled="loading" />
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input id="password" v-model="formData.password" type="password" required placeholder="••••••••" :disabled="loading" />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            {{ loading ? "Entrando..." : "Entrar" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import { useAuthStore } from "../stores/auth";
  import { useRouter } from "vue-router";

  export default {
    name: "Login",
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();

      return { authStore, router };
    },
    data() {
      return {
        formData: {
          email: "",
          password: "",
        },
        loading: false,
        error: "",
      };
    },
    mounted() {
      // Redirect if already logged in
      if (this.authStore.isAuthenticated) {
        this.router.push("/");
      }
    },
    methods: {
      async handleLogin() {
        this.loading = true;
        this.error = "";

        try {
          await this.authStore.login(this.formData.email, this.formData.password);
          this.router.push("/");
        } catch (err) {
          this.error = err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.";
          console.error("Login error:", err);
        } finally {
          this.loading = false;
        }
      },
    },
  };
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

  .login-container {
    width: 100%;
    max-width: 420px;
  }

  .login-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-header h1 {
    font-size: 2rem;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }

  .login-header p {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .login-form {
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.1);
  }

  .form-group input:disabled {
    background-color: var(--bg-secondary);
    cursor: not-allowed;
  }

  .btn-login {
    width: 100%;
    padding: 0.875rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-login:hover:not(:disabled) {
    background-color: var(--secondary);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(98, 0, 238, 0.3);
  }

  .btn-login:active {
    transform: translateY(0);
  }

  .btn-login:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    color: var(--error);
    background-color: rgba(176, 0, 32, 0.1);
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .login-footer {
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-align: center;
  }

  .login-footer p {
    margin-bottom: 0.5rem;
  }

  .login-footer strong {
    color: var(--primary);
  }
</style>
