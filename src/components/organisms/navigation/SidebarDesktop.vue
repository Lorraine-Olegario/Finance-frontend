<template>
  <aside class="sidebar-desktop">
    <div class="sidebar-desktop__header">
      <h2 class="sidebar-desktop__logo">Finance</h2>
    </div>

    <nav class="sidebar-desktop__nav">
      <router-link
        v-for="item in visibleMenuItems"
        :key="item.id"
        :to="item.to"
        class="sidebar-desktop__nav-item"
        :exact-active-class="item.exact ? 'sidebar-desktop__nav-item--active' : ''"
        :active-class="!item.exact ? 'sidebar-desktop__nav-item--active' : ''"
      >
        <div
          class="sidebar-desktop__nav-icon"
          v-html="item.icon"
        />
        <span class="sidebar-desktop__nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { menuItems } from '@/config/menuItems'

export default {
  name: 'SidebarDesktop',
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
  }
}
</script>

<style scoped>
.sidebar-desktop {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: var(--sidebar-width);
  background-color: var(--bg-primary);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar-desktop__header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
}

.sidebar-desktop__logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.sidebar-desktop__nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.sidebar-desktop__nav-item {
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

.sidebar-desktop__nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-desktop__nav-icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.sidebar-desktop__nav-item:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.sidebar-desktop__nav-item--active {
  background-color: rgba(98, 0, 238, 0.05);
  color: var(--primary);
  border-left-color: var(--primary);
  font-weight: 600;
}

.sidebar-desktop__nav-item--active .sidebar-desktop__nav-icon :deep(svg) {
  stroke: var(--primary);
}

.sidebar-desktop__nav-label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Ocultar no mobile */
@media (max-width: 768px) {
  .sidebar-desktop {
    display: none;
  }
}
</style>
