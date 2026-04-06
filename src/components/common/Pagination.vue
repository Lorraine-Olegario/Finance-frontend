<template>
  <div
    v-if="total > 0"
    class="pagination-container"
  >
    <!-- Total Label -->
    <div
      v-if="showTotal"
      class="total-section"
    >
      <slot
        name="totalLabel"
        :total="total"
      >
        Total:
        <strong>{{ total }}</strong>
      </slot>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button
        class="pagination-btn prev"
        :disabled="currentPage === 1"
        title="Página anterior"
        @click="$emit('page-change', currentPage - 1)"
      >
        <!-- prettier-ignore -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg>
      </button>

      <div class="pagination-pages">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination-page"
          :class="{ active: page === currentPage, ellipsis: page === '...' }"
          :disabled="page === '...'"
          @click="page !== '...' && $emit('page-change', page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="pagination-btn next"
        :disabled="currentPage === lastPage"
        title="Próxima página"
        @click="$emit('page-change', currentPage + 1)"
      >
        <!-- prettier-ignore -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    </div>

    <!-- Page Info -->
    <div
      v-if="showPageInfo"
      class="page-info"
    >
      Página {{ currentPage }} de {{ lastPage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true,
      default: 1
    },
    lastPage: {
      type: Number,
      required: true,
      default: 1
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    perPage: {
      type: Number,
      default: 10
    },
    maxVisiblePages: {
      type: Number,
      default: 5
    },
    showTotal: {
      type: Boolean,
      default: true
    },
    showPageInfo: {
      type: Boolean,
      default: false
    }
  },
  emits: ['page-change'],
  computed: {
    visiblePages() {
      const pages = []
      const { currentPage, lastPage, maxVisiblePages } = this

      if (lastPage <= maxVisiblePages) {
        // Se tem poucas páginas, mostra todas
        for (let i = 1; i <= lastPage; i++) {
          pages.push(i)
        }
      } else {
        // Lógica para muitas páginas com reticências
        const leftBound = Math.max(
          1,
          currentPage - Math.floor(maxVisiblePages / 2)
        )
        const rightBound = Math.min(lastPage, leftBound + maxVisiblePages - 1)
        const adjustedLeftBound = Math.max(1, rightBound - maxVisiblePages + 1)

        // Primeira página
        if (adjustedLeftBound > 1) {
          pages.push(1)
          if (adjustedLeftBound > 2) {
            pages.push('...')
          }
        }

        // Páginas centrais
        for (let i = adjustedLeftBound; i <= rightBound; i++) {
          pages.push(i)
        }

        // Última página
        if (rightBound < lastPage) {
          if (rightBound < lastPage - 1) {
            pages.push('...')
          }
          pages.push(lastPage)
        }
      }

      return pages
    }
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border-radius: 8px;
  border: 1px solid var(--border);
  animation: fadeIn 0.3s ease;
  flex-wrap: wrap;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.total-section {
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
}

.total-section strong {
  color: var(--primary);
  font-weight: 600;
  margin-left: 0.25rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s;
}

.pagination-btn svg {
  width: 16px;
  height: 16px;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: scale(1.05);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.pagination-page {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-primary);
  transition: all 0.2s;
  font-size: 0.875rem;
}

.pagination-page:hover:not(:disabled):not(.ellipsis) {
  background: var(--surface);
  border-color: var(--primary);
  color: var(--primary);
  transform: scale(1.05);
}

.pagination-page.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  font-weight: 600;
}

.pagination-page.ellipsis {
  border: none;
  background: transparent;
  cursor: default;
  color: var(--text-secondary);
  font-weight: 600;
}

.pagination-page:disabled {
  cursor: not-allowed;
}

.page-info {
  color: var(--text-secondary);
  font-size: 0.85rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .pagination-container {
    padding: 0.875rem 1rem;
    gap: 1rem;
  }

  .total-section {
    flex: 0 0 100%;
    text-align: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }

  .pagination-controls {
    justify-content: center;
  }

  .page-info {
    flex: 0 0 100%;
    text-align: center;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
  }

  .pagination-btn,
  .pagination-page {
    width: 28px;
    height: 28px;
    min-width: 28px;
  }

  .pagination-btn svg {
    width: 14px;
    height: 14px;
  }

  .pagination-page {
    font-size: 0.8rem;
  }
}
</style>
