<template>
  <aside class="sidebar-desktop">
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
        :active-class="!item.exact ? 'active' : ''">
        <div class="nav-icon" v-html="item.icon"></div>
        <span class="label">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
  import { computed } from "vue";
  import { useAuthStore } from "../stores/auth";
  import { menuItems } from "../config/menuItems";

  export default {
    name: "SidebarDesktop",
    setup() {
      const authStore = useAuthStore();

      const visibleMenuItems = computed(() => {
        return menuItems.filter((item) => {
          // Se o item requer admin, verifica se o usuário é admin
          if (item.adminOnly) {
            return authStore.isAdmin;
          }
          return true;
        });
      });

      return {
        visibleMenuItems,
      };
    },
  };
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

  /* Ocultar no mobile */
  @media (max-width: 768px) {
    .sidebar-desktop {
      display: none;
    }
  }
</style>
