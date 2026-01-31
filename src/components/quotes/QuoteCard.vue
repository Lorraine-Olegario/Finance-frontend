<template>
  <div
    v-if="isValidQuote"
    class="quote-card"
  >
    <!-- Header -->
    <div class="quote-header">
      <div class="quote-logo-wrapper">
        <img 
          v-if="quote.logourl" 
          :src="quote.logourl" 
          :alt="quote.symbol"
          class="quote-logo"
          @error="handleImageError"
        >
        <div
          v-else
          class="quote-logo-placeholder"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M12 2L2 7l10 5 10-5-10-5z" /> <path d="M2 17l10 5 10-5M2 12l10 5 10-5" /> </svg>
        </div>
      </div>
      <div class="quote-info">
        <div class="symbol-row">
          <h3 class="quote-symbol">
            {{ quote.symbol }}
          </h3>
          <span
            v-if="quote.status"
            class="status-badge"
            :class="`status-${quote.status}`"
          >
            {{ getStatusLabel(quote.status) }}
          </span>
        </div>
        <p class="quote-name">
          {{ quote.shortName || quote.longName || 'N/A' }}
        </p>
      </div>
    </div>
    
    <!-- Price Section -->
    <div class="quote-main">
      <div class="price-row">
        <div class="price-section">
          <span class="currency">{{ quote.currency || 'BRL' }}</span>
          <span class="price-value">{{ formatPrice(currentPrice) }}</span>
        </div>
        
        <div
          class="change-section"
          :class="changeClass"
        >
          <svg class="change-icon" viewBox="0 0 24 24" fill="currentColor" > <path v-if="isPositive" d="M7 14l5-5 5 5H7z" /> <path v-else d="M7 10l5 5 5-5H7z" /> </svg>
          <span class="change-value">{{ formattedChange }}</span>
          <span class="change-percent">{{ formattedChangePercent }}</span>
        </div>
      </div>
    </div>
    
    <!-- Details -->
    <div class="quote-details">
      <div class="detail-item">
        <span class="detail-label">Vol</span>
        <span class="detail-value">{{ formatLargeNumber(quote.regularMarketVolume || quote.volume) }}</span>
      </div>
      
      <div
        v-if="quote.marketCap"
        class="detail-item"
      >
        <span class="detail-label">Cap</span>
        <span class="detail-value">{{ formatLargeNumber(quote.marketCap) }}</span>
      </div>
      
      <div
        v-if="quote.regularMarketDayHigh && quote.regularMarketDayLow"
        class="detail-item"
      >
        <span class="detail-label">Min/Max</span>
        <span class="detail-value">{{ formatPrice(quote.regularMarketDayLow) }}/{{ formatPrice(quote.regularMarketDayHigh) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuoteCard',
  props: {
    quote: {
      type: Object,
      required: true
    }
  },
  computed: {
    isValidQuote() {
      return this.quote && this.quote.symbol && (this.quote.regularMarketPrice || this.quote.price)
    },
    currentPrice() {
      return this.quote.regularMarketPrice || this.quote.price || 0
    },
    change() {
      return this.quote.regularMarketChange || this.quote.change || 0
    },
    changePercent() {
      return this.quote.regularMarketChangePercent || this.quote.changePercent || 0
    },
    isPositive() {
      return this.changePercent >= 0
    },
    changeClass() {
      return this.isPositive ? 'positive' : 'negative'
    },
    formattedChange() {
      const prefix = this.change >= 0 ? '+' : ''
      return `${prefix}${this.change.toFixed(2)}`
    },
    formattedChangePercent() {
      const prefix = this.changePercent >= 0 ? '+' : ''
      return `${prefix}${this.changePercent.toFixed(2)}%`
    }
  },
  methods: {
    formatPrice(price) {
      return price ? price.toFixed(2) : '0.00'
    },
    formatLargeNumber(num) {
      if (!num) return 'N/A'
      if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
      if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
      if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
      return num.toString()
    },
    handleImageError(event) {
      event.target.style.display = 'none'
    },
    getStatusLabel(status) {
      const labels = {
        'ativo': 'Ativo',
        'inativo': 'Inativo',
        'pausado': 'Pausado'
      }
      return labels[status] || status
    }
  }
}
</script>

<style scoped>
.quote-card {
  background: var(--surface);
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
.quote-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
}

.quote-logo-wrapper {
  flex-shrink: 0;
}

.quote-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
}

.quote-logo-placeholder {
  width: 40px;
  height: 40px;
  background: var(--background);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.quote-logo-placeholder svg {
  width: 22px;
  height: 22px;
}

.quote-info {
  flex: 1;
  min-width: 0;
}

.symbol-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.quote-symbol {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-family: system-ui, -apple-system, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-ativo {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.status-inativo {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.status-pausado {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.quote-name {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Main Price */
.quote-main {
  margin-bottom: 1rem;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.currency {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.change-section {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.change-section.positive {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.change-section.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.change-icon {
  width: 14px;
  height: 14px;
}

.change-value {
  font-size: 0.875rem;
}

.change-percent {
  font-size: 0.875rem;
  font-weight: 700;
}

/* Details */
.quote-details {
  display: flex;
  gap: 0.625rem;
  padding-top: 0.875rem;
  border-top: 2px solid var(--border);
}

.detail-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0.625rem;
  background: var(--background);
  border-radius: 6px;
  min-width: 0;
}

.detail-label {
  font-size: 0.65rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.detail-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .quote-card {
    padding: 1rem;
  }
  
  .price-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .price-value {
    font-size: 1.25rem;
  }
  
  .quote-details {
    flex-direction: column;
  }
}
</style>
