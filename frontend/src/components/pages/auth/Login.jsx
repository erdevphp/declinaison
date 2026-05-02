import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { loginStart, loginSuccess, loginFailure } from '../../../store/slices/authSlice'
import { authService } from '../../../services/authService'
import logo from '../../../assets/logos/logos_declinaison.png'
import toast from 'react-hot-toast'
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiShield,
  FiArrowRight
} from 'react-icons/fi'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated } = useSelector((state) => state.auth)

  const searchParams = new URLSearchParams(location.search)
  const redirectUrl = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const decodedRedirectUrl = decodeURIComponent(redirectUrl)

  // Remplir l'email si "remember me" a été activé précédemment
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(decodedRedirectUrl, { replace: true })
    }
  }, [isAuthenticated, loading, navigate, decodedRedirectUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    dispatch(loginStart())

    // Gestion du "remember me"
    if (rememberMe) {
      localStorage.setItem('remembered_email', email)
    } else {
      localStorage.removeItem('remembered_email')
    }

    try {
      const data = await authService.login(email, password)
      dispatch(loginSuccess(data.user))
      toast.success(data.message || 'Connexion réussie !')
      navigate(redirectUrl)
    } catch (err) {
      const message = err.response?.data?.error || 'Email ou mot de passe incorrect'
      setError(message)
      dispatch(loginFailure(message))
      toast.error(message)
    }
  }

  return (
    <div className="min-h-[70%] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Carte principale */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Bandeau décoratif */}
          <div className="h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700"></div>

          <div className="px-5 py-6">
            {/* Logo et en-tête */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30"
              >
                {logo ? (
                  <img src={logo} alt="Delta" className="w-20 h-20 object-contain" />
                ) : (
                  <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">D</span>
                  </div>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
              >
                Déclinaison
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 dark:text-gray-400 mt-2 text-sm"
              >
                Connectez-vous à votre espace de travail
              </motion.p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2"
                  >
                    <FiShield className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Champ Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="erdev@declinaison.com"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Options supplémentaires */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Se souvenir de moi</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton de connexion */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-primary-500/30'
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Lien d'inscription */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  Créer un compte
                  <FiArrowRight className="inline-block w-3 h-3 ml-1" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Badge de sécurité */}
        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
            <FiShield className="w-3 h-3" />
            Connexion sécurisée
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login