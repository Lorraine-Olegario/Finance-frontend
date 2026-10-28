<template>
  <div class="dividends-filter-bar">
    <BaseSelect
      :model-value="assetCategoryId"
      :options="categoryOptions"
      placeholder="Tipo de ativo"
      aria-label="Tipo de ativo"
      @update:model-value="$emit('update:assetCategoryId', $event)"
    />
    <BaseSelect
      :model-value="assetId"
      :options="assetOptions"
      placeholder="Ativos"
      aria-label="Ativos"
      @update:model-value="$emit('update:assetId', $event)"
    />
    <BaseButton
      v-if="hasFilters"
      variant="secondary"
      size="sm"
      @click="$emit('clear')"
    >
      Limpar filtros
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseSelect from '@/components/atoms/BaseSelect/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'

const props = defineProps({
  assetCategoryId: {
    type: [String, Number],
    default: ''
  },
  assetId: {
    type: [String, Number],
    default: ''
  },
  categories: {
    type: Array,
    default: () => []
  },
  assets: {
    type: Array,
    default: () => []
  },
  hasFilters: {
    type: Boolean,
    default: false
  }
})

defineEmits<{
  'update:assetCategoryId': [value: string]
  'update:assetId': [value: string]
  clear: []
}>()

const categoryOptions = computed(() =>
  props.categories.map(category => ({
    value: category.id,
    label: category.name
  }))
)

const assetOptions = computed(() =>
  props.assets.map(asset => ({
    value: asset.asset_id,
    label: asset.code
  }))
)
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
