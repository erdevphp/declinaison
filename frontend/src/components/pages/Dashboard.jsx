import { motion } from 'framer-motion'
import { 
  FiDollarSign, FiUsers, FiShoppingCart, FiPackage,
  FiTrendingUp, FiTrendingDown
} from 'react-icons/fi'

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' ? 
              <FiTrendingUp className="text-green-500 w-4 h-4" /> : 
              <FiTrendingDown className="text-red-500 w-4 h-4" />
            }
            <span className={`text-xs ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
)

const Dashboard = () => {
  const stats = [
    { title: 'Chiffre d\'affaires', value: '45 231 €', icon: FiDollarSign, trend: 'up', trendValue: '+12.5%', color: 'bg-blue-500' },
    { title: 'Clients', value: '2 345', icon: FiUsers, trend: 'up', trendValue: '+8.2%', color: 'bg-green-500' },
    { title: 'Commandes', value: '456', icon: FiShoppingCart, trend: 'down', trendValue: '-3.1%', color: 'bg-orange-500' },
    { title: 'Produits', value: '1 234', icon: FiPackage, trend: 'up', trendValue: '+5.4%', color: 'bg-purple-500' },
  ]

  const recentActivities = [
    { id: 1, action: 'Nouvelle commande #1234', user: 'Jean Dupont', amount: '1 234 €', time: 'Il y a 5 min' },
    { id: 2, action: 'Facture #5678 payée', user: 'Marie Martin', amount: '567 €', time: 'Il y a 1h' },
    { id: 3, action: 'Nouveau client inscrit', user: 'Pierre Durand', amount: '-', time: 'Il y a 2h' },
    { id: 4, action: 'Stock réapprovisionné', user: 'Système', amount: '12 produits', time: 'Il y a 3h' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Bienvenue dans votre espace de gestion</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activités récentes</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">par {activity.user}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.amount}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commandes récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">N° commande</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Client</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Montant</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Statut</th>
                 </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-sm text-gray-900 dark:text-white">#1234</td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Jean Dupont</td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">1 234 €</td>
                  <td className="py-3"><span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">En attente</span></td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-sm text-gray-900 dark:text-white">#1233</td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Marie Martin</td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">567 €</td>
                  <td className="py-3"><span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">Payée</span></td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-sm text-gray-900 dark:text-white">#1232</td>
                  <td className="py-3 text-sm text-gray-600 dark:text-gray-300">Pierre Durand</td>
                  <td className="py-3 text-sm text-gray-900 dark:text-white">890 €</td>
                  <td className="py-3"><span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">Expédiée</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard