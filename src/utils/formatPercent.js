export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—'
  }
  const number = Number(value)
  const prefix = number >= 0 ? '+' : ''
  return `${prefix}${number.toFixed(2)}%`
}
