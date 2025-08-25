import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { publicApi } from '@/api/endpoints'
import { STORAGE_KEYS } from '@/utils/constants'

// Helper function to extract subdomain from URL
const getSubdomainFromUrl = () => {
  const hostname = window.location.hostname
  const parts = hostname.split('.')
  
  // For localhost or IP addresses, no subdomain
  if (parts.length <= 2 || hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null
  }
  
  // Return the first part as subdomain (e.g., 'company' from 'company.hroffice.com')
  return parts[0]
}

// Async thunks
export const resolveCompanyBySubdomain = createAsyncThunk(
  'tenant/resolveCompanyBySubdomain',
  async (subdomain, { rejectWithValue }) => {
    try {
      const response = await publicApi.resolveCompany({ subdomain })
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const resolveCompanyByEmail = createAsyncThunk(
  'tenant/resolveCompanyByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await publicApi.resolveCompany({ email })
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getCompaniesByEmail = createAsyncThunk(
  'tenant/getCompaniesByEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await publicApi.getCompaniesByEmail(email)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const validateSubdomain = createAsyncThunk(
  'tenant/validateSubdomain',
  async (subdomain, { rejectWithValue }) => {
    try {
      const response = await publicApi.validateSubdomain(subdomain)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const initializeTenant = createAsyncThunk(
  'tenant/initializeTenant',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // First try to get subdomain from URL
      const subdomain = getSubdomainFromUrl()
      
      if (subdomain) {
        // Try to resolve company by subdomain
        const result = await dispatch(resolveCompanyBySubdomain(subdomain))
        if (result.type.endsWith('/fulfilled')) {
          return result.payload
        }
      }
      
      // If no subdomain or resolution failed, check stored tenant info
      const storedTenantInfo = localStorage.getItem(STORAGE_KEYS.TENANT_INFO)
      if (storedTenantInfo) {
        return JSON.parse(storedTenantInfo)
      }
      
      // No tenant context available
      return null
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// Initial state
const initialState = {
  // Current tenant context
  companyId: null,
  subdomain: getSubdomainFromUrl(),
  company: null,
  
  // Available companies for user
  availableCompanies: [],
  
  // Loading states
  isLoading: false,
  isResolving: false,
  isValidating: false,
  
  // Error states
  error: null,
  lastError: null,
  
  // Validation results
  isSubdomainValid: null,
  subdomainAvailable: null
}

// Try to load stored tenant info
const storedTenantInfo = localStorage.getItem(STORAGE_KEYS.TENANT_INFO)
if (storedTenantInfo) {
  try {
    const tenantInfo = JSON.parse(storedTenantInfo)
    initialState.companyId = tenantInfo.companyId
    initialState.company = tenantInfo.company
    if (!initialState.subdomain && tenantInfo.subdomain) {
      initialState.subdomain = tenantInfo.subdomain
    }
  } catch (error) {
    console.warn('Failed to parse stored tenant info:', error)
    localStorage.removeItem(STORAGE_KEYS.TENANT_INFO)
  }
}

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    
    setTenantContext: (state, action) => {
      const { companyId, subdomain, company } = action.payload
      state.companyId = companyId
      state.subdomain = subdomain
      state.company = company
      
      // Store in localStorage
      const tenantInfo = { companyId, subdomain, company }
      localStorage.setItem(STORAGE_KEYS.TENANT_INFO, JSON.stringify(tenantInfo))
    },
    
    clearTenantContext: (state) => {
      state.companyId = null
      state.company = null
      // Keep subdomain from URL
      state.subdomain = getSubdomainFromUrl()
      state.availableCompanies = []
      state.error = null
      
      localStorage.removeItem(STORAGE_KEYS.TENANT_INFO)
    },
    
    setAvailableCompanies: (state, action) => {
      state.availableCompanies = action.payload
    },
    
    switchCompany: (state, action) => {
      const company = action.payload
      state.companyId = company.id
      state.company = company
      state.subdomain = company.subdomain
      
      // Update stored info
      const tenantInfo = {
        companyId: company.id,
        subdomain: company.subdomain,
        company
      }
      localStorage.setItem(STORAGE_KEYS.TENANT_INFO, JSON.stringify(tenantInfo))
    },
    
    updateSubdomain: (state, action) => {
      state.subdomain = action.payload
    },
    
    resetValidation: (state) => {
      state.isSubdomainValid = null
      state.subdomainAvailable = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Initialize tenant
      .addCase(initializeTenant.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initializeTenant.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload) {
          state.companyId = action.payload.companyId || action.payload.id
          state.company = action.payload.company || action.payload
          if (action.payload.subdomain) {
            state.subdomain = action.payload.subdomain
          }
        }
      })
      .addCase(initializeTenant.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.lastError = action.payload
      })
      
      // Resolve company by subdomain
      .addCase(resolveCompanyBySubdomain.pending, (state) => {
        state.isResolving = true
        state.error = null
      })
      .addCase(resolveCompanyBySubdomain.fulfilled, (state, action) => {
        state.isResolving = false
        state.companyId = action.payload.companyId || action.payload.id
        state.company = action.payload.company || action.payload
        
        // Store tenant info
        const tenantInfo = {
          companyId: state.companyId,
          subdomain: state.subdomain,
          company: state.company
        }
        localStorage.setItem(STORAGE_KEYS.TENANT_INFO, JSON.stringify(tenantInfo))
      })
      .addCase(resolveCompanyBySubdomain.rejected, (state, action) => {
        state.isResolving = false
        state.error = action.payload
        state.lastError = action.payload
      })
      
      // Resolve company by email
      .addCase(resolveCompanyByEmail.pending, (state) => {
        state.isResolving = true
        state.error = null
      })
      .addCase(resolveCompanyByEmail.fulfilled, (state, action) => {
        state.isResolving = false
        if (action.payload.company) {
          state.companyId = action.payload.company.id
          state.company = action.payload.company
          state.subdomain = action.payload.company.subdomain
          
          // Store tenant info
          const tenantInfo = {
            companyId: state.companyId,
            subdomain: state.subdomain,
            company: state.company
          }
          localStorage.setItem(STORAGE_KEYS.TENANT_INFO, JSON.stringify(tenantInfo))
        }
      })
      .addCase(resolveCompanyByEmail.rejected, (state, action) => {
        state.isResolving = false
        state.error = action.payload
        state.lastError = action.payload
      })
      
      // Get companies by email
      .addCase(getCompaniesByEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCompaniesByEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.availableCompanies = action.payload.companies || []
      })
      .addCase(getCompaniesByEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.lastError = action.payload
      })
      
      // Validate subdomain
      .addCase(validateSubdomain.pending, (state) => {
        state.isValidating = true
        state.error = null
      })
      .addCase(validateSubdomain.fulfilled, (state, action) => {
        state.isValidating = false
        state.isSubdomainValid = action.payload.valid
        state.subdomainAvailable = action.payload.available
      })
      .addCase(validateSubdomain.rejected, (state, action) => {
        state.isValidating = false
        state.error = action.payload
        state.lastError = action.payload
        state.isSubdomainValid = false
        state.subdomainAvailable = false
      })
  }
})

export const {
  clearError,
  setTenantContext,
  clearTenantContext,
  setAvailableCompanies,
  switchCompany,
  updateSubdomain,
  resetValidation
} = tenantSlice.actions

// Selectors
export const selectTenant = (state) => state.tenant
export const selectCompanyId = (state) => state.tenant.companyId
export const selectSubdomain = (state) => state.tenant.subdomain
export const selectCompany = (state) => state.tenant.company
export const selectAvailableCompanies = (state) => state.tenant.availableCompanies
export const selectTenantLoading = (state) => state.tenant.isLoading
export const selectTenantResolving = (state) => state.tenant.isResolving
export const selectTenantValidating = (state) => state.tenant.isValidating
export const selectTenantError = (state) => state.tenant.error
export const selectIsSubdomainValid = (state) => state.tenant.isSubdomainValid
export const selectSubdomainAvailable = (state) => state.tenant.subdomainAvailable

// Combined selectors
export const selectTenantContext = (state) => ({
  companyId: state.tenant.companyId,
  subdomain: state.tenant.subdomain,
  company: state.tenant.company
})

export const selectHasTenantContext = (state) => Boolean(state.tenant.companyId)

export default tenantSlice.reducer
