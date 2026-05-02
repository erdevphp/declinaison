import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi'
import ShapefileUploader from './shapefile/ShapefileUploader'
import LinkedSelectors from './shapefile/LinkedSelectors'
import FokontanyList from './shapefile/FokontanyList'
import {
  setValidated,
  setValidationErrors,
  setLoading,
  setError,
  setUploadProgress,
  resetShapefile,
} from '../../store/slices/shapefileSlice'
import shapefileService from '../../services/shapefileService'

const ShapefileManager = () => {
  const dispatch = useDispatch()

  // Refs pour accéder aux fichiers depuis les composants enfants
  const regionFileRef = useRef(null)
  const districtFileRef = useRef(null)
  const communeFileRef = useRef(null)
  const fokontanyFileRef = useRef(null)

  const { filesMetadata, isValidated, validationErrors, loading } = useSelector(
    (state) => state.shapefile
  )

  const allFilesLoaded = () => {
    return (
      filesMetadata.region?.status === 'loaded' &&
      filesMetadata.district?.status === 'loaded' &&
      filesMetadata.commune?.status === 'loaded' &&
      filesMetadata.fokontany?.status === 'loaded'
    )
  }

  const handleValidate = async () => {
    if (!allFilesLoaded()) {
      dispatch(setError('Veuillez charger les 4 shapefiles'))
      return
    }

    const formData = new FormData()
    formData.append('region', regionFileRef.current?.getFile())
    formData.append('district', districtFileRef.current?.getFile())
    formData.append('commune', communeFileRef.current?.getFile())
    formData.append('fokontany', fokontanyFileRef.current?.getFile())

    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const result = await shapefileService.validate(formData, (progress) => {
        dispatch(setUploadProgress({ type: 'global', progress }))
      })
      console.log("FORY", result);
      

      if (result.regions) {
        dispatch(setValidated(true))
        dispatch(setValidationErrors([]))
      } else {
        console.log("Coucou les gens", result.errors)
        dispatch(setValidationErrors(result.errors || []))
        dispatch(setValidated(false))
      }
    } catch (err) {
      console.error('Erreur validation:', err)  // ← Ajoute ce log
      dispatch(setError(err.response?.data?.error || 'Erreur de validation'))
      dispatch(setValidated(false))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleReset = () => {
    dispatch(resetShapefile())
    // Nettoyer les refs
    regionFileRef.current = null
    districtFileRef.current = null
    communeFileRef.current = null
    fokontanyFileRef.current = null
  }

  const getValidationStatus = () => {
    if (!allFilesLoaded()) {
      return {
        icon: <FiAlertCircle className="w-5 h-5" />,
        text: 'Sélectionnez les 4 shapefiles',
        color: 'text-gray-500',
        bg: 'bg-gray-100 dark:bg-gray-700',
      }
    }
    if (loading) {
      return {
        icon: <FiLoader className="w-5 h-5 animate-spin" />,
        text: 'Validation en cours...',
        color: 'text-primary-600',
        bg: 'bg-primary-50 dark:bg-primary-900/20',
      }
    }
    if (isValidated) {
      return {
        icon: <FiCheckCircle className="w-5 h-5" />,
        text: 'Shapefiles validés avec succès',
        color: 'text-green-600',
        bg: 'bg-green-50 dark:bg-green-900/20',
      }
    }
    return {
      icon: <FiAlertCircle className="w-5 h-5" />,
      text: 'Cliquez sur "Valider" après avoir chargé les fichiers',
      color: 'text-gray-500',
      bg: 'bg-gray-100 dark:bg-gray-700',
    }
  }

  const status = getValidationStatus()

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des shapefiles
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Chargement hiérarchique des données géographiques (Région → District → Commune → Fokontany)
          </p>
        </div>
        {isValidated && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
          >
            Nouveau chargement
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche - Upload */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Chargement des shapefiles
            </h2>

            <div className="space-y-3">
              <ShapefileUploader
                ref={regionFileRef}
                type="region"
                label="Shapefile Région"
              />
              <ShapefileUploader
                ref={districtFileRef}
                type="district"
                label="Shapefile District"
              />
              <ShapefileUploader
                ref={communeFileRef}
                type="commune"
                label="Shapefile Commune"
              />
              <ShapefileUploader
                ref={fokontanyFileRef}
                type="fokontany"
                label="Shapefile Fokontany"
              />
            </div>

            <button
              onClick={handleValidate}
              disabled={!allFilesLoaded() || loading}
              className={`w-full mt-6 py-2 rounded-lg font-medium transition-colors ${allFilesLoaded() && !loading
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
            >
              {loading ? 'Validation en cours...' : 'Valider le chargement'}
            </button>

            {/* Statut */}
            <div className={`mt-4 p-3 rounded-lg ${status.bg}`}>
              <div className={`flex items-center gap-2 ${status.color}`}>
                {status.icon}
                <span className="text-sm">{status.text}</span>
              </div>
            </div>

            {/* Erreurs de validation */}
            {validationErrors.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                  Champs manquants :
                </p>
                <ul className="list-disc list-inside text-sm text-red-500 dark:text-red-300 space-y-1">
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite - Sélection */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sélection hiérarchique
            </h2>
            <LinkedSelectors />
          </div>

          <FokontanyList />
        </div>
      </div>
    </div>
  )
}

export default ShapefileManager