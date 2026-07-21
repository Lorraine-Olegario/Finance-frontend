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
        <span class="mobile-sidebar__mark">
          <SvgIcon
            name="logo-grid"
            :size="18"
          />
        </span>
        <h2 class="mobile-sidebar__logo">Finance</h2>
      </div>

      <nav class="mobile-sidebar__nav">
        <span class="mobile-sidebar__nav-group-label">Geral</span>
        <router-link
          v-for="item in generalItems"
          :key="item.id"
          :to="item.to"
          class="mobile-sidebar__nav-item"
          :exact-active-class="
            item.exact ? 'mobile-sidebar__nav-item--active' : ''
          "
          :active-class="!item.exact ? 'mobile-sidebar__nav-item--active' : ''"
          @click="handleNavClick"
        >
          <div
            class="mobile-sidebar__nav-icon"
            v-html="item.icon"
          />
          <span class="mobile-sidebar__nav-label">{{ item.label }}</span>
        </router-link>

        <template v-if="adminItems.length > 0">
          <span class="mobile-sidebar__nav-group-label">Administração</span>
          <router-link
            v-for="item in adminItems"
            :key="item.id"
            :to="item.to"
            class="mobile-sidebar__nav-item"
            :exact-active-class="
              item.exact ? 'mobile-sidebar__nav-item--active' : ''
            "
            :active-class="
              !item.exact ? 'mobile-sidebar__nav-item--active' : ''
            "
            @click="handleNavClick"
          >
            <div
              class="mobile-sidebar__nav-icon"
              v-html="item.icon"
            />
            <span class="mobile-sidebar__nav-label">{{ item.label }}</span>
          </router-link>
        </template>
      </nav>
    </aside>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { menuItems } from '@/config/menuItems'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

export default {
  name: 'SidebarMobile',
  components: { SvgIcon },
  setup() {
    const authStore = useAuthStore()

    const generalItems = computed(() =>
      menuItems.filter(item => !item.adminOnly)
    )
    const adminItems = computed(() =>
      authStore.isAdmin ? menuItems.filter(item => item.adminOnly) : []
    )

    return {
      generalItems,
      adminItems
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

<style scoped lang="scss">
@use './styles.module';
</style>
