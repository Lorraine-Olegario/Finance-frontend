<template>
  <aside class="sidebar-desktop">
    <div class="sidebar-desktop__header">
      <span class="sidebar-desktop__mark">
        <SvgIcon
          name="logo-grid"
          :size="16"
        />
      </span>
      <h2 class="sidebar-desktop__logo">Finance</h2>
    </div>

    <nav class="sidebar-desktop__nav">
      <span class="sidebar-desktop__nav-group-label">Geral</span>
      <router-link
        v-for="item in generalItems"
        :key="item.id"
        :to="item.to"
        class="sidebar-desktop__nav-item"
        :exact-active-class="
          item.exact ? 'sidebar-desktop__nav-item--active' : ''
        "
        :active-class="!item.exact ? 'sidebar-desktop__nav-item--active' : ''"
      >
        <div
          class="sidebar-desktop__nav-icon"
          v-html="item.icon"
        />
        <span class="sidebar-desktop__nav-label">{{ item.label }}</span>
      </router-link>

      <template v-if="adminItems.length > 0">
        <span class="sidebar-desktop__nav-group-label">Administração</span>
        <router-link
          v-for="item in adminItems"
          :key="item.id"
          :to="item.to"
          class="sidebar-desktop__nav-item"
          :exact-active-class="
            item.exact ? 'sidebar-desktop__nav-item--active' : ''
          "
          :active-class="!item.exact ? 'sidebar-desktop__nav-item--active' : ''"
        >
          <div
            class="sidebar-desktop__nav-icon"
            v-html="item.icon"
          />
          <span class="sidebar-desktop__nav-label">{{ item.label }}</span>
        </router-link>
      </template>
    </nav>

    <div
      v-if="authStore.user"
      ref="userMenu"
      class="sidebar-desktop__footer"
    >
      <button
        type="button"
        class="sidebar-desktop__user-trigger"
        :class="{ 'sidebar-desktop__user-trigger--open': userMenuOpen }"
        @click.stop="toggleUserMenu"
      >
        <div class="sidebar-desktop__user-avatar">
          {{ userInitials }}
        </div>
        <div class="sidebar-desktop__user-meta">
          <span class="sidebar-desktop__user-name">
            {{ authStore.user.name }}
          </span>
          <span class="sidebar-desktop__user-subtitle">Carteira pessoal</span>
        </div>
        <SvgIcon
          name="chevron-down"
          :size="14"
          class="sidebar-desktop__user-chevron"
        />
      </button>

      <div
        v-if="userMenuOpen"
        class="sidebar-desktop__dropdown"
        @click.stop
      >
        <router-link
          to="/profile"
          class="sidebar-desktop__dropdown-item"
          @click="closeUserMenu"
        >
          <!-- prettier-ignore -->
          <svg class="sidebar-desktop__dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" /> </svg>
          Meu Perfil
        </router-link>
        <button
          class="sidebar-desktop__dropdown-item sidebar-desktop__dropdown-item--logout"
          @click="handleLogout"
        >
          <!-- prettier-ignore -->
          <svg class="sidebar-desktop__dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /> <polyline points="16 17 21 12 16 7" /> <line x1="21" y1="12" x2="9" y2="12" /> </svg>
          Sair
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { menuItems } from '@/config/menuItems'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

export default {
  name: 'SidebarDesktop',
  components: { SvgIcon },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const generalItems = computed(() =>
      menuItems.filter(item => !item.adminOnly)
    )
    const adminItems = computed(() =>
      authStore.isAdmin ? menuItems.filter(item => item.adminOnly) : []
    )
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
      router,
      generalItems,
      adminItems,
      userInitials
    }
  },
  data() {
    return {
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

<style scoped lang="scss">
@use './styles.module';
</style>
