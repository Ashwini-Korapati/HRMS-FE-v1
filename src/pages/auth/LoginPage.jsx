import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { 
  uasChallenge, 
  loginWithChallenge, 
  exchangeToken, 
  fetchUserInfo,
  selectAuthLoading,
  selectAuthError,
  selectChallenge,
  selectLoginChallenge,
  clearError
} from '@/features/auth/authSlice'
import { 
  resolveCompanyBySubdomain,
  selectSubdomain,
  selectTenantError,
  selectTenantResolving
} from '@/features/tenant/tenantSlice'
import { showError, showSuccess } from '@/features/ui/uiSlice'
import { STORAGE_KEYS } from '@/utils/constants'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Label, FormField } from '@/components/ui/Form'
import { LoadingSpinner } from '@/components/ui/Loading'
import { AlertCircle, Building } from 'lucide-react'

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [step, setStep] = useState('email') // 'email', 'password', 'processing'
  
  const isLoading = useAppSelector(selectAuthLoading)
  const authError = useAppSelector(selectAuthError)
  const challenge = useAppSelector(selectChallenge)
  const loginChallenge = useAppSelector(selectLoginChallenge)
  const subdomain = useAppSelector(selectSubdomain)
  const tenantError = useAppSelector(selectTenantError)
  const tenantResolving = useAppSelector(selectTenantResolving)

  // Check for OAuth callback
  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    
    if (code) {
      handleTokenExchange(code, state)
    }
  }, [searchParams])

  // Initialize tenant context if subdomain present
  useEffect(() => {
    if (subdomain && step === 'email') {
      dispatch(resolveCompanyBySubdomain(subdomain))
    }
  }, [subdomain, dispatch, step])

  const handleTokenExchange = async (code, state) => {
    setStep('processing')
    
    try {
      const clientId = import.meta.env.VITE_UAS_CLIENT_ID
      const clientSecret = import.meta.env.VITE_UAS_CLIENT_SECRET
      const redirectUri = `${window.location.origin}/uas/login`
      
      // Exchange the code for tokens
      const tokenResult = await dispatch(exchangeToken({
        code,
        clientId,
        clientSecret,
        redirectUri
      })).unwrap()
      
      // Try to fetch user info (fallback to token data if it fails)
      try {
        await dispatch(fetchUserInfo()).unwrap()
      } catch (userInfoError) {
        console.log('User info fetch failed, using token data instead')
        // User info is already extracted from tokens in the exchangeToken reducer
      }
      
      const returnUrl = searchParams.get('returnUrl') || '/'
      
      // Get dashboard URL and navigation data from token response
      const dashboardUrl = localStorage.getItem(STORAGE_KEYS.DASHBOARD_URL)
      const navigationData = JSON.parse(localStorage.getItem(STORAGE_KEYS.NAVIGATION_DATA) || '[]')
      const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INFO) || 'null')
      
      console.log('Login redirect data:', { dashboardUrl, navigationData, currentUser })
      
      if (dashboardUrl) {
        // Use dashboard URL from token response (preferred)
        try {
          const url = new URL(dashboardUrl)
          console.log('Redirecting to dashboard URL:', url.pathname)
          navigate(url.pathname)
        } catch (error) {
          console.error('Invalid dashboard URL:', dashboardUrl, error)
          // Fallback to first navigation item
          if (navigationData && navigationData.length > 0) {
            const firstNavUrl = navigationData[0].url ? new URL(navigationData[0].url).pathname : navigationData[0].path
            console.log('Fallback to first navigation item:', firstNavUrl)
            navigate(firstNavUrl)
          } else {
            navigate(decodeURIComponent(returnUrl))
          }
        }
      } else if (navigationData && navigationData.length > 0) {
        // Use first navigation item as fallback
        const firstNavUrl = navigationData[0].url ? new URL(navigationData[0].url).pathname : navigationData[0].path
        console.log('Using first navigation item:', firstNavUrl)
        navigate(firstNavUrl)
      } else {
        // Final fallback to return URL
        console.log('Using return URL fallback:', returnUrl)
        navigate(decodeURIComponent(returnUrl))
      }
      
      dispatch(showSuccess({ message: 'Successfully logged in!' }))
    } catch (error) {
      console.error('Token exchange failed:', error)
      dispatch(showError({ message: error.message || 'Login failed' }))
      setStep('email')
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    dispatch(clearError())
    setStep('password')

    try {
      const clientId = import.meta.env.VITE_UAS_CLIENT_ID
      const scope = import.meta.env.VITE_UAS_SCOPE
      const redirectUri = `${window.location.origin}/uas/login`
      const state = Math.random().toString(36).substring(7)
      
      // Store email for the UAS login page
      localStorage.setItem('uas_email', email)
      
      const result = await dispatch(uasChallenge({
        email,
        clientId,
        redirectUri,
        scope,
        state,
        responseType: 'code'
      })).unwrap()
      
      // Store company info for the UAS login page
      if (result.company) {
        localStorage.setItem('uas_company_info', JSON.stringify(result.company))
      }
      
      // The uasChallenge thunk will handle the redirect if loginUrl is present
    } catch (error) {
      dispatch(showError({ message: error.message || 'Failed to initialize login' }))
      setStep('email')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!password || !challenge) return

    try {
      const result = await dispatch(loginWithChallenge({
        loginChallenge: challenge.loginChallenge,
        email,
        password,
        rememberMe
      })).unwrap()

      if (result.redirect_to) {
        window.location.href = result.redirect_to
      }
    } catch (error) {
      dispatch(showError({ message: error.message || 'Invalid credentials' }))
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setPassword('')
    setRememberMe(false)
    dispatch(clearError())
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Completing login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">HR</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your HR Office account
          </p>
        </div>

        {/* Company context */}
        {subdomain && !tenantError && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Signing in to: {subdomain}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {subdomain}.hroffice.com
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {(authError || tenantError) && (
          <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400" />
              <p className="text-sm text-error-800 dark:text-error-200">
                {authError?.message || tenantError?.message || 'An error occurred'}
              </p>
            </div>
          </div>
        )}

        {/* Login form */}
        <Card>
          <CardContent className="pt-6">
            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <FormField label="Email address" required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </FormField>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || tenantResolving || !email}
                  loading={isLoading || tenantResolving}
                >
                  Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Signing in as:</p>
                  <p className="font-medium text-gray-900 dark:text-white">{email}</p>
                </div>

                <FormField label="Password" required>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    autoFocus
                  />
                </FormField>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !password}
                    loading={isLoading}
                  >
                    Sign In
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={handleBackToEmail}
                  >
                    Use different email
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer links */}
        <div className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/subscribe" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up for HR Office
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
