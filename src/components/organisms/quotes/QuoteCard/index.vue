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
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import StatusBadge from '@/components/atoms/StatusBadge/index.vue'

const props = defineProps({
  quote: {
    type: Object,
    required: true,
  },
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

<style scoped lang="scss">
@use './styles.module';
</style>
