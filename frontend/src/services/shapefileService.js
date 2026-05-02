import api from './api'

const shapefileService = {
  // Valider les 4 shapefiles uploadés
  validate: async (formData, onProgress) => {
    const response = await api.post('/shapefile/validate/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percentCompleted)
        }
      },
    })
    return response.data
  },

  // Récupérer la liste des régions (après validation)
  getRegions: async () => {
    const response = await api.get('/shapefile/regions/')
    return response.data  // Retourne directement le tableau
  },

  // Récupérer les districts d'une région
  getDistricts: async (region) => {
    const response = await api.get('/shapefile/districts/', { params: { region } })
    return response.data
  },

  // Récupérer les communes d'une région + district
  getCommunes: async (region, district) => {
    const response = await api.get('/shapefile/communes/', { params: { region, district } })
    return response.data
  },

  // Récupérer les fokontany
  getFokontany: async (region, district, commune) => {
    const response = await api.get('/shapefile/fokontany/', { params: { region, district, commune } })
    return response.data
  },

  // Exporter la sélection
  exportSelection: async (region, district, commune) => {
    const response = await api.post('/shapefile/export/', { region, district, commune }, {
      responseType: 'blob',
    })
    return response
  },
}

export default shapefileService