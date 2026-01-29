import { ref, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export function useChart() {
  const chart = ref(null)
  const chartRef = ref(null)

  const createChart = (assetsByType, getCategoryColor) => {
    if (chart.value) {
      chart.value.destroy()
    }

    if (!chartRef.value || Object.keys(assetsByType).length === 0) {
      return
    }

    const ctx = chartRef.value.getContext('2d')
    const labels = Object.keys(assetsByType)
    const data = Object.values(assetsByType)
    const colors = labels.map(label => getCategoryColor(label))

    chart.value = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ''
                const value = context.parsed || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: ${value} (${percentage}%)`
              }
            }
          }
        }
      }
    })
  }

  onBeforeUnmount(() => {
    if (chart.value) {
      chart.value.destroy()
    }
  })

  return {
    chartRef,
    createChart
  }
}
