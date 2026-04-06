<template>
  <div class="sidebar-mobile-wrapper">
    <div
      class="sidebar-overlay"
      :class="{ active: !isCollapsed }"
      @click="closeSidebar"
    />
    <aside
      class="sidebar-mobile"
      :class="{ collapsed: isCollapsed }"
    >
      <div class="sidebar-header">
        <h2 class="logo">Finance</h2>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in visibleMenuItems"
          :key="item.id"
          :to="item.to"
          class="nav-item"
          :exact-active-class="item.exact ? 'active' : ''"
          :active-class="!item.exact ? 'active' : ''"
          @click="handleNavClick"
        >
          <div
            class="nav-icon"
            v-html="item.icon"
          />
          <span class="label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { menuItems } from '../config/menuItems'

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
.sidebar-mobile-wrapper {
  position: relative;
  z-index: 1000;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  display: none;
}

.sidebar-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

/* Sidebar mobile */
.sidebar-mobile {
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

.sidebar-mobile.collapsed {
  transform: translateX(-100%);
}

.sidebar-mobile:not(.collapsed) {
  transform: translateX(0);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
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

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.nav-item:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: rgba(98, 0, 238, 0.05);
  color: var(--primary);
  border-left-color: var(--primary);
  font-weight: 600;
}

.nav-item.active .nav-icon :deep(svg) {
  stroke: var(--primary);
}

.label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Mostrar apenas no mobile */
@media (max-width: 768px) {
  .sidebar-mobile {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
  }
}

/* Ocultar no desktop */
@media (min-width: 769px) {
  .sidebar-mobile-wrapper {
    display: none;
  }
}
</style>
