<template>
  <div class="ds-root">
    <!-- Sidebar -->
    <aside class="ds-sidebar">
      <div class="ds-sidebar-header">
        <div class="ds-logo">
          <SvgIcon
            name="logo-grid"
            size="32"
          />
        </div>
        <div>
          <p class="ds-logo-title">Finance UI</p>
          <p class="ds-logo-sub">Design System</p>
        </div>
      </div>

      <nav class="ds-nav">
        <p class="ds-nav-group-label">Fundamentos</p>
        <a
          v-for="item in navItems.tokens"
          :key="item.id"
          :href="`#${item.id}`"
          class="ds-nav-link"
          :class="{ active: activeSection === item.id }"
          @click.prevent="scrollTo(item.id)"
        >
          {{ item.label }}
        </a>

        <p
          class="ds-nav-group-label"
          style="margin-top: 1.25rem"
        >
          Atoms
        </p>
        <a
          v-for="item in navItems.atoms"
          :key="item.id"
          :href="`#${item.id}`"
          class="ds-nav-link"
          :class="{ active: activeSection === item.id }"
          @click.prevent="scrollTo(item.id)"
        >
          {{ item.label }}
        </a>

        <p
          class="ds-nav-group-label"
          style="margin-top: 1.25rem"
        >
          Molecules
        </p>
        <a
          v-for="item in navItems.molecules"
          :key="item.id"
          :href="`#${item.id}`"
          class="ds-nav-link"
          :class="{ active: activeSection === item.id }"
          @click.prevent="scrollTo(item.id)"
        >
          {{ item.label }}
        </a>

        <p
          class="ds-nav-group-label"
          style="margin-top: 1.25rem; opacity: 0.5"
        >
          Organisms
        </p>
        <span class="ds-nav-soon">Em breve…</span>
      </nav>
    </aside>

    <!-- Main -->
    <main class="ds-main">
      <TokensSection />
      <AtomsSection />
      <MoleculesSection />

      <footer class="ds-footer">
        Finance UI Kit · Design System · Vue 3 + Plain CSS
      </footer>
    </main>
  </div>
</template>

<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref, onMounted, onUnmounted } from 'vue'

import SvgIcon from '@/components/atoms/SvgIcon.vue'
import TokensSection from './sections/TokensSection.vue'
import AtomsSection from './sections/AtomsSection.vue'
import MoleculesSection from './sections/MoleculesSection.vue'

defineOptions({ name: 'DesignSystemPage' })

// ── State ─────────────────────────────────────────────────────────────────────
const activeSection = ref('cores')

const navItems = {
  tokens: [
    { id: 'cores', label: 'Cores' },
    { id: 'tipografia', label: 'Tipografia' }
  ],
  atoms: [
    { id: 'svg-icon', label: 'SvgIcon' },
    { id: 'app-spinner', label: 'AppSpinner' },
    { id: 'base-button', label: 'BaseButton' },
    { id: 'base-input', label: 'BaseInput' },
    { id: 'base-select', label: 'BaseSelect' },
    { id: 'badge', label: 'Badge' },
    { id: 'status-badge', label: 'StatusBadge' },
    { id: 'action-button', label: 'ActionButton' },
    { id: 'filter-label', label: 'FilterLabel' },
    { id: 'loading-spinner', label: 'LoadingSpinner' },
    { id: 'empty-state', label: 'EmptyState' },
    { id: 'alert-message', label: 'AlertMessage' },
    { id: 'pagination', label: 'Pagination' },
    { id: 'stat-card', label: 'StatCard' },
    { id: 'dashboard-card', label: 'DashboardCard' },
    { id: 'quick-action-card', label: 'QuickActionCard' },
    { id: 'category-list-item', label: 'CategoryListItem' }
  ],
  molecules: [
    { id: 'search-bar', label: 'SearchBar' },
    { id: 'form-field', label: 'FormField' },
    { id: 'stats-grid', label: 'StatsGrid' },
    { id: 'page-header', label: 'PageHeader' },
    { id: 'table-actions', label: 'TableActions' }
  ]
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
let observer = null

onMounted(() => {
  const sections = document.querySelectorAll('.ds-section')
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { rootMargin: '-20% 0px -70% 0px' }
  )
  sections.forEach(s => observer.observe(s))
})

onUnmounted(() => observer?.disconnect())

// ── Functions ─────────────────────────────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeSection.value = id
}
</script>

<style>
/* Estilos globais do Design System — não usar scoped para herança nas sections */
@import './design-system.css';
</style>
