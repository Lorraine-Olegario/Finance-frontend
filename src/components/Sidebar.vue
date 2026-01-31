<template>
  <aside
    class="sidebar"
    :class="{ collapsed: isCollapsed }"
  >
    <div class="sidebar-header">
      <h2 class="logo">
        Finance
      </h2>
      <button
        class="toggle-btn"
        aria-label="Toggle sidebar"
        @click="toggleSidebar"
      >
        <span>☰</span>
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <router-link
        to="/"
        class="nav-item"
        exact-active-class="active"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <rect x="3" y="3" width="7" height="7" /> <rect x="14" y="3" width="7" height="7" /> <rect x="14" y="14" width="7" height="7" /> <rect x="3" y="14" width="7" height="7" /> </svg>
        <span class="label">Dashboard</span>
      </router-link>
      
      <router-link
        v-if="authStore.isAdmin"
        to="/users"
        class="nav-item"
        active-class="active"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /> <circle cx="9" cy="7" r="4" /> <path d="M23 21v-2a4 4 0 0 0-3-3.87" /> <path d="M16 3.13a4 4 0 0 1 0 7.75" /> </svg>
        <span class="label">Usuários</span>
      </router-link>
      
      <router-link
        to="/my-assets"
        class="nav-item"
        active-class="active"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <line x1="12" y1="1" x2="12" y2="23" /> <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> </svg>
        <span class="label">Ativos</span>
      </router-link>
      
      <router-link
        to="/observed"
        class="nav-item"
        active-class="active"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <circle cx="12" cy="12" r="3" /> </svg>
        <span class="label">Ativos Observados</span>
      </router-link>
      
      <router-link
        to="/quotes"
        class="nav-item"
        active-class="active"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> </svg>
        <span class="label">Cotações</span>
      </router-link>
      
      <router-link
        to="/history"
        class="nav-item"
        active-class="active"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <circle cx="12" cy="12" r="10" /> <polyline points="12 6 12 12 16 14" /> </svg>
        <span class="label">Histórico</span>
      </router-link>
      
      <router-link
        v-if="authStore.isAdmin"
        to="/categories"
        class="nav-item"
        active-class="active"
      >
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" > <path d="M3 3v18h18" /> <path d="m19 9-5 5-4-4-3 3" /> </svg>
        <span class="label">Categorias</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'Sidebar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const userInitials = computed(() => {
      if (!authStore.user?.name) return '?'
      return authStore.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    })
    
    const userRoleLabel = computed(() => {
      return authStore.isAdmin ? 'Administrador' : 'Usuário'
    })
    
    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }
    
    return {
      authStore,
      userInitials,
      userRoleLabel,
      handleLogout
    }
  },
  data() {
    return {
      isCollapsed: false
    }
  },
  mounted() {
    // Auto-collapse on mobile
    if (window.innerWidth <= 768) {
      this.isCollapsed = true
    }
    
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.isCollapsed = true
      }
    })
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
      this.$emit('toggle', this.isCollapsed)
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: var(--sidebar-width);
  background-color: var(--bg-primary);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  transform: translateX(-100%);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-primary);
  display: none;
}

.user-info {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
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
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
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

.nav-item.active .nav-icon {
  stroke: var(--primary);
}

.label {
  font-size: 0.9rem;
}

.sidebar-footer {
  padding: 1rem 0;
  border-top: 1px solid var(--border);
}

.logout-btn {
  color: var(--text-secondary);
}

.logout-btn:hover {
  background-color: rgba(176, 0, 32, 0.05);
  color: var(--error);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-width: var(--sidebar-width);
  }
  
  .toggle-btn {
    display: block;
  }
  
  .sidebar:not(.collapsed) {
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.5);
  }
}
</style>
