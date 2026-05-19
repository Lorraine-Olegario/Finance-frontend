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
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

const props = defineProps({
  userName: {
    type: String,
    default: 'Usuário',
  },
  date: {
    type: String,
    required: true,
  },
})

const firstName = computed(() => props.userName.split(' ')[0] || 'Usuário')
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
