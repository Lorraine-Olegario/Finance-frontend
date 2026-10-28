// Converte 'YYYY-MM-DD' em 'DD/MM/AAAA' sem passar por Date (evita deslocar o dia por fuso).
export function formatDate(value) {
  if (!value) return '—'

  const [year, month, day] = String(value).slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}
