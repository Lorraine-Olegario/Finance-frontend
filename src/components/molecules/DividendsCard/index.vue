<template>
  <section class="dividends-card">
    <header
      v-if="title || $slots.actions"
      class="dividends-card__header"
    >
      <h2 class="dividends-card__title">
        {{ title }}
      </h2>
      <div
        v-if="$slots.actions"
        class="dividends-card__actions"
      >
        <slot name="actions" />
      </div>
    </header>

    <LoadingSpinner
      v-if="loading"
      message=""
      size="32px"
    />
    <div
      v-else-if="error"
      class="dividends-card__error"
    >
      <AlertMessage
        type="error"
        :message="error"
      />
      <BaseButton
        variant="secondary"
        size="sm"
        @click="$emit('retry')"
      >
        Tentar novamente
      </BaseButton>
    </div>
    <EmptyState
      v-else-if="empty"
      title="Nenhum provento encontrado"
      description="Cadastre suas compras para acompanhar seus proventos."
    />
    <slot v-else />
  </section>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  empty: {
    type: Boolean,
    default: false
  }
})

defineEmits<{
  retry: []
}>()
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
