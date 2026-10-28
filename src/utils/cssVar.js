// Lê o valor atual de uma variável CSS global (necessário para o Chart.js, que pinta em canvas).
export function getCssVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}
