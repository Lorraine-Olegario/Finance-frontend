// Percentual pt-BR com 2 casas, sem sinal (ex.: 63,45%).
export function formatPlainPercent(value) {
  const number = Number(value)
  if (Number.isNaN(number)) return '—'
  return `${number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`
}
