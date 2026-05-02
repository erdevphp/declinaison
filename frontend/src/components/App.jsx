import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './Layout/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import EmployeeList from './pages/employee/EmployeeList'
import Settings from './pages/settings/Settings'
import Timesheet from './pages/timesheet/Timesheet'
import Planning from './pages/Planning'
import Profile from './pages/Profile'
import ShapefileManager from './pages/ShapefileManager'

// Composant pour les routes privées
const PrivateRoute = ({ children }) => {
  const location = useLocation()
  const { isAuthenticated } = useSelector((state) => state.auth)
  return isAuthenticated ? children : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
}

function App() {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route path="/register" element={<Register />} />

          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route path="/employee" element={<EmployeeList />} />
                  <Route path="/timesheet" element={<Timesheet />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/shapefile" element={<ShapefileManager />} />
                  <Route path="/produits" element={<div className="p-6 text-gray-900 dark:text-white">Page Produits</div>} />
                  <Route path="/commandes" element={<div className="p-6 text-gray-900 dark:text-white">Page Commandes</div>} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App