import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { setFokontanyList, setLoading, setError } from '../../../store/slices/shapefileSlice'
import shapefileService from '../../../services/shapefileService'
import { FiList, FiSearch, FiDownload } from 'react-icons/fi'

const FokontanyList = () => {
  const dispatch = useDispatch()
  const {
    selectedRegion,
    selectedDistrict,
    selectedCommune,
    fokontanyList,
    loading,
  } = useSelector((state) => state.shapefile)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showExportConfirm, setShowExportConfirm] = useState(false)

  useEffect(() => {
    if (selectedRegion && selectedDistrict && selectedCommune) {
      const loadFokontany = async () => {
        dispatch(setLoading(true))
        try {
          const data = await shapefileService.getFokontany(
            selectedRegion,
            selectedDistrict,
            selectedCommune
          )
          dispatch(setFokontanyList(data))
        } catch (err) {
          dispatch(setError('Erreur lors du chargement des fokontany'))
        } finally {
          dispatch(setLoading(false))
        }
      }
      loadFokontany()
    }
  }, [selectedRegion, selectedDistrict, selectedCommune, dispatch])

  const filteredFokontany = fokontanyList.filter((f) =>
    f.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExport = async () => {
    setShowExportConfirm(true)
  }

  const confirmExport = async () => {
    try {
      const response = await shapefileService.exportSelection(
        selectedRegion,
        selectedDistrict,
        selectedCommune
      )
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `export_${selectedRegion}_${selectedDistrict}_${selectedCommune}.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      setShowExportConfirm(false)
    } catch (err) {
      dispatch(setError("Erreur lors de l'export"))
    }
  }

  if (!selectedCommune) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600">
          <FiList className="w-full h-full" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Sélectionnez une commune pour voir la liste des Fokontany
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Fokontany de {selectedCommune}
          </h3>
          <button
            onClick={handleExport}
            disabled={!selectedCommune || loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <FiDownload className="w-4 h-4" />
            Exporter
          </button>
        </div>
        
        {/* Barre de recherche */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un fokontany..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>
      
      {/* Liste */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm text-gray-500">Chargement...</span>
          </div>
        ) : filteredFokontany.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {filteredFokontany.map((fokontany, idx) => (
                <motion.div
                  key={fokontany}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {fokontany}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Aucun fokontany trouvé
          </p>
        )}
      </div>

      {/* Modal de confirmation export */}
      <AnimatePresence>
        {showExportConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowExportConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirmer l'export
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Vous allez exporter les shapefiles pour :
                <br />
                <span className="font-medium">{selectedRegion}</span> →{' '}
                <span className="font-medium">{selectedDistrict}</span> →{' '}
                <span className="font-medium">{selectedCommune}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmExport}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setShowExportConfirm(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FokontanyList