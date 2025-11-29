import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Users from '../views/Users.vue'
import Assets from '../views/Assets.vue'
import Quotes from '../views/Quotes.vue'
import History from '../views/History.vue'
import ObservedAssets from '../views/ObservedAssets.vue'
import UserProfile from '../views/UserProfile.vue'
import Categories from '../views/Categories.vue'

const routes = [
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login if not authenticated
      next({ name: 'Login' })
      return
    }
    
    // Check if route requires admin role
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      // Redirect to dashboard if not admin
      next({ name: 'Dashboard' })
      return
    }
  }
  
  // Redirect to dashboard if trying to access login while authenticated
  if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }
  
  next()
})

export default router
