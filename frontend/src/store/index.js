import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './slices/uiSlice'
import authReducer from './slices/authSlice'
import shapefileReducer from './slices/shapefileSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    shapefile: shapefileReducer,
  },
})