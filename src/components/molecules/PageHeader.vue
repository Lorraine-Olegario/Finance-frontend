<template>
  <div class="page-header">
    <div class="page-header__content">
      <h1 class="page-header__title">
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="page-header__subtitle"
      >
        {{ subtitle }}
      </p>
    </div>

    <div
      v-if="$slots.actions"
      class="page-header__actions"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.page-header__content {
  flex: 1;
  min-width: 0;
}

.page-header__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.page-header__subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
  line-height: 1.5;
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

@media (max-width: 576px) {
  .page-header {
    flex-direction: column;
  }
  .page-header__actions {
    width: 100%;
  }
}
</style>
