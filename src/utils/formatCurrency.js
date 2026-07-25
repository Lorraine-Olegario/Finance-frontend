const MASKED_VALUE = 'R$ ••••••'

export function formatCurrency(value, hidden = false) {
  if (hidden) return MASKED_VALUE

  const number = Number(value)
  if (Number.isNaN(number)) return '—'
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
