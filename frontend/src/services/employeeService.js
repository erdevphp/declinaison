import api from './api'

export const employeeService = {
  lists: async () => {
    const response = await api.get('/employee/list/')
    return response.data
  },

  // Mettre à jour le profil
  updateProfile: async (userData) => {
    // Utiliser FormData pour les images
    const formData = new FormData()

    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && userData[key] !== null) {
        formData.append(key, userData[key])
      }
    })

    const response = await api.patch('/employee/profile/update/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    const response = await api.post('/employee/profile/change-password/', passwordData)
    return response.data
  },
}