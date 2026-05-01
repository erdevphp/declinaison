import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './Layout/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Composant pour les routes privées
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
          />
          <Route path="/register" element={<Register />} />

          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Route path="/clients" element={<div className="p-6 text-gray-900 dark:text-white">Page Clients</div>} />
                <Route path="/factures" element={<div className="p-6 text-gray-900 dark:text-white">Page Factures</div>} />
                <Route path="/produits" element={<div className="p-6 text-gray-900 dark:text-white">Page Produits</div>} />
                <Route path="/commandes" element={<div className="p-6 text-gray-900 dark:text-white">Page Commandes</div>} />
                <Route path="/shapefile" element={<div className="p-6 text-gray-900 dark:text-white">Shapefile</div>} />
                <Route path="/settings" element={<div className="p-6 text-gray-900 dark:text-white">Paramètres</div>} />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App