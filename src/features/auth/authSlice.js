import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { publicApi, authenticatedApi } from '@/api/endpoints'
import { STORAGE_KEYS } from '@/utils/constants'

// Helper function to decode JWT token
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

// Function to extract user info from ID token
const extractUserFromTokens = () => {
  const idToken = localStorage.getItem('id_token')
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  
  if (idToken) {
    const decoded = decodeJWT(idToken)
    if (decoded) {
      return {
        id: decoded.sub || decoded.userId,
        email: decoded.email,
        firstName: decoded.name?.split(' ')[0] || 'User',
        lastName: decoded.name?.split(' ').slice(1).join(' ') || '',
        role: decoded.role,
        companyId: decoded.companyId || decoded.company_id,
        company: decoded.company ? { name: decoded.company } : null
      }
    }
  }
  
  if (accessToken) {
    const decoded = decodeJWT(accessToken)
    if (decoded) {
      return {
        id: decoded.userId || decoded.sub,
        email: decoded.email,
        role: decoded.role,
        companyId: decoded.companyId || decoded.company_id,
        subdomain: decoded.subdomain
      }
    }
  }
  
  return null
}

// Async thunks
export const uasChallenge = createAsyncThunk(
  'auth/uasChallenge',
  async ({ email, clientId, redirectUri, scope, state, responseType = 'code' }, { rejectWithValue }) => {
    try {
      const response = await publicApi.authChallenge({
        email,
        client_id: clientId,
        response_type: responseType,
        scope,
        state,
        redirect_uri: redirectUri
      })
      
      // If we get a loginUrl, redirect to it
      if (response.data?.data?.loginUrl) {
        window.location.href = response.data.data.loginUrl
        return response.data.data
      }
      
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const loginWithChallenge = createAsyncThunk(
  'auth/loginWithChallenge', 
  async ({ loginChallenge, email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      const payload = {
        login_challenge: loginChallenge,
        email,
        password,
        remember_me: rememberMe
      }
      
      const response = await publicApi.login(payload)
      
      // Handle the response data structure
      const responseData = response.data.data || response.data
      
      // If we get a redirectUrl, redirect to it (OAuth flow)
      if (responseData.redirectUrl) {
        window.location.href = responseData.redirectUrl
        return responseData
      }
      
      // If we get user data directly, store it and handle authentication
      if (responseData.user) {
        // Store user and company data
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(responseData.user))
        if (responseData.company) {
          localStorage.setItem('company_info', JSON.stringify(responseData.company))
        }
        
        return responseData
      }
      
      return responseData
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const exchangeToken = createAsyncThunk(
  'auth/exchangeToken',
  async ({ code, clientId, clientSecret, redirectUri }, { rejectWithValue }) => {
    try {
      const response = await publicApi.exchangeToken({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      })
      
      // Handle the response structure (data.data or data)
      const tokenData = response.data.data || response.data
      const { access_token, refresh_token, expires_in, id_token, navigation, dashboard_url, routes } = tokenData
      
      // Store tokens immediately
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
      if (refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
      }
      if (id_token) {
        localStorage.setItem('id_token', id_token)
      }
      
      // Store navigation and routing data from token response
      if (navigation) {
        localStorage.setItem('navigation_data', JSON.stringify(navigation))
      }
      if (dashboard_url) {
        localStorage.setItem('dashboard_url', dashboard_url)
      }
      if (routes) {
        localStorage.setItem('routes_data', JSON.stringify(routes))
      }
      
      console.log('Token exchange successful, navigation data:', navigation)
      console.log('Dashboard URL from token:', dashboard_url)
      
      return { access_token, refresh_token, expires_in, id_token, navigation, dashboard_url, routes }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (!token) {
        throw new Error('No access token available')
      }
      
      const response = await authenticatedApi.getUserInfo()
      const userInfo = response.data.data || response.data
      
      // Store user info
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
      
      return userInfo
    } catch (error) {
      // If authentication fails, clear tokens
      if (error.response?.status === 401 || error.message?.includes('token')) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_INFO)
        localStorage.removeItem('id_token')
      }
      return rejectWithValue(error)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      
      if (refreshToken) {
        await publicApi.logout({ refresh_token: refreshToken })
      }
      
      // Clear all auth data
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_INFO)
      
      return true
    } catch (error) {
      // Still clear local data even if server logout fails
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_INFO)
      
      return rejectWithValue(error)
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      if (!refresh_token) {
        throw new Error('No refresh token available')
      }
      
      const response = await publicApi.exchangeToken({
        grant_type: 'refresh_token',
        refresh_token
      })
      
      const tokenData = response.data.data || response.data
      const { access_token, refresh_token: new_refresh_token, expires_in } = tokenData
      
      // Update stored tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
      if (new_refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, new_refresh_token)
      }
      
      return { access_token, refresh_token: new_refresh_token, expires_in }
    } catch (error) {
      // Clear tokens on refresh failure
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_INFO)
      localStorage.removeItem('id_token')
      
      return rejectWithValue(error)
    }
  }
)

// Trial registration completion thunk
export const completeTrialRegistration = createAsyncThunk(
  'auth/completeTrialRegistration',
  async (otpVerificationResponse, { rejectWithValue }) => {
    try {
      const { company, admin, token, expiresIn } = otpVerificationResponse.data
      
      // Store authentication token
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
      
      // Store company information
      const companyData = {
        id: company.id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
        website: company.website,
        logo: company.logo,
        taxId: company.taxId,
        companyCode: company.companyCode,
        subdomain: company.subdomain,
        domain: company.domain,
        timezone: company.timezone,
        workingDays: company.workingDays,
        workingHours: company.workingHours,
        status: company.status,
        settings: company.settings,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }
      localStorage.setItem('company_info', JSON.stringify(companyData))
      
      // Store admin user information
      const userData = {
        id: admin.id,
        companyId: admin.companyId,
        employeeId: admin.employeeId,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        avatar: admin.avatar,
        role: admin.role,
        isActive: admin.isActive,
        isVerified: admin.isVerified,
        lastLogin: admin.lastLogin,
        passwordChangedAt: admin.passwordChangedAt,
        dateOfBirth: admin.dateOfBirth,
        gender: admin.gender,
        address: admin.address,
        emergencyContact: admin.emergencyContact,
        joiningDate: admin.joiningDate,
        exitDate: admin.exitDate,
        salary: admin.salary,
        designationId: admin.designationId,
        departmentId: admin.departmentId,
        managerId: admin.managerId,
        settings: admin.settings,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        company: companyData
      }
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData))
      
      return {
        user: userData,
        company: companyData,
        token,
        expiresIn
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// Initial state
const initialState = {
  // Tokens
  accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  expiresIn: null,
  
  // User info
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO) || 'null') || extractUserFromTokens(),
  company: JSON.parse(localStorage.getItem('company_info') || 'null'),
  role: null,
  permissions: [],
  companyStatus: null,
  
  // Navigation and routing
  navigation: JSON.parse(localStorage.getItem('navigation_data') || 'null'),
  routes: JSON.parse(localStorage.getItem('routes_data') || 'null'),
  dashboardUrl: localStorage.getItem('dashboard_url'),
  
  // Auth flow state
  challenge: null,
  loginChallenge: null,
  isAuthenticated: false,
  
  // Loading states
  isLoading: false,
  isRefreshing: false,
  
  // Error states
  error: null,
  lastError: null
}

// Set initial auth state based on stored data
if (initialState.accessToken && initialState.user) {
  initialState.isAuthenticated = true
  initialState.role = initialState.user.role
  initialState.permissions = initialState.user.permissions || []
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    
    setUser: (state, action) => {
      state.user = action.payload
      state.role = action.payload.role
      state.permissions = action.payload.permissions || []
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(action.payload))
    },
    
    clearAuth: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.expiresIn = null
      state.user = null
      state.company = null
      state.role = null
      state.permissions = []
      state.navigation = null
      state.routes = null
      state.dashboardUrl = null
      state.isAuthenticated = false
      state.challenge = null
      state.loginChallenge = null
      state.error = null
      
      // Clear storage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_INFO)
      localStorage.removeItem('company_info')
      localStorage.removeItem('uas_company_info')
      localStorage.removeItem('uas_email')
      localStorage.removeItem('id_token')
      localStorage.removeItem('navigation_data')
      localStorage.removeItem('routes_data')
      localStorage.removeItem('dashboard_url')
    },
    
    updateTokens: (state, action) => {
      const { access_token, refresh_token, expires_in } = action.payload
      state.accessToken = access_token
      state.expiresIn = expires_in
      if (refresh_token) {
        state.refreshToken = refresh_token
      }
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
      if (refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
      }
    },
    
    updateNavigationData: (state, action) => {
      const { navigation, dashboard_url, routes } = action.payload
      
      if (navigation) {
        state.navigation = navigation
        localStorage.setItem('navigation_data', JSON.stringify(navigation))
      }
      
      if (dashboard_url) {
        state.dashboardUrl = dashboard_url
        localStorage.setItem('dashboard_url', dashboard_url)
      }
      
      if (routes) {
        state.routes = routes
        localStorage.setItem('routes_data', JSON.stringify(routes))
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // UAS Challenge
      .addCase(uasChallenge.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(uasChallenge.fulfilled, (state, action) => {
        state.isLoading = false
        state.challenge = action.payload
      })
      .addCase(uasChallenge.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.lastError = action.payload
      })
      
      // Login with challenge
      .addCase(loginWithChallenge.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginWithChallenge.fulfilled, (state, action) => {
        state.isLoading = false
        state.loginChallenge = action.payload
        
        // If we get user data directly, set authentication state
        if (action.payload.user) {
          state.user = action.payload.user
          state.role = action.payload.user.role
          state.permissions = action.payload.user.permissions || []
          state.isAuthenticated = true
          
          // Store company info in state if available
          if (action.payload.company) {
            state.company = action.payload.company
          }
        }
      })
      .addCase(loginWithChallenge.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.lastError = action.payload
      })
      
      // Exchange token
      .addCase(exchangeToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(exchangeToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.accessToken = action.payload.access_token
        state.refreshToken = action.payload.refresh_token
        state.expiresIn = action.payload.expires_in
        
        // Store navigation data if available
        if (action.payload.navigation) {
          state.navigation = action.payload.navigation
          localStorage.setItem('navigation_data', JSON.stringify(action.payload.navigation))
        }
        
        // Store routes data if available
        if (action.payload.routes) {
          state.routes = action.payload.routes
          localStorage.setItem('routes_data', JSON.stringify(action.payload.routes))
        }
        
        // Store dashboard URL if available
        if (action.payload.dashboard_url) {
          state.dashboardUrl = action.payload.dashboard_url
          localStorage.setItem('dashboard_url', action.payload.dashboard_url)
        }
        
        // Handle user data from response
        if (action.payload.user) {
          state.user = action.payload.user
          state.role = action.payload.user.role
          state.permissions = action.payload.user.permissions || []
          state.isAuthenticated = true
          
          // Store user info
          localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(action.payload.user))
          
          // Store company info
          if (action.payload.user.company) {
            state.company = action.payload.user.company
            localStorage.setItem('company_info', JSON.stringify(action.payload.user.company))
          }
        } else {
          // Try to extract user info from tokens as fallback
          const userFromToken = extractUserFromTokens()
          if (userFromToken) {
            state.user = userFromToken
            state.role = userFromToken.role
            state.permissions = userFromToken.permissions || []
            state.isAuthenticated = true
            
            // Store the extracted user info
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userFromToken))
          }
        }
      })
      .addCase(exchangeToken.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.lastError = action.payload
      })
      
      // Fetch user info
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.role = action.payload.role
        state.permissions = action.payload.permissions || []
        state.isAuthenticated = true
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.lastError = action.payload
        state.isAuthenticated = false
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.accessToken = null
        state.refreshToken = null
        state.expiresIn = null
        state.user = null
        state.role = null
        state.permissions = []
        state.isAuthenticated = false
        state.challenge = null
        state.loginChallenge = null
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        // Still clear auth data even if logout fails
        state.accessToken = null
        state.refreshToken = null
        state.expiresIn = null
        state.user = null
        state.role = null
        state.permissions = []
        state.isAuthenticated = false
        state.challenge = null
        state.loginChallenge = null
        state.error = action.payload
        state.lastError = action.payload
      })
      
      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.isRefreshing = true
        state.error = null
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isRefreshing = false
        state.accessToken = action.payload.access_token
        if (action.payload.refresh_token) {
          state.refreshToken = action.payload.refresh_token
        }
        state.expiresIn = action.payload.expires_in
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isRefreshing = false
        state.error = action.payload
        state.lastError = action.payload
        state.accessToken = null
        state.refreshToken = null
        state.expiresIn = null
        state.user = null
        state.role = null
        state.permissions = []
        state.isAuthenticated = false
      })
      
      // Complete trial registration
      .addCase(completeTrialRegistration.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(completeTrialRegistration.fulfilled, (state, action) => {
        state.isLoading = false
        state.accessToken = action.payload.token
        state.expiresIn = action.payload.expiresIn
        state.user = action.payload.user
        state.company = action.payload.company
        state.role = action.payload.user.role
        state.permissions = action.payload.user.permissions || []
        state.isAuthenticated = true
        
        // Set company status in state for easy access
        state.companyStatus = action.payload.company.status
      })
      .addCase(completeTrialRegistration.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.lastError = action.payload
      })
  }
})

export const { clearError, setUser, clearAuth, updateTokens, updateNavigationData } = authSlice.actions

// Selectors
export const selectAuth = (state) => state.auth
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUser = (state) => state.auth.user
export const selectCompany = (state) => state.auth.company
export const selectCompanyStatus = (state) => state.auth.companyStatus || state.auth.company?.status
export const selectUserRole = (state) => state.auth.role
export const selectUserPermissions = (state) => state.auth.permissions
export const selectNavigation = (state) => state.auth.navigation
export const selectRoutes = (state) => state.auth.routes
export const selectDashboardUrl = (state) => state.auth.dashboardUrl
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
export const selectAccessToken = (state) => state.auth.accessToken
export const selectRefreshToken = (state) => state.auth.refreshToken
export const selectChallenge = (state) => state.auth.challenge
export const selectLoginChallenge = (state) => state.auth.loginChallenge

// Named export for the reducer
export const authReducer = authSlice.reducer

// Default export (kept for compatibility)
export default authSlice.reducer
