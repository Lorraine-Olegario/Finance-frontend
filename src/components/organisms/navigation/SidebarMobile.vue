<template>
  <div class="mobile-sidebar">
    <div
      class="mobile-sidebar__overlay"
      :class="{ 'mobile-sidebar__overlay--active': !isCollapsed }"
      @click="closeSidebar"
    />
    <aside
      class="mobile-sidebar__panel"
      :class="{ 'mobile-sidebar__panel--collapsed': isCollapsed }"
    >
      <div class="mobile-sidebar__header">
        <h2 class="mobile-sidebar__logo">Finance</h2>
      </div>

      <nav class="mobile-sidebar__nav">
        <router-link
          v-for="item in visibleMenuItems"
          :key="item.id"
          :to="item.to"
          class="mobile-sidebar__nav-item"
          :exact-active-class="item.exact ? 'mobile-sidebar__nav-item--active' : ''"
          :active-class="!item.exact ? 'mobile-sidebar__nav-item--active' : ''"
          @click="handleNavClick"
        >
          <div
            class="mobile-sidebar__nav-icon"
            v-html="item.icon"
          />
          <span class="mobile-sidebar__nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { menuItems } from '@/config/menuItems'

export default {
  name: 'SidebarMobile',
  setup() {
    const authStore = useAuthStore()

    const visibleMenuItems = computed(() => {
      return menuItems.filter(item => {
        if (item.adminOnly) {
          return authStore.isAdmin
        }
        return true
      })
    })

    return {
      visibleMenuItems
    }
  },
  data() {
    return {
      isCollapsed: true
    }
  },
  mounted() {
    this.handleResize = () => {
      if (window.innerWidth <= 768) {
        this.isCollapsed = true
      }
    }

    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize)
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
      this.$emit('toggle', this.isCollapsed)
    },
    closeSidebar() {
      this.isCollapsed = true
      this.$emit('toggle', this.isCollapsed)
    },
    handleNavClick() {
      this.closeSidebar()
    }
  }
}
</script>

<style scoped>
/* Wrapper e overlay */
.mobile-sidebar {
  position: relative;
  z-index: 1000;
}

.mobile-sidebar__overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  display: none;
}

.mobile-sidebar__overlay--active {
  opacity: 1;
  pointer-events: auto;
}

/* Sidebar mobile */
.mobile-sidebar__panel {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  max-width: var(--sidebar-width);
  background-color: var(--bg-primary);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  z-index: 1100;
  display: none;
  flex-direction: column;
}

.mobile-sidebar__panel--collapsed {
  transform: translateX(-100%);
}

.mobile-sidebar__panel:not(.mobile-sidebar__panel--collapsed) {
  transform: translateX(0);
}

.mobile-sidebar__header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
}

.mobile-sidebar__logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.mobile-sidebar__nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.mobile-sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.875rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  cursor: pointer;
}

.mobile-sidebar__nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.mobile-sidebar__nav-icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.mobile-sidebar__nav-item:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.mobile-sidebar__nav-item--active {
  background-color: rgba(98, 0, 238, 0.05);
  color: var(--primary);
  border-left-color: var(--primary);
  font-weight: 600;
}

.mobile-sidebar__nav-item--active .mobile-sidebar__nav-icon :deep(svg) {
  stroke: var(--primary);
}

.mobile-sidebar__nav-label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Mostrar apenas no mobile */
@media (max-width: 768px) {
  .mobile-sidebar__panel {
    display: flex;
  }

  .mobile-sidebar__overlay {
    display: block;
  }
}

/* Ocultar no desktop */
@media (min-width: 769px) {
  .mobile-sidebar {
    display: none;
  }
}
</style>
