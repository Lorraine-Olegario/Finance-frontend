<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="filter-drawer"
      @click.self="emit('close')"
    >
      <div class="filter-drawer__panel">
        <div class="filter-drawer__header">
          <h2 class="filter-drawer__title">
            {{ title }}
          </h2>
          <button
            class="filter-drawer__close"
            type="button"
            :aria-label="`Fechar ${title}`"
            @click="emit('close')"
          >
            <SvgIcon
              name="close"
              :size="18"
            />
          </button>
        </div>

        <div class="filter-drawer__content">
          <slot />
        </div>

        <div class="filter-drawer__footer">
          <button
            type="button"
            class="filter-drawer__btn filter-drawer__btn--reset"
            @click="emit('reset')"
          >
            <SvgIcon
              name="refresh"
              :size="16"
            />
            Limpar Filtros
          </button>
          <slot name="footer-extra" />
          <button
            type="button"
            class="filter-drawer__btn filter-drawer__btn--apply"
            @click="emit('apply')"
          >
            <SvgIcon
              name="check-circle"
              :size="16"
            />
            Aplicar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: 'Filtros' }
})

const emit = defineEmits(['close', 'apply', 'reset'])
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
