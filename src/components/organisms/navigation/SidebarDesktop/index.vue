<template>
  <aside class="sidebar-desktop">
    <div class="sidebar-desktop__header">
      <span class="sidebar-desktop__mark">
        <SvgIcon
          name="logo-grid"
          :size="18"
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
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { menuItems } from '@/config/menuItems'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'

export default {
  name: 'SidebarDesktop',
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
  }
}
</script>

<style scoped lang="scss">
@use './styles.module';
</style>
