import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { updateUser } from '../../store/slices/authSlice'
import { employeeService } from '../../services/employeeService'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PencilSquareIcon,
  CameraIcon,
} from '@heroicons/react/24/outline'
import { 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign,
  FiActivity,
  FiEdit2
} from 'react-icons/fi'

const ProfileStats = () => {
  const stats = [
    { label: 'Clients gérés', value: '128', icon: FiUsers, color: 'blue' },
    { label: 'Commandes', value: '342', icon: FiShoppingBag, color: 'green' },
    { label: 'CA généré', value: '45.2k €', icon: FiDollarSign, color: 'purple' },
    { label: 'Taux activité', value: '94%', icon: FiActivity, color: 'orange' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const ProfileInfo = ({ user, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const infoSections = [
    { icon: UserIcon, label: 'Nom complet', value: user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Non renseigné' },
    { icon: EnvelopeIcon, label: 'Email', value: user?.email || 'Non renseigné' },
    { icon: PhoneIcon, label: 'Téléphone', value: user?.phone || 'Non renseigné' },
    { icon: BuildingOfficeIcon, label: 'Rôle', value: user?.role_label || user?.role || 'Non renseigné' },
    { icon: CalendarIcon, label: 'Membre depuis', value: formatDate(user?.date_joined) },
    { icon: MapPinIcon, label: 'Localisation', value: user?.location || 'Non renseigné' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Informations personnelles</h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
        >
          <FiEdit2 className="w-4 h-4" />
          Modifier
        </button>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoSections.map((section, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <section.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{section.label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{section.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ProfileActivity = () => {
  const activities = [
    { id: 1, action: 'Connexion au système', time: 'Il y a 5 minutes', ip: '192.168.1.1' },
    { id: 2, action: 'Modification du profil', time: 'Il y a 2 heures', ip: '192.168.1.1' },
    { id: 3, action: 'Export de la liste clients', time: 'Hier à 14h32', ip: '192.168.1.1' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activité récente</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                  <span className="text-xs text-gray-400">IP: {activity.ip}</span>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    location: user?.location || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const updatedUser = await employeeService.updateProfile(formData)
      onSave(updatedUser)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Modifier le profil</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            L'email n'est pas modifiable
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">L'email ne peut pas être modifié</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Localisation</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: Paris, France"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// Composant principal Profile
const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const profileInputRef = useRef(null)
  const coverInputRef = useRef(null)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  const handleSave = (updatedUser) => {
    dispatch(updateUser(updatedUser))
  }

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('profile_picture', file)

    try {
      const updatedUser = await employeeService.updateProfile({ profile_picture: file })
      dispatch(updateUser(updatedUser))
    } catch (err) {
      console.error('Erreur upload profil', err)
    }
  }

  const handleCoverPictureUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const updatedUser = await employeeService.updateProfile({ cover_picture: file })
      dispatch(updateUser(updatedUser))
    } catch (err) {
      console.error('Erreur upload cover', err)
    }
  }

  const getInitials = () => {
    const first = user?.first_name?.charAt(0) || ''
    const last = user?.last_name?.charAt(0) || ''
    return `${first}${last}`.toUpperCase() || 'U'
  }

  const getFullName = () => {
    return user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Utilisateur'
  }

  const profilePictureUrl = user?.profile_picture
    ? `http://localhost:8000${user.profile_picture}`
    : null

  const coverPictureUrl = user?.cover_picture
    ? `http://localhost:8000${user.cover_picture}`
    : null

  return (
    <div className="space-y-6">
      {/* En-tête avec cover et avatar */}
      <div className="relative">
        {/* Cover image */}
        <div className="relative h-48 rounded-xl overflow-hidden mb-4">
          {coverPictureUrl ? (
            <img src={coverPictureUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-700"></div>
          )}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute z-90 bottom-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
          >
            <CameraIcon className="w-5 h-5" />
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverPictureUpload}
            className="hidden"
          />
        </div>
        
        {/* Avatar section */}
        <div className="px-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-xl object-cover border-4 border-white dark:border-gray-900 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-lg">
                  <span className="text-3xl font-bold text-white">{getInitials()}</span>
                </div>
              )}
              <button
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <CameraIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
              </button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getFullName()}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {user?.role_label || user?.role || 'Utilisateur'}
              </p>
            </div>
            <div className="pb-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Modifier le profil
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="px-6">
        <ProfileStats />
      </div>
      
      {/* Grille info et activité */}
      <div className="px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileInfo user={user} onEdit={() => setIsEditModalOpen(true)} />
        </div>
        <div>
          <ProfileActivity />
        </div>
      </div>
      
      {/* Modal d'édition */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSave}
      />
    </div>
  )
}

export default Profile