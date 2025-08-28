
// @/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { publicApi, authenticatedApi } from '@/api/endpoints'
import { STORAGE_KEYS } from '@/utils/constants'


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
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const loginWithChallenge = createAsyncThunk(
  'auth/loginWithChallenge', 
  async ({ login_challenge, email, password }, { rejectWithValue }) => {
    try {
      const response = await publicApi.login({
        login_challenge,
        email,
        password
      })
      return response.data
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
      
      const { access_token, refresh_token, expires_in } = response.data
      
      // Store tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
      if (refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
      }
      
      return { access_token, refresh_token, expires_in }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedApi.getUserInfo()
      const userInfo = response.data
      
      // Store user info
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
      
      return userInfo
    } catch (error) {
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
      
      const { access_token, refresh_token: new_refresh_token, expires_in } = response.data
      
      // Update stored tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
      if (new_refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, new_refresh_token)
      }
      
      return { access_token, refresh_token: new_refresh_token, expires_in }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  challenge: null,
  loginChallenge: null,
  tokenExpiresAt: null
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setTokens: (state, action) => {
      const { access_token, refresh_token, expires_in } = action.payload
      state.accessToken = access_token
      state.refreshToken = refresh_token
      state.isAuthenticated = true
      
      if (expires_in) {
        state.tokenExpiresAt = Date.now() + (expires_in * 1000)
      }
    },
    clearAuth: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.tokenExpiresAt = null
      state.challenge = null
      state.loginChallenge = null
      state.error = null
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
      })
      
      // Login with Challenge
      .addCase(loginWithChallenge.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginWithChallenge.fulfilled, (state, action) => {
        state.isLoading = false
        state.loginChallenge = action.payload
      })
      .addCase(loginWithChallenge.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Exchange Token
      .addCase(exchangeToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(exchangeToken.fulfilled, (state, action) => {
        state.isLoading = false
        const { access_token, refresh_token, expires_in } = action.payload
        state.accessToken = access_token
        state.refreshToken = refresh_token
        state.isAuthenticated = true
        
        if (expires_in) {
          state.tokenExpiresAt = Date.now() + (expires_in * 1000)
        }
      })
      .addCase(exchangeToken.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Fetch User Info
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.tokenExpiresAt = null
        state.challenge = null
        state.loginChallenge = null
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        // Still clear auth state even if logout fails
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.tokenExpiresAt = null
        state.challenge = null
        state.loginChallenge = null
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false
        const { access_token, refresh_token, expires_in } = action.payload
        state.accessToken = access_token
        if (refresh_token) {
          state.refreshToken = refresh_token
        }
        state.isAuthenticated = true
        
        if (expires_in) {
          state.tokenExpiresAt = Date.now() + (expires_in * 1000)
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.accessToken = null
        state.refreshToken = null
        state.tokenExpiresAt = null
      })
  }
})

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUser = (state) => state.auth.user
export const selectUserRole = (state) => state.auth.user?.role
export const selectAccessToken = (state) => state.auth.accessToken
export const selectRefreshToken = (state) => state.auth.refreshToken
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
export const selectChallenge = (state) => state.auth.challenge
export const selectLoginChallenge = (state) => state.auth.loginChallenge
export const selectTokenExpiresAt = (state) => state.auth.tokenExpiresAt

// NEW: Company-related selectors
export const selectCompany = (state) => state.auth.user?.company || null
export const selectCompanyId = (state) => 
  state.auth.user?.company?.id || state.auth.user?.companyId || null

// Actions
export const { clearError, setTokens, clearAuth } = authSlice.actions

// Reducer
export default authSlice.reducer