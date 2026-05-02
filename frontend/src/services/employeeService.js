import api from './api'

export const employeeService = {
  lists: async () => {
    const response = await api.get('/employee/list/')
    return response.data
  },
    // Mettre à jour le profil
  updateProfile: async (userData) => {
    const response = await api.put('/employee/profile/update/', userData)
    return response.data
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    const response = await api.post('/employee/profile/change-password/', passwordData)
    return response.data
  },
}