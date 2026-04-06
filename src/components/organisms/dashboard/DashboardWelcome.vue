<template>
  <div class="welcome-banner">
    <div class="welcome-banner__content">
      <h2 class="welcome-banner__heading">Olá, {{ firstName }}! 👋</h2>
      <p class="welcome-banner__subtitle">
        Aqui está um resumo da sua carteira de investimentos
      </p>
    </div>
    <div class="welcome-banner__date">
      <SvgIcon
        name="calendar"
        :size="20"
        class="welcome-banner__date-icon"
      />
      <span>{{ date }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SvgIcon from '@/components/atoms/SvgIcon.vue'

const props = defineProps({
  userName: { type: String, default: 'Usuário' },
  date: { type: String, required: true }
})

const firstName = computed(() => props.userName.split(' ')[0] || 'Usuário')
</script>

<style scoped>
.welcome-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 16px;
  color: white;
  gap: 1rem;
}

.welcome-banner__heading {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
}

.welcome-banner__subtitle {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  color: white;
}

.welcome-banner__date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  flex-shrink: 0;
}

.welcome-banner__date-icon {
  flex-shrink: 0;
  color: white;
}

@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }

  .welcome-banner__heading {
    font-size: 1.5rem;
  }

  .welcome-banner__date {
    white-space: normal;
    text-align: center;
  }
}
</style>
