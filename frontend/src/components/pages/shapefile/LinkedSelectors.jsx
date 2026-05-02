import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  setRegions,
  setDistricts,
  setCommunes,
  setSelectedRegion,
  setSelectedDistrict,
  setSelectedCommune,
  setLoading,
  setError,
} from '../../../store/slices/shapefileSlice'
import shapefileService from '../../../services/shapefileService'
import { FiMapPin, FiGrid, FiHome } from 'react-icons/fi'

const LinkedSelectors = () => {
  const dispatch = useDispatch()
  const {
    isValidated,
    regions,
    districts,
    communes,
    selectedRegion,
    selectedDistrict,
    selectedCommune,
    loading,
  } = useSelector((state) => state.shapefile)

  // Charger les régions quand isValidated devient true
  useEffect(() => {
    const loadRegions = async () => {
      if (!isValidated) return
      
      dispatch(setLoading(true))
      try {
        const data = await shapefileService.getRegions()
        console.log('Régions reçues:', data)
        dispatch(setRegions(data))
      } catch (err) {
        console.error('Erreur chargement régions:', err)
        dispatch(setError('Erreur lors du chargement des régions'))
      } finally {
        dispatch(setLoading(false))
      }
    }
    
    loadRegions()
  }, [isValidated, dispatch])

  // Charger les districts quand selectedRegion change
  useEffect(() => {
    const loadDistricts = async () => {
      if (!selectedRegion) return
      
      dispatch(setLoading(true))
      try {
        const data = await shapefileService.getDistricts(selectedRegion)
        console.log('Districts reçus:', data)
        dispatch(setDistricts(data))
      } catch (err) {
        console.error('Erreur chargement districts:', err)
        dispatch(setError('Erreur lors du chargement des districts'))
      } finally {
        dispatch(setLoading(false))
      }
    }
    
    loadDistricts()
  }, [selectedRegion, dispatch])

  // Charger les communes quand selectedDistrict change
  useEffect(() => {
    const loadCommunes = async () => {
      if (!selectedRegion || !selectedDistrict) return
      
      dispatch(setLoading(true))
      try {
        const data = await shapefileService.getCommunes(selectedRegion, selectedDistrict)
        console.log('Communes reçues:', data)
        dispatch(setCommunes(data))
      } catch (err) {
        console.error('Erreur chargement communes:', err)
        dispatch(setError('Erreur lors du chargement des communes'))
      } finally {
        dispatch(setLoading(false))
      }
    }
    
    loadCommunes()
  }, [selectedRegion, selectedDistrict, dispatch])

  if (!isValidated) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600">
          <FiMapPin className="w-full h-full" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Validez d'abord le chargement des shapefiles
        </p>
      </div>
    )
  }

  if (loading && regions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-500">Chargement des régions...</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Région */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FiMapPin className="inline w-4 h-4 mr-2" />
          Région
        </label>
        <select
          value={selectedRegion || ''}
          onChange={(e) => dispatch(setSelectedRegion(e.target.value || null))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="">-- Sélectionner Région --</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FiGrid className="inline w-4 h-4 mr-2" />
          District
        </label>
        <select
          value={selectedDistrict || ''}
          onChange={(e) => dispatch(setSelectedDistrict(e.target.value || null))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
          disabled={!selectedRegion || loading}
        >
          <option value="">-- Sélectionner District --</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      {/* Commune */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FiHome className="inline w-4 h-4 mr-2" />
          Commune
        </label>
        <select
          value={selectedCommune || ''}
          onChange={(e) => dispatch(setSelectedCommune(e.target.value || null))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
          disabled={!selectedDistrict || loading}
        >
          <option value="">-- Sélectionner Commune --</option>
          {communes.map((commune) => (
            <option key={commune} value={commune}>
              {commune}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-2">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-sm text-gray-500">Chargement...</span>
        </div>
      )}
    </motion.div>
  )
}

export default LinkedSelectors