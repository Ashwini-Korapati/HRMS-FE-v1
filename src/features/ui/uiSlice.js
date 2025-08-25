import { createSlice } from '@reduxjs/toolkit'
import { TOAST_TYPES } from '@/utils/constants'

// Theme support removed; app is fixed to light mode

// Initial state
const initialState = {
  // Layout
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  
  // Modals and dialogs
  modals: {},
  
  // Loading states
  globalLoading: false,
  loadingStates: {},
  
  // Toast notifications
  toasts: [],
  toastCounter: 0,
  
  // Confirmation dialogs
  confirmDialog: {
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
    variant: 'warning'
  },
  
  // Page metadata
  pageTitle: '',
  breadcrumbs: [],
  
  // Search
  globalSearch: {
    open: false,
    query: '',
    results: [],
    loading: false
  },
  
  // Notifications panel
  notificationsPanel: {
    open: false,
    unreadCount: 0
  },
  
  // Filters and sorting
  filters: {},
  sorting: {},
  
  // Preferences
  preferences: {
    density: 'comfortable', // compact, comfortable, spacious
    animations: true,
    soundEnabled: false,
    autoSave: true
  }
}


const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Layout actions
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
    
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload
    },
    
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    
    // Modal actions
    openModal: (state, action) => {
      const { id, props } = action.payload
      state.modals[id] = { open: true, props: props || {} }
    },
    
    closeModal: (state, action) => {
      const id = action.payload
      if (state.modals[id]) {
        state.modals[id].open = false
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(id => {
        state.modals[id].open = false
      })
    },
    
    // Loading actions
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },
    
    setLoadingState: (state, action) => {
      const { key, loading } = action.payload
      state.loadingStates[key] = loading
    },
    
    clearLoadingState: (state, action) => {
      const key = action.payload
      delete state.loadingStates[key]
    },
    
    // Toast actions
    addToast: (state, action) => {
      const { message, type = TOAST_TYPES.INFO, duration = 5000, actions } = action.payload
      const id = ++state.toastCounter
      
      state.toasts.push({
        id,
        message,
        type,
        duration,
        actions: actions || [],
        createdAt: Date.now()
      })
    },
    
    removeToast: (state, action) => {
      const id = action.payload
      state.toasts = state.toasts.filter(toast => toast.id !== id)
    },
    
    clearAllToasts: (state) => {
      state.toasts = []
    },
    
    // Convenience toast methods
    showSuccess: (state, action) => {
      const { message, duration, actions } = action.payload
      const id = ++state.toastCounter
      
      state.toasts.push({
        id,
        message,
        type: TOAST_TYPES.SUCCESS,
        duration: duration || 5000,
        actions: actions || [],
        createdAt: Date.now()
      })
    },
    
    showError: (state, action) => {
      const { message, duration, actions } = action.payload
      const id = ++state.toastCounter
      
      state.toasts.push({
        id,
        message,
        type: TOAST_TYPES.ERROR,
        duration: duration || 8000,
        actions: actions || [],
        createdAt: Date.now()
      })
    },
    
    showWarning: (state, action) => {
      const { message, duration, actions } = action.payload
      const id = ++state.toastCounter
      
      state.toasts.push({
        id,
        message,
        type: TOAST_TYPES.WARNING,
        duration: duration || 6000,
        actions: actions || [],
        createdAt: Date.now()
      })
    },
    
    showInfo: (state, action) => {
      const { message, duration, actions } = action.payload
      const id = ++state.toastCounter
      
      state.toasts.push({
        id,
        message,
        type: TOAST_TYPES.INFO,
        duration: duration || 5000,
        actions: actions || [],
        createdAt: Date.now()
      })
    },
    
    // Confirmation dialog actions
    showConfirmDialog: (state, action) => {
      const {
        title,
        message,
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onConfirm,
        onCancel,
        variant = 'warning'
      } = action.payload
      
      state.confirmDialog = {
        open: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        variant
      }
    },
    
    hideConfirmDialog: (state) => {
      state.confirmDialog.open = false
    },
    
    // Page metadata actions
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload
      document.title = `${action.payload} - HR Office Management`
    },
    
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload
    },
    
    // Global search actions
    setGlobalSearchOpen: (state, action) => {
      state.globalSearch.open = action.payload
      if (!action.payload) {
        state.globalSearch.query = ''
        state.globalSearch.results = []
      }
    },
    
    setGlobalSearchQuery: (state, action) => {
      state.globalSearch.query = action.payload
    },
    
    setGlobalSearchResults: (state, action) => {
      state.globalSearch.results = action.payload
    },
    
    setGlobalSearchLoading: (state, action) => {
      state.globalSearch.loading = action.payload
    },
    
    // Notifications panel actions
    setNotificationsPanelOpen: (state, action) => {
      state.notificationsPanel.open = action.payload
    },
    
    setUnreadNotificationsCount: (state, action) => {
      state.notificationsPanel.unreadCount = action.payload
    },
    
    // Filter and sorting actions
    setFilter: (state, action) => {
      const { key, value } = action.payload
      state.filters[key] = value
    },
    
    clearFilter: (state, action) => {
      const key = action.payload
      delete state.filters[key]
    },
    
    clearAllFilters: (state) => {
      state.filters = {}
    },
    
    setSorting: (state, action) => {
      const { key, field, direction } = action.payload
      state.sorting[key] = { field, direction }
    },
    
    clearSorting: (state, action) => {
      const key = action.payload
      delete state.sorting[key]
    },
    
    // Preferences actions
    setPreference: (state, action) => {
      const { key, value } = action.payload
      state.preferences[key] = value
    },
    
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    
    resetPreferences: (state) => {
      state.preferences = {
        density: 'comfortable',
        animations: true,
        soundEnabled: false,
        autoSave: true
      }
    }
  }
})

export const {
  // Layout
  setSidebarOpen,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  setMobileMenuOpen,
  toggleMobileMenu,
  
  // Modals
  openModal,
  closeModal,
  closeAllModals,
  
  // Loading
  setGlobalLoading,
  setLoadingState,
  clearLoadingState,
  
  // Toasts
  addToast,
  removeToast,
  clearAllToasts,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  
  // Confirm dialog
  showConfirmDialog,
  hideConfirmDialog,
  
  // Page metadata
  setPageTitle,
  setBreadcrumbs,
  
  // Global search
  setGlobalSearchOpen,
  setGlobalSearchQuery,
  setGlobalSearchResults,
  setGlobalSearchLoading,
  
  // Notifications panel
  setNotificationsPanelOpen,
  setUnreadNotificationsCount,
  
  // Filters and sorting
  setFilter,
  clearFilter,
  clearAllFilters,
  setSorting,
  clearSorting,
  
  // Preferences
  setPreference,
  updatePreferences,
  resetPreferences
} = uiSlice.actions

// Selectors
export const selectUI = (state) => state.ui
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen
export const selectModals = (state) => state.ui.modals
export const selectModal = (id) => (state) => state.ui.modals[id]
export const selectGlobalLoading = (state) => state.ui.globalLoading
export const selectLoadingStates = (state) => state.ui.loadingStates
export const selectLoadingState = (key) => (state) => state.ui.loadingStates[key] || false
export const selectToasts = (state) => state.ui.toasts
export const selectConfirmDialog = (state) => state.ui.confirmDialog
export const selectPageTitle = (state) => state.ui.pageTitle
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs
export const selectGlobalSearch = (state) => state.ui.globalSearch
export const selectNotificationsPanel = (state) => state.ui.notificationsPanel
export const selectFilters = (state) => state.ui.filters
export const selectFilter = (key) => (state) => state.ui.filters[key]
export const selectSorting = (state) => state.ui.sorting
export const selectSortingForKey = (key) => (state) => state.ui.sorting[key]
export const selectPreferences = (state) => state.ui.preferences
export const selectPreference = (key) => (state) => state.ui.preferences[key]

export default uiSlice.reducer
