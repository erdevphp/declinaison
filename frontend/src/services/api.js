import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,  // ← envoie les cookies automatiquement
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour rafraîchir le token si 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        await api.post('/auth/refresh/')
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token expiré → on laisse l'erreur, le composant gérera la redirection
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api