<template>
  <div class="main-layout">
    <SidebarDesktop />
    <SidebarMobile
      ref="sidebarMobile"
      @toggle="handleSidebarToggle"
    />

    <div
      class="main-layout__wrapper"
      :class="{ 'main-layout__wrapper--sidebar-collapsed': sidebarCollapsed }"
    >
      <header class="main-layout__header">
        <div class="main-layout__header-left">
          <button
            class="main-layout__mobile-menu-btn"
            @click="toggleSidebar"
          >
            ☰
          </button>
          <h1 class="main-layout__page-title">
            {{ pageTitle }}
          </h1>
        </div>

        <div
          v-if="authStore.user"
          class="main-layout__header-user"
        >
          <div class="main-layout__user-info">
            <span class="main-layout__user-name">{{ authStore.user.name }}</span>
          </div>
          <div
            ref="userMenu"
            class="main-layout__user-menu"
          >
            <div
              class="main-layout__user-avatar"
              @click.stop="toggleUserMenu"
            >
              {{ userInitials }}
            </div>
            <div
              v-if="userMenuOpen"
              class="main-layout__dropdown"
              @click.stop
            >
              <div class="main-layout__dropdown-header">
                <div class="main-layout__dropdown-user-info">
                  <strong>{{ authStore.user.name }}</strong>
                  <span class="main-layout__user-email">{{ authStore.user.email }}</span>
                </div>
              </div>
              <div class="main-layout__dropdown-divider" />
              <router-link
                to="/profile"
                class="main-layout__dropdown-item"
                @click="closeUserMenu"
              >
                <!-- prettier-ignore -->
                <svg class="main-layout__dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" /> </svg>
                Meu Perfil
              </router-link>
              <button
                class="main-layout__dropdown-item main-layout__dropdown-item--logout"
                @click="handleLogout"
              >
                <!-- prettier-ignore -->
                <svg class="main-layout__dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /> <polyline points="16 17 21 12 16 7" /> <line x1="21" y1="12" x2="9" y2="12" /> </svg>
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="main-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import SidebarDesktop from '@/components/organisms/navigation/SidebarDesktop.vue'
import SidebarMobile from '@/components/organisms/navigation/SidebarMobile.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MainLayout',
  components: {
    SidebarDesktop,
    SidebarMobile
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
      if (this.$refs.sidebarMobile) {
        this.$refs.sidebarMobile.toggleSidebar()
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
.main-layout {
  display: flex;
  min-height: 100vh;
}

.main-layout__wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout__wrapper--sidebar-collapsed {
  margin-left: 0;
}

.main-layout__header {
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

.main-layout__header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main-layout__mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-primary);
}

.main-layout__page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .main-layout__page-title {
    display: none;
  }
}

.main-layout__header-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 100;
}

.main-layout__user-info {
  text-align: right;
}

.main-layout__user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.main-layout__user-menu {
  position: relative;
}

.main-layout__user-avatar {
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

.main-layout__user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.main-layout__dropdown {
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

.main-layout__dropdown-header {
  padding: 16px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
}

.main-layout__dropdown-user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-layout__dropdown-user-info strong {
  font-size: 14px;
  font-weight: 600;
}

.main-layout__user-email {
  font-size: 12px;
  opacity: 0.9;
}

.main-layout__dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0;
}

.main-layout__dropdown-item {
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

.main-layout__dropdown-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.main-layout__dropdown-item:hover {
  background: var(--bg-hover);
}

.main-layout__dropdown-item--logout {
  color: var(--danger);
  border-top: 1px solid var(--border-color);
}

.main-layout__dropdown-item--logout:hover {
  background: rgba(239, 68, 68, 0.1);
}

.main-layout__content {
  flex: 1;
  padding: 2rem;
  background-color: var(--bg-secondary);
  overflow: visible;
  position: relative;
}

@media (max-width: 768px) {
  .main-layout__wrapper {
    margin-left: 0;
  }

  .main-layout__mobile-menu-btn {
    display: block;
  }

  .main-layout__mobile-menu-btn:hover {
    background-color: var(--bg-secondary);
    border-radius: 4px;
  }

  .main-layout__content {
    padding: 1rem;
  }

  .main-layout__user-info {
    display: none;
  }
}
</style>
