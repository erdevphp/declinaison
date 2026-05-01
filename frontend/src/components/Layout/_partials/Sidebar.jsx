import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSidebarPosition } from '../../../store/slices/uiSlice'
import {
  FiHome, FiUsers, FiFileText, FiPackage,
  FiShoppingCart, FiSettings, FiAlignLeft, FiAlignRight,
  FiBarChart2, FiCreditCard,
  FiLogIn,
  FiAtSign
} from 'react-icons/fi'
import logo from '../../../assets/logos/logos_declinaison.png'

let menuItems = []

const Sidebar = ({ closeDrawer }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { sidebarPosition } = useSelector((state) => state.ui)

  if (user) {
    menuItems = [
      { path: '/', name: 'Tableau de bord', icon: FiHome },
      { path: '/clients', name: 'Clients', icon: FiUsers },
      { path: '/factures', name: 'Factures', icon: FiFileText },
      { path: '/produits', name: 'Produits', icon: FiPackage },
      { path: '/commandes', name: 'Commandes', icon: FiShoppingCart },
      { path: '/statistiques', name: 'Statistiques', icon: FiBarChart2 },
      { path: '/shapefile', name: 'Shapefile', icon: FiCreditCard },
      { path: '/settings', name: 'Paramètres', icon: FiSettings },
    ]
  } else {
    menuItems = [
      { path: '/', name: 'Accueil', icon: FiHome },
      { path: '/login', name: 'Connexion', icon: FiLogIn },
      { path: '/register', name: 'Inscription', icon: FiAtSign },
    ]
  }

  const handleLinkClick = () => {
    if (closeDrawer) closeDrawer()
  }

  return (
    <nav className="h-full flex flex-col">
      <div className="px-4 mb-2">
        <div className="flex items-center justify-between rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center">
              <img src={logo} alt="Delta" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Déclinaison</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">ERP v1.0</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(setSidebarPosition(sidebarPosition === 'left' ? 'right' : 'left'))}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={sidebarPosition === 'left' ? "Déplacer à droite" : "Déplacer à gauche"}
          >
            {sidebarPosition === 'left' ?
              <FiAlignRight className="w-4 h-4 text-gray-600 dark:text-gray-300" /> :
              <FiAlignLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            }
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-primary-600 text-white shadow-md dark:bg-primary-500 dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Sidebar