<template>
  <section
    id="cores"
    class="ds-section"
  >
    <div class="ds-section__header">
      <h1 class="ds-section__title">Cores</h1>
      <p class="ds-section__desc">
        Variáveis CSS globais definidas em
        <code>src/style.css</code>
        . Nunca use valores hex diretos nos componentes.
      </p>
    </div>

    <h3 class="ds-section__subsection-title">Paleta principal</h3>
    <div class="ds-token__grid">
      <div
        v-for="c in colorTokens"
        :key="c.var"
        class="ds-token__swatch"
      >
        <div
          class="ds-token__swatch-color"
          :style="{
            background: `var(${c.var})`,
            border: c.border ? '1px solid var(--border)' : 'none'
          }"
        />
        <p class="ds-token__swatch-var">
          {{ c.var }}
        </p>
        <p class="ds-token__swatch-hex">
          {{ c.hex }}
        </p>
        <p class="ds-token__swatch-label">
          {{ c.label }}
        </p>
      </div>
    </div>

    <h3
      class="ds-section__subsection-title"
      style="margin-top: 2.5rem"
    >
      Status de ativos
    </h3>
    <div class="ds-token__grid">
      <div
        v-for="c in statusTokens"
        :key="c.label"
        class="ds-token__swatch"
      >
        <div
          class="ds-token__swatch-color"
          :style="{ background: c.bg, border: `1px solid ${c.border}` }"
        />
        <p
          class="ds-token__swatch-var"
          :style="{ color: c.color }"
        >
          {{ c.label }}
        </p>
        <p class="ds-token__swatch-hex">bg: {{ c.bg }}</p>
        <p class="ds-token__swatch-label">
          {{ c.usage }}
        </p>
      </div>
    </div>
  </section>

  <section
    id="tipografia"
    class="ds-section"
  >
    <div class="ds-section__header">
      <h1 class="ds-section__title">Tipografia</h1>
      <p class="ds-section__desc">
        Três famílias:
        <code>--font-sans</code>
        (texto corrido),
        <code>--font-display</code>
        (títulos) e
        <code>--font-mono</code>
        (números — sempre com
        <code>.num</code>
        /
        <code>.money</code>
        para alinhamento tabular).
      </p>
    </div>
    <div class="ds-showcase">
      <p
        style="
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        "
      >
        R$ 12.480,90 — .num / .money
      </p>
      <p
        style="
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 8px 0 0;
        "
      >
        --font-display — Título de página
      </p>
      <p
        style="
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 8px 0 0;
        "
      >
        1.5rem / 600 — Título empty state
      </p>
      <p
        style="
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 8px 0 0;
        "
      >
        1.125rem / 600 — Título de card
      </p>
      <p
        style="
          font-size: 1rem;
          font-weight: 400;
          color: var(--text-primary);
          margin: 8px 0 0;
        "
      >
        1rem / 400 — Texto principal
      </p>
      <p
        style="
          font-size: 0.9375rem;
          font-weight: 400;
          color: var(--text-secondary);
          margin: 8px 0 0;
        "
      >
        0.9375rem — Alert message, texto secundário
      </p>
      <p
        style="
          font-size: 0.875rem;
          font-weight: 400;
          color: var(--text-secondary);
          margin: 8px 0 0;
        "
      >
        0.875rem — Label de formulários, nav
      </p>
      <p
        style="
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 8px 0 0;
        "
      >
        0.8rem / 600 UPPERCASE — Filter label
      </p>
      <p
        style="
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          margin: 8px 0 0;
        "
      >
        0.75rem / 600 UPPERCASE — Badge, status
      </p>
    </div>
  </section>
</template>

<script setup>
const colorTokens = [
  { var: '--primary', hex: '#3ddc97', label: 'Ações principais, ganho' },
  { var: '--primary-hover', hex: '#55e3a6', label: 'Hover do primário' },
  { var: '--primary-active', hex: '#2fbe80', label: 'Active do primário' },
  { var: '--gold', hex: '#e8c468', label: 'Categoria FIIs, alerta' },
  { var: '--coral', hex: '#ff6b6b', label: 'Perda, ações destrutivas' },
  {
    var: '--bg-primary',
    hex: '#0a0e0d',
    label: 'Background da aplicação',
    border: true
  },
  {
    var: '--bg-elevated',
    hex: '#182420',
    label: 'Superfícies / cards',
    border: true
  },
  {
    var: '--bg-elevated-hover',
    hex: '#1e2d28',
    label: 'Hover de itens',
    border: true
  },
  { var: '--text-primary', hex: '#edf2ef', label: 'Texto principal' },
  {
    var: '--text-secondary',
    hex: '#8fa39c',
    label: 'Texto secundário / muted'
  },
  { var: '--text-muted', hex: '#5a6c66', label: 'Texto terciário / faint' },
  { var: '--border-default', hex: '#243330', label: 'Bordas' }
]

const statusTokens = [
  {
    label: 'ativo',
    bg: 'var(--status-success-bg)',
    border: 'var(--status-success)',
    color: 'var(--status-success)',
    usage: 'Ativo e funcionando'
  },
  {
    label: 'observando',
    bg: 'var(--status-warning-bg)',
    border: 'var(--status-warning)',
    color: 'var(--status-warning)',
    usage: 'Em monitoramento'
  },
  {
    label: 'inativo / pausado',
    bg: 'var(--bg-elevated-hover)',
    border: 'var(--border-default)',
    color: 'var(--text-muted)',
    usage: 'Inativo, pausado — fora dos cálculos'
  }
]
</script>
