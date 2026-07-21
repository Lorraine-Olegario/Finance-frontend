export function formatCurrency(value) {
  const number = Number(value)
  if (Number.isNaN(number)) return '—'
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
