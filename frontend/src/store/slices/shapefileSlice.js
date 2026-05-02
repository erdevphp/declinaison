import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Métadonnées des fichiers (pas les fichiers eux-mêmes)
  filesMetadata: {
    region: { name: null, size: null, status: 'idle', error: null },
    district: { name: null, size: null, status: 'idle', error: null },
    commune: { name: null, size: null, status: 'idle', error: null },
    fokontany: { name: null, size: null, status: 'idle', error: null },
  },
  // État de validation
  isValidated: false,
  validationErrors: [],
  // Données des selecteurs
  regions: [],
  districts: [],
  communes: [],
  fokontanyList: [],
  // Sélection courante
  selectedRegion: null,
  selectedDistrict: null,
  selectedCommune: null,
  // Statut global
  loading: false,
  error: null,
  uploadProgress: {},
}

const shapefileSlice = createSlice({
  name: 'shapefile',
  initialState,
  reducers: {
    // Métadonnées des fichiers
    setFileMetadata: (state, action) => {
      const { type, name, size, status } = action.payload
      state.filesMetadata[type] = { name, size, status, error: null }
    },
    setFileError: (state, action) => {
      const { type, error } = action.payload
      state.filesMetadata[type].error = error
      state.filesMetadata[type].status = 'error'
    },
    clearFileMetadata: (state, action) => {
      const { type } = action.payload
      state.filesMetadata[type] = { name: null, size: null, status: 'idle', error: null }
    },
    setValidated: (state, action) => {
      state.isValidated = action.payload
      if (action.payload === true) {
        // Reset des sélections quand on valide
        state.selectedRegion = null
        state.selectedDistrict = null
        state.selectedCommune = null
        state.districts = []
        state.communes = []
        state.fokontanyList = []
      }
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload
    },

    // Données des selecteurs
    setRegions: (state, action) => {
      state.regions = action.payload
    },
    setDistricts: (state, action) => {
      state.districts = action.payload
    },
    setCommunes: (state, action) => {
      state.communes = action.payload
    },
    setFokontanyList: (state, action) => {
      state.fokontanyList = action.payload
    },

    // Sélection
    setSelectedRegion: (state, action) => {
      state.selectedRegion = action.payload
      state.selectedDistrict = null
      state.selectedCommune = null
      state.districts = []
      state.communes = []
      state.fokontanyList = []
    },
    setSelectedDistrict: (state, action) => {
      state.selectedDistrict = action.payload
      state.selectedCommune = null
      state.communes = []
      state.fokontanyList = []
    },
    setSelectedCommune: (state, action) => {
      state.selectedCommune = action.payload
    },

    // Statut global
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setUploadProgress: (state, action) => {
      const { type, progress } = action.payload
      state.uploadProgress[type] = progress
    },

    // Reset complet
    resetShapefile: () => initialState,
  },
})

export const {
  setFileMetadata,
  setFileError,
  clearFileMetadata,
  setValidated,
  setValidationErrors,
  setRegions,
  setDistricts,
  setCommunes,
  setFokontanyList,
  setSelectedRegion,
  setSelectedDistrict,
  setSelectedCommune,
  setLoading,
  setError,
  setUploadProgress,
  resetShapefile,
} = shapefileSlice.actions

export default shapefileSlice.reducer