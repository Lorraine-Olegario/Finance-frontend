<template>
  <div
    v-if="isValidQuote"
    class="quote-card"
  >
    <div class="quote-card__header">
      <div class="quote-card__logo">
        <img
          v-if="logoSrc && !imageError"
          :src="logoSrc"
          :alt="ticker"
          class="quote-card__logo-img"
          @error="imageError = true"
        />
        <div
          v-else
          class="quote-card__logo-placeholder"
        >
          <SvgIcon
            name="activity"
            :size="22"
          />
        </div>
      </div>

      <div class="quote-card__info">
        <div class="quote-card__symbol-row">
          <h3 class="quote-card__symbol">
            {{ ticker }}
          </h3>
          <StatusBadge
            v-if="quote.status"
            :status="quote.status"
          />
        </div>
        <p class="quote-card__name">
          {{ displayName }}
        </p>
      </div>
    </div>

    <div class="quote-card__body">
      <div class="quote-card__price">
        <span class="quote-card__currency">{{ quote.currency || 'BRL' }}</span>
        <span class="quote-card__price-value">{{ formattedPrice }}</span>
      </div>

      <div
        class="quote-card__change"
        :class="
          isPositive
            ? 'quote-card__change--positive'
            : 'quote-card__change--negative'
        "
      >
        <SvgIcon
          :name="isPositive ? 'trending-up' : 'trending-down'"
          :size="14"
        />
        <span class="quote-card__change-value">{{ formattedChange }}</span>
        <span class="quote-card__change-percent">
          {{ formattedChangePercent }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SvgIcon from '@/components/atoms/SvgIcon.vue'
import StatusBadge from '@/components/atoms/StatusBadge.vue'

const props = defineProps({
  quote: { type: Object, required: true }
})

const imageError = ref(false)

const ticker = computed(() => props.quote.symbol || props.quote.codigo || '')

const isValidQuote = computed(
  () =>
    ticker.value &&
    (props.quote.regularMarketPrice || props.quote.preco || props.quote.price)
)

const logoSrc = computed(
  () => props.quote.logourl || props.quote.logo_url || null
)

const displayName = computed(
  () =>
    props.quote.shortName || props.quote.longName || props.quote.nome || 'N/A'
)

const currentPrice = computed(
  () =>
    props.quote.regularMarketPrice ||
    props.quote.preco ||
    props.quote.price ||
    0
)

const change = computed(
  () =>
    props.quote.regularMarketChange ||
    props.quote.variacao ||
    props.quote.change ||
    0
)

const changePercent = computed(
  () =>
    props.quote.regularMarketChangePercent ||
    props.quote.percentualVariacao ||
    props.quote.changePercent ||
    0
)

const isPositive = computed(() => changePercent.value >= 0)

const formattedPrice = computed(() => currentPrice.value.toFixed(2))

const formattedChange = computed(() => {
  const prefix = change.value >= 0 ? '+' : ''
  return `${prefix}${change.value.toFixed(2)}`
})

const formattedChangePercent = computed(() => {
  const prefix = changePercent.value >= 0 ? '+' : ''
  return `${prefix}${changePercent.value.toFixed(2)}%`
})
</script>

<style scoped>
.quote-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.25rem;
  border: 2px solid var(--border);
  transition: all 0.3s ease;
}

.quote-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--primary);
}

/* Header */
.quote-card__header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
}

.quote-card__logo {
  flex-shrink: 0;
}

.quote-card__logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
}

.quote-card__logo-placeholder {
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.quote-card__info {
  flex: 1;
  min-width: 0;
}

.quote-card__symbol-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.quote-card__symbol {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
}

.quote-card__name {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Body */
.quote-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.quote-card__price {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.quote-card__currency {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.quote-card__price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.quote-card__change {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.quote-card__change--positive {
  background: color-mix(in srgb, var(--accent-green) 12%, transparent);
  color: var(--accent-green);
}

.quote-card__change--negative {
  background: color-mix(in srgb, var(--danger) 12%, transparent);
  color: var(--danger);
}

.quote-card__change-value,
.quote-card__change-percent {
  font-size: 0.875rem;
}

.quote-card__change-percent {
  font-weight: 700;
}

@media (max-width: 768px) {
  .quote-card {
    padding: 1rem;
  }

  .quote-card__body {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .quote-card__price-value {
    font-size: 1.25rem;
  }
}
</style>
