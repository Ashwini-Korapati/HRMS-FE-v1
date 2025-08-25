import axios from 'axios'
import { HTTP_STATUS, STORAGE_KEYS } from '@/utils/constants'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// List of public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/api/health',
  '/api/info',
  '/api/plans',
  '/api/subscriptions',
  '/api/uas/health',
  '/api/uas/resolve-company',
  '/api/uas/companies',
  '/api/uas/validate-subdomain',
  '/api/uas/auth/challenge',
  '/api/uas/auth/login',
  '/api/uas/auth/token',
  '/api/uas/auth/logout'
]

// Helper function to check if endpoint is public
const isPublicEndpoint = (url) => {
  // Handle both relative and absolute URLs
  const pathname = url.startsWith('http') ? new URL(url).pathname : url
  
  return PUBLIC_ENDPOINTS.some(endpoint => {
    // Exact match or starts with the endpoint path
    return pathname === endpoint || pathname.startsWith(endpoint + '/')
  })
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Only add auth token for non-public endpoints
    if (!isPublicEndpoint(config.url)) {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // Add tenant headers for all endpoints (these are informational)
    const tenantInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.TENANT_INFO) || '{}')
    if (tenantInfo.companyId) {
      config.headers['X-Company-Id'] = tenantInfo.companyId
    }
    if (tenantInfo.subdomain) {
      config.headers['X-Subdomain'] = tenantInfo.subdomain
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { response, config } = error

    if (!response) {
      // Network error
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Network connection failed. Please check your internet connection.'
      })
    }

    const { status, data } = response

    // Handle different error types
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Try to refresh token first
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        if (refreshToken && !config._retry) {
          config._retry = true
          try {
            const refreshResponse = await axios.post(`${api.defaults.baseURL}/api/uas/auth/token`, {
              grant_type: 'refresh_token',
              refresh_token: refreshToken
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            
            const { access_token } = refreshResponse.data
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
            
            // Retry original request
            config.headers.Authorization = `Bearer ${access_token}`
            return api(config)
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.USER_INFO)
            
            // Redirect to login - handle in app level
            window.dispatchEvent(new CustomEvent('auth:logout'))
            
            return Promise.reject({
              code: 'AUTH_EXPIRED',
              message: 'Your session has expired. Please log in again.'
            })
          }
        } else {
          // No refresh token or refresh already tried
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER_INFO)
          
          window.dispatchEvent(new CustomEvent('auth:logout'))
          
          return Promise.reject({
            code: 'UNAUTHORIZED',
            message: 'You are not authorized to access this resource.'
          })
        }

      case HTTP_STATUS.FORBIDDEN:
        return Promise.reject({
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource.'
        })

      case HTTP_STATUS.NOT_FOUND:
        return Promise.reject({
          code: 'NOT_FOUND',
          message: 'The requested resource was not found.'
        })

      case HTTP_STATUS.CONFLICT:
        return Promise.reject({
          code: 'CONFLICT',
          message: data?.message || 'A conflict occurred with the current state of the resource.'
        })

      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return Promise.reject({
          code: 'VALIDATION_ERROR',
          message: data?.message || 'Invalid input data provided.',
          errors: data?.errors || {}
        })

      case HTTP_STATUS.TOO_MANY_REQUESTS:
        // Implement retry with exponential backoff
        const retryAfter = response.headers['retry-after'] || 5
        
        return new Promise((resolve, reject) => {
          setTimeout(async () => {
            try {
              const retryResponse = await api(config)
              resolve(retryResponse)
            } catch (retryError) {
              reject({
                code: 'RATE_LIMITED',
                message: 'Too many requests. Please try again later.'
              })
            }
          }, retryAfter * 1000)
        })

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
      case HTTP_STATUS.GATEWAY_TIMEOUT:
        return Promise.reject({
          code: 'SERVER_ERROR',
          message: 'A server error occurred. Please try again later.'
        })

      default:
        return Promise.reject({
          code: 'UNKNOWN_ERROR',
          message: data?.message || 'An unexpected error occurred.'
        })
    }
  }
)

export default api
