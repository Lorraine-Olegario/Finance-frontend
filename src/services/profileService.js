import api from './api'

const profileService = {
  /**
   * Atualizar nome e e-mail do usuário autenticado
   * @param {{ name: string, email: string }} data
   */
  updateProfile(data) {
    return api.put('/user/profile', data)
  },

  /**
   * Alterar senha do usuário autenticado
   * @param {{ current_password: string, new_password: string, new_password_confirmation: string }} data
   */
  updatePassword(data) {
    return api.put('/user/password', data)
  }
}

export default profileService
