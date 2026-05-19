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

<style scoped lang="scss">
@use './styles.module';
</style>
