<template>
  <section
    id="cores"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">Cores</h1>
      <p class="ds-section-desc">
        Variáveis CSS globais definidas em
        <code>src/style.css</code>
        . Nunca use valores hex diretos nos componentes.
      </p>
    </div>

    <h3 class="ds-subsection-title">Paleta principal</h3>
    <div class="ds-token-grid">
      <div
        v-for="c in colorTokens"
        :key="c.var"
        class="ds-token-swatch"
      >
        <div
          class="ds-swatch-color"
          :style="{
            background: `var(${c.var})`,
            border: c.border ? '1px solid var(--border)' : 'none'
          }"
        />
        <p class="ds-swatch-var">
          {{ c.var }}
        </p>
        <p class="ds-swatch-hex">
          {{ c.hex }}
        </p>
        <p class="ds-swatch-label">
          {{ c.label }}
        </p>
      </div>
    </div>

    <h3
      class="ds-subsection-title"
      style="margin-top: 2.5rem"
    >
      Status de ativos
    </h3>
    <div class="ds-token-grid">
      <div
        v-for="c in statusTokens"
        :key="c.label"
        class="ds-token-swatch"
      >
        <div
          class="ds-swatch-color"
          :style="{ background: c.bg, border: `1px solid ${c.border}` }"
        />
        <p
          class="ds-swatch-var"
          :style="{ color: c.color }"
        >
          {{ c.label }}
        </p>
        <p class="ds-swatch-hex">bg: {{ c.bg }}</p>
        <p class="ds-swatch-label">
          {{ c.usage }}
        </p>
      </div>
    </div>
  </section>

  <section
    id="tipografia"
    class="ds-section"
  >
    <div class="ds-section-header">
      <h1 class="ds-section-title">Tipografia</h1>
      <p class="ds-section-desc">
        Escala de texto usada nos componentes. Sem font-family customizada — usa
        a fonte padrão do Bootstrap.
      </p>
    </div>
    <div class="ds-showcase">
      <p
        style="
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        "
      >
        2.5rem / 700 — Valor stat
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
  { var: '--primary', hex: '#6200ee', label: 'Ações principais, botões' },
  { var: '--primary-dark', hex: '#5000d0', label: 'Hover do primário' },
  { var: '--secondary', hex: '#3700b3', label: 'Ações secundárias' },
  { var: '--accent', hex: '#bb86fc', label: 'Destaques' },
  {
    var: '--bg-primary',
    hex: '#ffffff',
    label: 'Superfícies / cards',
    border: true
  },
  {
    var: '--bg-secondary',
    hex: '#f5f5f5',
    label: 'Background da aplicação',
    border: true
  },
  { var: '--bg-hover', hex: '#eeeeee', label: 'Hover de itens', border: true },
  { var: '--text-primary', hex: '#212121', label: 'Texto principal' },
  {
    var: '--text-secondary',
    hex: '#757575',
    label: 'Texto secundário / muted'
  },
  { var: '--border', hex: '#e0e0e0', label: 'Bordas' },
  { var: '--error', hex: '#b00020', label: 'Erros' },
  { var: '--success', hex: '#00c853', label: 'Sucesso' },
  { var: '--danger', hex: '#dc2626', label: 'Ações destrutivas' },
  { var: '--accent-blue', hex: '#3b82f6', label: 'Destaque azul' },
  { var: '--accent-green', hex: '#10b981', label: 'Destaque verde' },
  { var: '--accent-yellow', hex: '#f59e0b', label: 'Destaque amarelo' }
]

const statusTokens = [
  {
    label: 'ativo',
    bg: '#d4edda',
    border: '#c3e6cb',
    color: '#155724',
    usage: 'Ativo e funcionando'
  },
  {
    label: 'observando',
    bg: '#fff3cd',
    border: '#ffeaa7',
    color: '#856404',
    usage: 'Em monitoramento'
  },
  {
    label: 'inativo',
    bg: '#f8d7da',
    border: '#f5c6cb',
    color: '#721c24',
    usage: 'Inativo / erro'
  }
]
</script>
