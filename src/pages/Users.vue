<template>
  <MainLayout page-title="Usuários">
    <div class="users-page">
      <PageHeader
        title="Gerenciar Usuários"
        subtitle="Administre os usuários da plataforma"
      >
        <template #actions>
          <BaseButton
            variant="primary"
            @click="openCreateModal"
          >
            <template #icon-left>
              <SvgIcon
                name="plus"
                :size="16"
              />
            </template>
            Novo Usuário
          </BaseButton>
        </template>
      </PageHeader>

      <!-- Users Card -->
      <div class="users-page__card">
        <!-- Search -->
        <div class="users-page__search">
          <SearchBar
            v-model="searchQuery"
            placeholder="Buscar por nome ou e-mail..."
          />
        </div>

        <!-- Loading -->
        <div
          v-if="loading && !users.length"
          class="users-page__loading"
        >
          <LoadingSpinner />
        </div>

        <!-- Global fetch error -->
        <AlertMessage
          v-else-if="fetchError"
          type="error"
          :message="fetchError"
          class="users-page__fetch-error"
        />

        <!-- Table -->
        <div
          v-else-if="filteredUsers.length"
          class="users-page__table-wrap"
        >
          <table class="users-page__table">
            <thead>
              <tr class="users-page__head-row">
                <th class="users-page__th">Nome</th>
                <th class="users-page__th">E-mail</th>
                <th class="users-page__th">Perfil</th>
                <th class="users-page__th">Status</th>
                <th class="users-page__th users-page__th--actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="users-page__row"
              >
                <td class="users-page__td">
                  {{ user.name }}
                </td>
                <td class="users-page__td users-page__td--email">
                  {{ user.email }}
                </td>
                <td class="users-page__td">
                  <span
                    :class="[
                      'users-page__role-badge',
                      `users-page__role-badge--${user.role ?? 'user'}`
                    ]"
                  >
                    {{ ROLE_LABELS[user.role] ?? 'Usuário' }}
                  </span>
                </td>
                <td class="users-page__td">
                  <span
                    :class="[
                      'users-page__status-badge',
                      `users-page__status-badge--${getStatusModifier(user.status)}`
                    ]"
                  >
                    {{ getStatusLabel(user.status) }}
                  </span>
                </td>
                <td class="users-page__td users-page__td--actions">
                  <div class="users-page__actions">
                    <ActionButton
                      variant="edit"
                      title="Editar usuário"
                      @click="openEditModal(user)"
                    >
                      <SvgIcon
                        name="edit"
                        :size="16"
                      />
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      title="Excluir usuário"
                      @click="openDeleteModal(user)"
                    >
                      <SvgIcon
                        name="trash"
                        :size="16"
                      />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!loading"
          class="users-page__empty"
        >
          <EmptyState
            :title="
              searchQuery
                ? 'Nenhum resultado encontrado'
                : 'Nenhum usuário cadastrado'
            "
            :description="
              searchQuery
                ? 'Tente buscar por outro nome ou e-mail.'
                : 'Clique em &quot;Novo Usuário&quot; para cadastrar o primeiro usuário.'
            "
          >
            <template #icon>
              <SvgIcon
                name="users"
                :size="64"
              />
            </template>
            <template
              v-if="!searchQuery"
              #action
            >
              <BaseButton
                variant="primary"
                @click="openCreateModal"
              >
                <template #icon-left>
                  <SvgIcon
                    name="plus"
                    :size="16"
                  />
                </template>
                Novo Usuário
              </BaseButton>
            </template>
          </EmptyState>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalUsers > serverPerPage"
          class="users-page__pagination"
        >
          <Pagination
            :current-page="currentPage"
            :last-page="lastPage"
            :total="totalUsers"
            :per-page="serverPerPage"
            :show-page-info="true"
            @page-change="handlePageChange"
          />
        </div>
      </div>

      <!-- User Form Modal (create / edit) -->
      <UserFormModal
        :is-open="formModalOpen"
        :user="editingUser"
        :loading="formLoading"
        :error="formError"
        @close="closeFormModal"
        @submit="handleFormSubmit"
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmationModal
        :is-open="deleteModalOpen"
        type="danger"
        title="Excluir Usuário"
        :message="
          userToDelete
            ? `Tem certeza que deseja excluir o usuário ${userToDelete.name}?`
            : ''
        "
        warning-message="Esta ação não pode ser desfeita."
        confirm-text="Excluir"
        loading-text="Excluindo..."
        @close="closeDeleteModal"
        @confirm="handleDeleteConfirm"
      />
    </div>
  </MainLayout>
</template>

<script setup>
// ── Imports ───────────────────────────────────────────────────────────────────
import { ref, computed, watch, onMounted } from 'vue'
import MainLayout from '@/components/templates/MainLayout.vue'
import PageHeader from '@/components/molecules/PageHeader/index.vue'
import SearchBar from '@/components/molecules/SearchBar/index.vue'
import BaseButton from '@/components/atoms/BaseButton/index.vue'
import ActionButton from '@/components/atoms/ActionButton/index.vue'
import AlertMessage from '@/components/atoms/AlertMessage/index.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner/index.vue'
import EmptyState from '@/components/atoms/EmptyState/index.vue'
import Pagination from '@/components/atoms/Pagination/index.vue'
import SvgIcon from '@/components/atoms/SvgIcon/index.vue'
import UserFormModal from '@/components/organisms/users/UserFormModal/index.vue'
import ConfirmationModal from '@/components/organisms/ConfirmationModal/index.vue'
import userService from '@/services/userService'
import { useAuthStore } from '@/stores/auth'

// ── State ─────────────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const PER_PAGE = 15

const ROLE_LABELS = {
  user: 'Usuário',
  admin: 'Administrador'
}

const users = ref([])
const searchQuery = ref('')
const loading = ref(false)
const fetchError = ref('')
const currentPage = ref(1)
const totalUsers = ref(0)
const serverLastPage = ref(1)
const serverPerPage = ref(PER_PAGE)

const formModalOpen = ref(false)
const editingUser = ref(null)
const formLoading = ref(false)
const formError = ref('')

const deleteModalOpen = ref(false)
const userToDelete = ref(null)

// ── Computed ──────────────────────────────────────────────────────────────────
// When backend provides paginated results, `users` already contains the current page.
const filteredUsers = computed(() => users.value)
const lastPage = computed(() => Math.max(1, serverLastPage.value))
const paginatedUsers = computed(() => users.value)

// ── Watchers ──────────────────────────────────────────────────────────────────
watch(searchQuery, () => {
  currentPage.value = 1
  loadUsers()
})

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(loadUsers)

// ── Functions ─────────────────────────────────────────────────────────────────
async function fetchUsers(page = 1) {
  const params = {
    page,
    per_page: PER_PAGE
  }
  if (searchQuery.value.trim()) params.q = searchQuery.value.trim()

  const response = await userService.getUsers(params)

  users.value = response.data.data || []
  totalUsers.value = response.data.total ?? users.value.length
  serverLastPage.value = response.data.last_page ?? 1
  serverPerPage.value = response.data.per_page ?? PER_PAGE
  currentPage.value = response.data.current_page ?? page
}

async function loadUsers() {
  if (!authStore.user?.id) return
  loading.value = true
  fetchError.value = ''
  try {
    await fetchUsers(currentPage.value)
  } catch (err) {
    console.error('[Users] Erro ao carregar usuários:', err)
    fetchError.value = 'Erro ao carregar usuários. Tente novamente.'
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingUser.value = null
  formError.value = ''
  formModalOpen.value = true
}

function openEditModal(user) {
  editingUser.value = user
  formError.value = ''
  formModalOpen.value = true
}

function closeFormModal() {
  formModalOpen.value = false
  editingUser.value = null
  formError.value = ''
  formLoading.value = false
}

function openDeleteModal(user) {
  userToDelete.value = user
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  userToDelete.value = null
}

function getStatusLabel(status) {
  if (status == null) return ''
  if (typeof status === 'object')
    return status.label ?? String(status.value ?? '')
  if (status === 1 || status === '1') return 'Ativo'
  if (status === 0 || status === '0') return 'Inativo'
  return String(status)
}

function getStatusModifier(status) {
  if (status == null) return 'unknown'
  if (typeof status === 'object')
    return status.value == 1 ? 'active' : 'inactive'
  if (status === 1 || status === '1') return 'active'
  if (status === 0 || status === '0') return 'inactive'
  return 'unknown'
}

async function handleFormSubmit(formData) {
  formLoading.value = true
  formError.value = ''
  try {
    if (editingUser.value) {
      await userService.updateUser(editingUser.value.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role
      })
    } else {
      await userService.createUser(formData)
    }
    await fetchUsers(currentPage.value)
    closeFormModal()
  } catch (err) {
    console.error('[Users] Erro ao salvar usuário:', err)
    formError.value = err.response?.data?.message ?? 'Erro ao salvar usuário'
  } finally {
    formLoading.value = false
  }
}

async function handleDeleteConfirm({ resolve, reject }) {
  try {
    await userService.deleteUser(userToDelete.value.id)
    await fetchUsers(currentPage.value)
    userToDelete.value = null
    resolve()
  } catch (err) {
    console.error('[Users] Erro ao excluir usuário:', err)
    reject(new Error(err.response?.data?.message ?? 'Erro ao excluir usuário'))
  }
}

function handlePageChange(page) {
  if (page === currentPage.value) return
  fetchUsers(page)
}
</script>

<style scoped>
/* Card */
.users-page__card {
  background: var(--bg-primary);
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Search */
.users-page__search {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

/* Loading */
.users-page__loading {
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
}

/* Fetch error */
.users-page__fetch-error {
  margin: 1.5rem;
}

/* Table */
.users-page__table-wrap {
  overflow-x: auto;
}

.users-page__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.users-page__head-row {
  background: var(--bg-secondary);
}

.users-page__th {
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.users-page__th--actions {
  text-align: right;
}

.users-page__row {
  transition: background 0.15s;
}

.users-page__row:not(:last-child) {
  border-bottom: 1px solid var(--border);
}

.users-page__row:hover {
  background: var(--bg-secondary);
}

.users-page__td {
  padding: 1rem 1.25rem;
  color: var(--text-primary);
  vertical-align: middle;
}

.users-page__td--email {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.users-page__td--actions {
  text-align: right;
}

/* Role badge */
.users-page__role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.users-page__role-badge--admin {
  background: var(--primary-muted);
  color: var(--primary);
  border: 1px solid var(--primary-muted);
}

.users-page__role-badge--user {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

/* Status badge */
.users-page__status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid transparent;
}

.users-page__status-badge--active {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border-color: rgba(34, 197, 94, 0.2);
}

.users-page__status-badge--inactive {
  background: rgba(220, 38, 38, 0.06);
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.12);
}

.users-page__status-badge--unknown {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-color: var(--border);
}

/* Actions */
.users-page__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Empty state */
.users-page__empty {
  padding: 2rem;
}

/* Pagination */
.users-page__pagination {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--bg-secondary);
}

@media (max-width: 768px) {
  .users-page__th--email,
  .users-page__td--email {
    display: none;
  }
}
</style>
