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
import SvgIcon from '@/components/atoms/SvgIcon.vue'

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

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.search-bar--focused {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(98, 0, 238, 0.1);
}

.search-bar__icon {
  display: flex;
  align-items: center;
  padding: 0 0.625rem 0 0.75rem;
  color: var(--text-secondary);
  pointer-events: none;
  flex-shrink: 0;
}

.search-bar--focused .search-bar__icon {
  color: var(--primary);
}

.search-bar__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.5rem 0.25rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  min-width: 0;
}

.search-bar__input::placeholder {
  color: var(--text-secondary);
}

.search-bar__input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.search-bar__input::-webkit-search-cancel-button {
  display: none;
}

.search-bar__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 4px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;
}

.search-bar__clear:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
</style>
