<template>
  <MainLayout page-title="Usuários">
    <div class="users-page">
      <div class="page-header">
        <h2>Gerenciar Usuários</h2>
        <button @click="showCreateForm = true">+ Novo Usuário</button>
      </div>

      <!-- Create/Edit Form Modal -->
      <div v-if="showCreateForm" class="modal-overlay" @click.self="closeForm">
        <div class="modal card">
          <h3>{{ editingUser ? 'Editar Usuário' : 'Novo Usuário' }}</h3>
          
          <form @submit.prevent="saveUser">
            <div class="form-group">
              <label>Nome</label>
              <input v-model="formData.name" type="text" required />
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input v-model="formData.email" type="email" required />
            </div>
            
            <div v-if="!editingUser" class="form-group">
              <label>Senha</label>
              <input v-model="formData.password" type="password" required />
            </div>
            
            <div v-if="!editingUser" class="form-group">
              <label>Confirmar Senha</label>
              <input v-model="formData.password_confirmation" type="password" required />
            </div>
            
            <div v-if="editingUser" class="form-group">
              <label>Status</label>
              <select v-model.number="formData.status">
                <option :value="1">Ativo</option>
                <option :value="0">Inativo</option>
              </select>
            </div>
            
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">{{ success }}</div>
            
            <div class="form-actions">
              <button type="button" class="secondary" @click="closeForm">Cancelar</button>
              <button type="submit" :disabled="loading">
                {{ loading ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Users List -->
      <div class="card">
        <!-- Search Bar -->
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por nome ou email..."
            class="search-input"
          />
        </div>
        
        <div v-if="loading && !users.length" class="loading">
          <div class="spinner"></div>
        </div>
        
        <table v-else-if="filteredUsers.length">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['status-badge', user.status ? 'active' : 'inactive']">
                  {{ user.status ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td>
                <button class="btn-small secondary" @click="editUser(user)">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-else class="empty-state">
          <p>{{ searchQuery ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado' }}</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '../components/MainLayout.vue'
import userService from '../services/userService'

export default {
  name: 'Users',
  components: {
    MainLayout
  },
  data() {
    return {
      users: [],
      searchQuery: '',
      showCreateForm: false,
      editingUser: null,
      formData: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        status: 1
      },
      loading: false,
      error: '',
      success: ''
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) {
        return this.users
      }
      
      const query = this.searchQuery.toLowerCase()
      return this.users.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        const response = await userService.getUsers()
        this.users = response.data
      } catch (err) {
        this.error = 'Erro ao carregar usuários'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    
    editUser(user) {
      this.editingUser = user
      this.formData = {
        name: user.name,
        email: user.email,
        status: user.status || 1
      }
      this.showCreateForm = true
    },
    
    async saveUser() {
      this.loading = true
      this.error = ''
      this.success = ''
      
      try {
        if (this.editingUser) {
          await userService.updateUser(this.editingUser.id, { status: this.formData.status })
          this.success = 'Usuário atualizado com sucesso'
        } else {
          await userService.createUser(this.formData)
          this.success = 'Usuário criado com sucesso'
        }
        
        await this.fetchUsers()
        setTimeout(() => this.closeForm(), 1500)
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao salvar usuário'
      } finally {
        this.loading = false
      }
    },
    
    closeForm() {
      this.showCreateForm = false
      this.editingUser = null
      this.formData = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        status: 1
      }
      this.error = ''
      this.success = ''
    }
  },
  mounted() {
    this.fetchUsers()
  }
}
</script>

<style scoped>
.users-page {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.search-bar {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal {
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h3 {
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: rgba(0, 200, 83, 0.1);
  color: var(--success);
}

.status-badge.inactive {
  background-color: rgba(176, 0, 32, 0.1);
  color: var(--error);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  table {
    font-size: 0.85rem;
  }
}
</style>
