import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { 
  loginWithChallenge,
  exchangeToken,
  fetchUserInfo,
  selectAuthLoading,
  selectAuthError,
  clearError
} from '@/features/auth/authSlice'
import { STORAGE_KEYS } from '@/utils/constants'
import { showError, showSuccess } from '@/features/ui/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, FormField } from '@/components/ui/Form'
import { LoadingSpinner } from '@/components/ui/Loading'
import { AlertCircle, Building, ArrowLeft } from 'lucide-react'

export const UASLoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [companyInfo, setCompanyInfo] = useState(null)
  const [email, setEmail] = useState('')
  
  const isLoading = useAppSelector(selectAuthLoading)
  const authError = useAppSelector(selectAuthError)
  
  const loginChallenge = searchParams.get('login_challenge')

  useEffect(() => {
    // Get company info and email from localStorage or URL params
    const storedCompany = localStorage.getItem('uas_company_info')
    const storedEmail = localStorage.getItem('uas_email')
    
    if (storedCompany) {
      setCompanyInfo(JSON.parse(storedCompany))
    }
    
    if (storedEmail) {
      setEmail(storedEmail)
    }
    
    // Clear any previous errors
    dispatch(clearError())
  }, [dispatch])

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!password || !loginChallenge || !email) return

    try {
      const result = await dispatch(loginWithChallenge({
        loginChallenge,
        email,
        password,
        rememberMe
      })).unwrap()

      // Clear stored data
      localStorage.removeItem('uas_company_info')
      localStorage.removeItem('uas_email')

      if (result.redirectUrl) {
        // OAuth flow - redirect to the provided URL
        window.location.href = result.redirectUrl
      } else if (result.user) {
        // Direct login success - redirect to user dashboard
        const userId = result.user.id
        const companyId = result.user.companyId
        
        dispatch(showSuccess({ message: 'Successfully logged in!' }))
        
        // Redirect based on user role and structure
        if (result.user.role === 'ADMIN') {
          navigate(`/c/${companyId}/overview`)
        } else {
          navigate(`/u/${userId}/dashboard`)
        }
      } else if (result.authorizationCode) {
        // We got an authorization code, trigger token exchange
        const clientId = import.meta.env.VITE_UAS_CLIENT_ID
        const clientSecret = import.meta.env.VITE_UAS_CLIENT_SECRET
        const redirectUri = `${window.location.origin}/uas/login`
        
        try {
          await dispatch(exchangeToken({
            code: result.authorizationCode,
            clientId,
            clientSecret,
            redirectUri
          })).unwrap()
          
          // Try to fetch user info
          try {
            await dispatch(fetchUserInfo()).unwrap()
          } catch (userInfoError) {
            console.log('User info fetch failed, using token data instead')
          }
          
          // Get user info and redirect
          const currentUser = JSON.parse(localStorage.getItem('uas_user_info') || localStorage.getItem(STORAGE_KEYS.USER_INFO) || 'null')
          
          if (currentUser) {
            if (currentUser.role === 'ADMIN') {
              navigate(`/c/${currentUser.companyId}/overview`)
            } else {
              navigate(`/u/${currentUser.id}/dashboard`)
            }
          } else {
            navigate('/')
          }
          
          dispatch(showSuccess({ message: 'Successfully logged in!' }))
        } catch (tokenError) {
          dispatch(showError({ message: 'Token exchange failed' }))
        }
      } else {
        // Fallback navigation
        navigate('/')
        dispatch(showSuccess({ message: 'Successfully logged in!' }))
      }
    } catch (error) {
      dispatch(showError({ message: error.message || 'Invalid credentials' }))
    }
  }

  const handleBackToEmail = () => {
    // Clear stored data and go back to main login
    localStorage.removeItem('uas_company_info')
    localStorage.removeItem('uas_email')
    navigate('/uas/login')
  }

  if (!loginChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Login Session</h2>
            <p className="text-gray-600 mb-4">
              No login challenge found. Please start the login process again.
            </p>
            <Button onClick={() => navigate('/uas/login')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
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
            Enter your password to continue
          </p>
        </div>

        {/* Company context */}
        {companyInfo && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              {companyInfo.logo ? (
                <img 
                  src={companyInfo.logo} 
                  alt={companyInfo.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {companyInfo.name}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {companyInfo.subdomain}.hroffice.com
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User context */}
        {email && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Signing in as:
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {email}
            </p>
          </div>
        )}

        {/* Error display */}
        {authError && (
          <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400" />
              <p className="text-sm text-error-800 dark:text-error-200">
                {authError?.message || 'An error occurred'}
              </p>
            </div>
          </div>
        )}

        {/* Password form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Use different email
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Debug info */}
        {import.meta.env.DEV && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1">
                <p><strong>Login Challenge:</strong> {loginChallenge}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Company:</strong> {companyInfo?.name}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
