import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginStart, loginSuccess, loginFailure } from '../../../store/slices/authSlice'
import { authService } from '../../../services/authService'
import logo from '../../../assets/logos/logos_declinaison.png'
import toast from 'react-hot-toast'
import Spinner from '../../Features/Spinner'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    dispatch(loginStart())

    try {
      const data = await authService.login(email, password)
      dispatch(loginSuccess(data.user))
      toast.success(data.message)
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.error || 'Erreur de connexion'
      setError(message)
      dispatch(loginFailure(message))
    }
  }

  return (
    <div className="min-h-[85%] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="Delta" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Déclinaison</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Connexion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            {loading ? (
              <span className='flex justify-center items-center gap-2'>
                <Spinner size="sm" color="white" />
                <span>Connexion...</span>
              </span>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/register" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            Pas encore de compte ? S'inscrire
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login