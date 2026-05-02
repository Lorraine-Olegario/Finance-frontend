<template>
  <div
    v-if="lastPage > 1 || showTotal"
    class="pagination"
  >
    <div
      v-if="showTotal"
      class="pagination__total"
    >
      <slot
        name="totalLabel"
        :total="total"
      >
        Total:
        <strong>{{ total }}</strong>
      </slot>
    </div>

    <div
      v-if="lastPage > 1"
      class="pagination__controls"
    >
      <button
        class="pagination__btn"
        :disabled="currentPage <= 1"
        aria-label="Página anterior"
        @click="emit('page-change', currentPage - 1)"
      >
        <SvgIcon
          name="chevron-left"
          :size="16"
          :stroke-width="2.5"
        />
      </button>

      <template
        v-for="(page, i) in visiblePages"
        :key="`${page}-${i}`"
      >
        <button
          v-if="page !== '...'"
          class="pagination__page"
          :class="{ 'pagination__page--active': page === currentPage }"
          @click="emit('page-change', page)"
        >
          {{ page }}
        </button>
        <span
          v-else
          class="pagination__page pagination__page--ellipsis"
        >
          …
        </span>
      </template>

      <button
        class="pagination__btn"
        :disabled="currentPage >= lastPage"
        aria-label="Próxima página"
        @click="emit('page-change', currentPage + 1)"
      >
        <SvgIcon
          name="chevron-right"
          :size="16"
          :stroke-width="2.5"
        />
      </button>
    </div>

    <div
      v-if="showPageInfo"
      class="pagination__info"
    >
      {{ startItem }}–{{ endItem }} de {{ total }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
  showTotal: {
    type: Boolean,
    default: true,
  },
  showPageInfo: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const visiblePages = computed(() => {
  const { currentPage: curr, lastPage: last, maxVisiblePages: max } = props
  if (last <= max) return Array.from({ length: last }, (_, i) => i + 1)

  const half = Math.floor(max / 2)
  let start = Math.max(1, curr - half)
  let end = Math.min(last, start + max - 1)
  if (end - start < max - 1) start = Math.max(1, end - max + 1)

  const pages = []
  if (start > 1) pages.push(1, '...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < last) pages.push('...', last)
  return pages
})

const startItem = computed(() => (props.currentPage - 1) * props.perPage + 1)
const endItem = computed(() =>
  Math.min(props.currentPage * props.perPage, props.total)
)
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
