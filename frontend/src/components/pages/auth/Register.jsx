import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginStart, loginSuccess, loginFailure } from '../../../store/slices/authSlice'
import { authService } from '../../../services/authService'
import logo from '../../../assets/logos/logos_declinaison.png'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    dispatch(loginStart())

    try {
      const data = await authService.register(email, first_name, last_name, phone, password, password2)
      dispatch(loginSuccess(data.user))
      navigate('/')
    } catch (err) {
      const message =
        err.response?.data?.email ||
        err.response?.data?.first_name ||
        err.response?.data?.last_name ||
        err.response?.data?.phone ||
        err.response?.data?.password ||
        'Une erreur est survenue'
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
          <p className="text-gray-500 dark:text-gray-400 mt-2">Inscription</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className='flex justify-between items-center gap-2'>
            <div>
              <label htmlFor='email' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                id='email'
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor='phone' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone
              </label>
              <input
                type="text"
                value={phone}
                id='phone'
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
                autoFocus
              />
            </div>
          </div>


          <div className='flex justify-between items-center gap-2'>
            <div>
              <label htmlFor='last_name' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={last_name}
                id='last_name'
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"

              />
            </div>
            <div>
              <label htmlFor='first_name' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prénom
              </label>
              <input
                type="text"
                value={first_name}
                id='first_name'
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className='flex justify-between items-center gap-2'>
            <div>
              <label htmlFor='password' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                id='password'
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor='password2' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={password2}
                id='password2'
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Se connecter
          </button>
        </form>
        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Register