<template>
  <div class="welcome-section">
    <div>
      <h2>Olá, {{ userName }}! 👋</h2>
      <p class="welcome-subtitle">
        Aqui está um resumo da sua carteira de investimentos
      </p>
    </div>
    <div class="date-info">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <span>{{ currentDate }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  userName: { type: String, default: 'Usuário' }
})

const currentDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('pt-BR', options)
})
</script>

<style scoped>
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 16px;
  color: white;
}

.welcome-section h2 {
  margin: 0 0 8px 0;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.welcome-subtitle {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  color: white;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.date-info .icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .welcome-section h2 {
    font-size: 1.5rem;
  }
}
</style>
