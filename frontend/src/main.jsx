import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store/index'
import { authService } from './services/authService'
import { setUser } from './store/slices/authSlice'
import App from './components/App'
import './assets/css/index.css'

// Vérifier l'authentification au démarrage
const loadUser = async () => {
  try {
    const user = await authService.getMe()
    store.dispatch(setUser(user))
  } catch (error) {
    // Non authentifié, ne rien faire
    console.error("Utilisateur non authentifié", error)
  }
}
loadUser()

// Appliquer le thème sombre au démarrage si nécessaire
if (store.getState().ui.darkMode) {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)