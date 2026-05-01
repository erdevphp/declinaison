import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarPosition: 'left', // 'left' ou 'right'
  sidebarOpen: true,
  darkMode: localStorage.getItem('theme') === 'dark',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarPosition: (state, action) => {
      state.sidebarPosition = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    },
  },
})

export const { setSidebarPosition, toggleSidebar, toggleDarkMode } = uiSlice.actions
export default uiSlice.reducer