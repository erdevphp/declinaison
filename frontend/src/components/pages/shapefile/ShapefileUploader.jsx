import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import {
  FiUpload,
  FiFile,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
} from 'react-icons/fi'
import { setFileMetadata, clearFileMetadata, setFileError } from '../../../store/slices/shapefileSlice'

const ShapefileUploader = forwardRef(({ type, label, accept = '.shp' }, ref) => {
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const { filesMetadata, uploadProgress } = useSelector((state) => state.shapefile)
  const metadata = filesMetadata[type]
  const progress = uploadProgress[type]

  // Exposer la méthode getFile au parent
  useImperativeHandle(ref, () => ({
    getFile: () => fileRef.current,
  }))

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Vérifier l'extension
    if (!file.name.endsWith('.shp') && !file.name.endsWith('.zip')) {
      dispatch(setFileError({ type, error: 'Format non supporté. Utilisez .shp ou .zip' }))
      return
    }

    // Stocker le fichier dans une ref (non sérialisable)
    fileRef.current = file

    // Stocker les métadonnées dans Redux (sérialisable)
    dispatch(setFileMetadata({
      type,
      name: file.name,
      size: file.size,
      status: 'loaded',
    }))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    multiple: false,
  })

  const handleClear = (e) => {
    e.stopPropagation()
    fileRef.current = null
    dispatch(clearFileMetadata({ type }))
  }

  const getStatusIcon = () => {
    if (metadata?.status === 'loaded') {
      return <FiCheckCircle className="w-5 h-5 text-green-500" />
    }
    if (metadata?.status === 'error') {
      return <FiAlertCircle className="w-5 h-5 text-red-500" />
    }
    if (progress && progress < 100) {
      return (
        <div className="w-5 h-5">
          <div className="animate-spin rounded-full border-2 border-primary-500 border-t-transparent w-full h-full"></div>
        </div>
      )
    }
    return <FiFile className="w-5 h-5 text-gray-400" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer ${isDragActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : metadata?.status === 'loaded'
            ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
            : metadata?.status === 'error'
              ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
        }`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </p>
          {metadata?.name ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {metadata.name} ({(metadata.size / 1024).toFixed(1)} KB)
            </p>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {isDragActive ? 'Relâchez pour déposer' : '.shp ou .zip'}
            </p>
          )}
          {metadata?.error && (
            <p className="text-xs text-red-500 mt-1">{metadata.error}</p>
          )}
          {progress && progress < 100 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
              <div
                className="bg-primary-600 h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {metadata?.status === 'loaded' && (
          <button
            onClick={handleClear}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </motion.div>
  )
})

ShapefileUploader.displayName = 'ShapefileUploader'

export default ShapefileUploader