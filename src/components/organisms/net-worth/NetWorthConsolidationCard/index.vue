<template>
  <NetWorthCard
    title="Tipo de ativos"
    empty-title="Sem patrimônio para exibir"
    empty-description="Cadastre suas compras para ver a consolidação"
    :loading="loading"
    :error="error"
    :empty="items.length === 0"
    @retry="$emit('retry')"
  >
    <template #actions>
      <SegmentedControl
        :model-value="view"
        :options="VIEW_OPTIONS"
        @update:model-value="$emit('update:view', $event)"
      />
    </template>

    <NetWorthDonutBreakdown :items="items" />
  </NetWorthCard>
</template>

<script setup lang="ts">
import NetWorthCard from '@/components/molecules/NetWorthCard/index.vue'
import SegmentedControl from '@/components/molecules/SegmentedControl/index.vue'
import NetWorthDonutBreakdown from '@/components/organisms/net-worth/NetWorthDonutBreakdown/index.vue'

const VIEW_OPTIONS = [
  { value: 'category', label: 'Tipo de ativos' },
  { value: 'asset', label: 'Ativos' }
]

defineProps({
  view: {
    type: String,
    required: true,
    validator: (v: string) => ['category', 'asset'].includes(v)
  },
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits<{
  retry: []
  'update:view': [view: string]
}>()
</script>
