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
            aria-label="Abrir menu"
            @click="toggleSidebar"
          >
            <SvgIcon
              name="menu"
              :size="20"
            />
          </button>
          <h1 class="main-layout__page-title">
            {{ pageTitle }}
          </h1>
        </div>

        <div
          v-if="authStore.user"
          class="main-layout__header-user"
        >
          <button
            type="button"
            class="main-layout__visibility-btn"
            :aria-label="
              visibilityStore.valuesHidden
                ? 'Exibir valores financeiros'
                : 'Ocultar valores financeiros'
            "
            :title="
              visibilityStore.valuesHidden
                ? 'Exibir valores financeiros'
                : 'Ocultar valores financeiros'
            "
            @click="visibilityStore.toggleValuesVisibility"
          >
            <SvgIcon
              :name="visibilityStore.valuesHidden ? 'eye-off' : 'eye'"
              :size="18"
            />
          </button>

          <div
            ref="userMenu"
            class="main-layout__user-menu"
          >
            <button
              type="button"
              class="main-layout__user-trigger"
              :class="{ 'main-layout__user-trigger--open': userMenuOpen }"
              @click.stop="toggleUserMenu"
            >
              <div class="main-layout__user-avatar">
                {{ userInitials }}
              </div>
              <span class="main-layout__user-name">
                {{ authStore.user.name }}
              </span>
              <SvgIcon
                name="chevron-down"
                :size="16"
                class="main-layout__user-chevron"
              />
            </button>
            <div
              v-if="userMenuOpen"
              class="main-layout__dropdown"
              @click.stop
            >
              <div class="main-layout__dropdown-header">
                <div class="main-layout__dropdown-user-info">
                  <strong>{{ authStore.user.name }}</strong>
                  <span class="main-layout__user-email">
                    {{ authStore.user.email }}
                  </span>
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
import SidebarDesktop from '@/components/organisms/navigation/SidebarDesktop/index.vue'
import SidebarMobile from '@/components/organisms/navigation/SidebarMobile/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import { useAuthStore } from '@/stores/auth'
import { useVisibilityStore } from '@/stores/visibility'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'MainLayout',
  components: {
    SidebarDesktop,
    SidebarMobile,
    SvgIcon
  },
  props: {
    pageTitle: {
      type: String,
      default: 'Finance'
    }
  },
  setup() {
    const authStore = useAuthStore()
    const visibilityStore = useVisibilityStore()
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
      visibilityStore,
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
  background-color: var(--bg-secondary);
  padding: 0.875rem 1.75rem;
  border-bottom: 1px solid var(--border-subtle);
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
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  color: var(--text-primary);
}

.main-layout__page-title {
  margin: 0;
  font-size: 1.125rem;
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

.main-layout__visibility-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  background: none;
  border: 1px solid transparent;
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.main-layout__visibility-btn:hover {
  background-color: var(--bg-elevated-hover);
  border-color: var(--border-subtle);
  color: var(--text-primary);
}

.main-layout__user-menu {
  position: relative;
}

.main-layout__user-trigger {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0.625rem 0.375rem 0.375rem;
  background: none;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.main-layout__user-trigger:hover,
.main-layout__user-trigger--open {
  background-color: var(--bg-elevated-hover);
  border-color: var(--border-subtle);
}

.main-layout__user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.main-layout__user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: var(--primary-contrast);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
  user-select: none;
}

.main-layout__user-chevron {
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: transform 0.2s;
}

.main-layout__user-trigger--open .main-layout__user-chevron {
  transform: rotate(180deg);
}

.main-layout__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  box-shadow: var(--shadow-elevated);
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
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: var(--primary-contrast);
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
  background: var(--border-subtle);
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
  color: var(--status-danger);
  border-top: 1px solid var(--border-subtle);
}

.main-layout__dropdown-item--logout:hover {
  background: var(--status-danger-bg);
}

.main-layout__content {
  flex: 1;
  padding: 2rem;
  background-color: var(--bg-primary);
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
    background-color: var(--bg-elevated-hover);
    border-radius: 4px;
  }

  .main-layout__content {
    padding: 1rem;
  }

  .main-layout__user-name {
    display: none;
  }

  .main-layout__user-trigger {
    gap: 0;
    padding: 0.25rem;
  }
}
</style>
