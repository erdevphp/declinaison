import { useSelector } from 'react-redux'
import { useState } from 'react'
import Sidebar from './_partials/Sidebar'
import Header from './_partials/Header'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { motion, AnimatePresence } from 'framer-motion'

const Layout = ({ children }) => {
  const { sidebarPosition, sidebarOpen: desktopSidebarOpen } = useSelector((state) => state.ui)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Sur desktop, le sidebar est soit dans le flux (si ouvert) soit masqué
  if (!isMobile) {
    if (!desktopSidebarOpen) {
      // Sidebar fermé sur desktop : full width
      return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header onMenuClick={() => { }} isMobile={false} />
          <main className="flex-1 px-6 py-2">{children}</main>
        </div>
      )
    }

    const isLeft = sidebarPosition === 'left'
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className={`${isLeft ? 'order-1' : 'order-2'} shrink-0 w-65 z-60`}>
          <Sidebar />
        </div>
        <div className={`flex flex-col flex-1 ${isLeft ? 'order-2' : 'order-1'}`}>
          <Header onMenuClick={() => { }} isMobile={false} />
          <main className="flex-1 px-6 py-2 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    )
  }

  // Mode mobile : sidebar n'est jamais dans le flux, c'est un drawer overlay
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={() => setIsDrawerOpen(true)} isMobile={true} />
      <main className="flex-1 px-6 py-2">{children}</main>

      {/* Drawer overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Fond obscur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsDrawerOpen(false)}
            />
            {/* Sidebar glissante */}
            <motion.aside
              initial={{ x: sidebarPosition === 'left' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: sidebarPosition === 'left' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`fixed top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto ${sidebarPosition === 'left' ? 'left-0' : 'right-0'
                }`}
            >
              <div className="p-4 border-b dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>
              <Sidebar closeDrawer={() => setIsDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Layout