<template>
  <div class="layout">
    <Sidebar @toggle="handleSidebarToggle" />

    <div
      class="main-wrapper"
      :class="{ 'sidebar-collapsed': sidebarCollapsed }"
    >
      <header class="main-header">
        <div class="header-left">
          <button
            class="mobile-menu-btn"
            @click="toggleSidebar"
          >
            ☰
          </button>
          <h1 class="page-title">
            {{ pageTitle }}
          </h1>
        </div>

        <div
          v-if="authStore.user"
          class="header-user"
        >
          <div class="user-info">
            <span class="user-name">{{ authStore.user.name }}</span>
          </div>
          <div
            ref="userMenu"
            class="user-menu"
          >
            <div
              class="user-avatar"
              @click.stop="toggleUserMenu"
            >
              {{ userInitials }}
            </div>
            <div
              v-if="userMenuOpen"
              class="dropdown-menu"
              @click.stop
            >
              <div class="dropdown-header">
                <div class="dropdown-user-info">
                  <strong>{{ authStore.user.name }}</strong>
                  <span class="user-email">{{ authStore.user.email }}</span>
                </div>
              </div>
              <div class="dropdown-divider" />
              <router-link
                to="/profile"
                class="dropdown-item"
                @click="closeUserMenu"
              >
                <svg
                  class="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                  />
                </svg>
                Meu Perfil
              </router-link>
              <button
                class="dropdown-item logout"
                @click="handleLogout"
              >
                <svg
                  class="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line
                    x1="21"
                    y1="12"
                    x2="9"
                    y2="12"
                  />
                </svg>
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue'
import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MainLayout',
  components: {
    Sidebar
  },
  props: {
    pageTitle: {
      type: String,
      default: 'Finance'
    }
  },
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

    return {
      authStore,
      userInitials,
      router
    }
  },
  data() {
    return {
      sidebarCollapsed: false,
      userMenuOpen: false
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleSidebarToggle(collapsed) {
      this.sidebarCollapsed = collapsed
    },
    toggleSidebar() {
      // Trigger sidebar toggle via event bus or refs
      const sidebar = this.$el.querySelector('.sidebar')
      if (sidebar) {
        const toggleBtn = sidebar.querySelector('.toggle-btn')
        if (toggleBtn) toggleBtn.click()
      }
    },
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
    },
    closeUserMenu() {
      this.userMenuOpen = false
    },
    handleClickOutside(event) {
      const userMenu = this.$refs.userMenu
      if (userMenu && !userMenu.contains(event.target)) {
        this.userMenuOpen = false
      }
    },
    async handleLogout() {
      this.userMenuOpen = false
      await this.authStore.logout()
      this.router.push('/login')
    }
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.main-wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-wrapper.sidebar-collapsed {
  margin-left: 0;
}

.main-header {
  background-color: var(--bg-primary);
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
  overflow: visible;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-primary);
}

.page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 100;
}

.user-info {
  text-align: right;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.user-menu {
  position: relative;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  user-select: none;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--surface, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  min-width: 240px;
  z-index: 99999;
  overflow: visible;
  animation: dropdownFadeIn 0.2s ease;
  display: block;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 16px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown-user-info strong {
  font-size: 14px;
  font-weight: 600;
}

.user-email {
  font-size: 12px;
  opacity: 0.9;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item .icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.dropdown-item:hover {
  background: var(--bg-hover);
}

.dropdown-item.logout {
  color: var(--danger);
  border-top: 1px solid var(--border-color);
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: var(--bg-secondary);
}

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0;
  }

  .mobile-menu-btn {
    display: block;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
