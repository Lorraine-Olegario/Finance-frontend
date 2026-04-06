import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import DesignSystem from '../pages/DesignSystem/index.vue'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Users from '../pages/Users.vue'
import Assets from '../pages/Assets.vue'
import Quotes from '../pages/Quotes.vue'
import History from '../pages/History.vue'
import ObservedAssets from '../pages/ObservedAssets.vue'
import UserProfile from '../pages/UserProfile.vue'
import Categories from '../pages/Categories.vue'
import Settings from '../pages/Settings.vue'

const routes = [
  {
    path: '/design-system',
    name: 'DesignSystem',
    component: DesignSystem,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/my-assets',
    name: 'Assets',
    component: Assets,
    meta: { requiresAuth: true }
  },
  {
    path: '/observed',
    name: 'ObservedAssets',
    component: ObservedAssets,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/quotes',
    name: 'Quotes',
    component: Quotes,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Login' })
      return
    }

    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      next({ name: 'Dashboard' })
      return
    }
  }

  if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router
