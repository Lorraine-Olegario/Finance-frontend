<template>
  <div
    class="search-bar"
    :class="{ 'search-bar--focused': isFocused }"
  >
    <span class="search-bar__icon">
      <SvgIcon
        name="search"
        size="16"
      />
    </span>

    <input
      :value="modelValue"
      type="search"
      class="search-bar__input"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown.enter="emit('search', modelValue)"
    />

    <button
      v-if="modelValue"
      class="search-bar__clear"
      type="button"
      aria-label="Limpar busca"
      @click="clearSearch"
    >
      <SvgIcon
        name="close"
        size="14"
        :stroke-width="2.5"
      />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar...' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'search'])

const isFocused = ref(false)

function clearSearch() {
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
