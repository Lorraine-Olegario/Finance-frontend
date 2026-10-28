export const DIVIDEND_TYPE_LABELS = {
  dividend: 'Dividendos',
  jcp: 'JCP',
  fii_income: 'Rendimento',
  taxable_income: 'Rend. Trib.',
  other: 'Outros'
}

export const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez'
]

export function formatDividendType(type) {
  return DIVIDEND_TYPE_LABELS[type] || DIVIDEND_TYPE_LABELS.other
}

// '2026-10' -> '10/2026'; '2026' -> '2026'
export function formatEvolutionPeriod(period) {
  const [year, month] = String(period).split('-')
  return month ? `${month}/${year}` : year
}
