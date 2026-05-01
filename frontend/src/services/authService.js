import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password })
    return response.data
  },

  register: async (email, first_name, last_name, phone, password, password2) => {
    const response = await api.post('/auth/register/', { email, first_name, last_name, phone, password, password2 })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout/')
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me/')
    return response.data
  },
}