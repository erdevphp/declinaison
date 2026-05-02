import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { employeeService } from "../../../services/employeeService"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FiUsers,
  FiMail,
  FiCalendar,
  FiBriefcase,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiUserPlus,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye
} from 'react-icons/fi'

const EmployeeList = () => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedRole, setSelectedRole] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)

  const getEmployeesList = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await employeeService.lists()
      setEmployees(data)
      setFilteredEmployees(data)
    } catch (err) {
      const message = err.response?.data?.error || 'Erreur de connexion'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEmployeesList()
  }, [])

  // Filtrage et recherche
  useEffect(() => {
    let result = [...employees]

    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(emp =>
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par rôle
    if (selectedRole !== 'all') {
      result = result.filter(emp => emp.role === selectedRole)
    }

    setFilteredEmployees(result)
    setCurrentPage(1)
  }, [searchTerm, selectedRole, employees])

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)

  // Rôles uniques pour le filtre
  const uniqueRoles = [...new Set(employees.map(emp => emp.role).filter(Boolean))]

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      manager: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      employee: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
    return colors[role?.toLowerCase()] || colors.default
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Chargement des employés...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des employés</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez les comptes utilisateurs et leurs permissions</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total employés" value={employees.length} icon={FiUsers} color="blue" />
        <StatCard title="Actifs" value={employees.filter(e => e.is_active !== false).length} icon={FiUsers} color="green" />
        <StatCard title="Rôles distincts" value={uniqueRoles.length} icon={FiBriefcase} color="purple" />
        <StatCard title="Nouveaux (30j)" value={employees.filter(e => {
          const days = (new Date() - new Date(e.date_joined)) / (1000 * 60 * 60 * 24)
          return days <= 30
        }).length} icon={FiCalendar} color="orange" />
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              Filtres
              {selectedRole !== 'all' && (
                <span className="ml-1 w-2 h-2 bg-primary-500 rounded-full"></span>
              )}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-sm">
              <FiUserPlus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Panneau de filtres */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedRole('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedRole === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Tous
                </button>
                {uniqueRoles.map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedRole === role
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tableau des employés */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 mx-4 mt-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Employé</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rôle</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date d'ajout</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentEmployees.length > 0 ? (
                  currentEmployees.map((employee, idx) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">
                              {employee.first_name?.[0]}{employee.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {employee.first_name} {employee.last_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {employee.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FiMail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{employee.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(employee.role)}`}>
                          {employee.role_label || employee.role || 'Non défini'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {format(new Date(employee.date_joined), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="relative">
                          <button
                            onClick={() => setMenuOpen(menuOpen === employee.id ? null : employee.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <FiMoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </button>
                          <AnimatePresence>
                            {menuOpen === employee.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10"
                              >
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                  <FiEye className="w-4 h-4" />
                                  Voir
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                  <FiEdit2 className="w-4 h-4" />
                                  Modifier
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <FiTrash2 className="w-4 h-4" />
                                  Supprimer
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">Aucun employé trouvé</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          {searchTerm ? 'Essayez une autre recherche' : 'Ajoutez votre premier employé'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredEmployees.length)} sur {filteredEmployees.length}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeList