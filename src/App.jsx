import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectIsAuthenticated, selectUser, selectDashboardUrl, selectUserRole, selectNavigation, fetchUserInfo, logout } from '@/features/auth/authSlice'
import { initializeTenant, selectCompanyId } from '@/features/tenant/tenantSlice'
import { setPageTitle } from '@/features/ui/uiSlice'
import { STORAGE_KEYS } from '@/utils/constants'

// Layout components
import { ToastContainer } from '@/components/ui/Toast'
import { PublicLayout } from '@/layouts/PublicLayout'

// Public pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { UASLoginPage } from '@/pages/auth/UASLoginPage'
import { SubscribePage } from '@/pages/public/SubscribePage'
import { PlansPage } from '@/pages/public/PlansPage'
import { HealthPage } from '@/pages/public/HealthPage'
import { AuthTestPage } from '@/pages/auth/AuthTestPage'

// Protected pages
import AdminDashboard from '@/pages/AdminDashboard'

// Dynamic components
import DynamicRoutes from '@/components/Routing/DynamicRoutes'
import EnhancedLayout from '@/components/Layout/EnhancedLayout'

// Route guards
import { ProtectedRoute } from '@/routes/ProtectedRoute'

// Error components
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'

function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)
  const userRole = useAppSelector(selectUserRole)
  const dashboardUrl = useAppSelector(selectDashboardUrl)
  const navigation = useAppSelector(selectNavigation)
  const companyId = useAppSelector(selectCompanyId)

  // Initialize app
  useEffect(() => {
    dispatch(setPageTitle('HR Office Management'))
    dispatch(initializeTenant())

    // Check for existing auth token and fetch user info
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token && !user) {
      dispatch(fetchUserInfo())
    }

    // Listen for auth logout events from interceptors
    const handleAuthLogout = () => {
      dispatch(logout())
    }

    window.addEventListener('auth:logout', handleAuthLogout)
    return () => window.removeEventListener('auth:logout', handleAuthLogout)
  }, [dispatch, user])

  // Handle post-login navigation for admin users using dashboard_url
  useEffect(() => {
    if (isAuthenticated && user && userRole === 'ADMIN') {
      const currentPath = window.location.pathname
      
      // If user is on login page or root, redirect to dashboard URL
      if (currentPath === '/uas/login' || currentPath === '/uas/portal/auth/login' || currentPath === '/') {
        if (dashboardUrl) {
          try {
            const url = new URL(dashboardUrl)
            console.log('Redirecting admin to dashboard URL:', url.pathname)
            navigate(url.pathname, { replace: true })
          } catch (error) {
            console.error('Invalid dashboard URL:', dashboardUrl, error)
            // Fallback to first navigation item if dashboard URL is invalid
            if (navigation && navigation.length > 0) {
              const firstNav = navigation[0]
              const navPath = firstNav.url ? new URL(firstNav.url).pathname : firstNav.path
              console.log('Fallback to first navigation item:', navPath)
              navigate(navPath, { replace: true })
            }
          }
        } else if (navigation && navigation.length > 0) {
          // If no dashboard URL, use first navigation item (usually Dashboard)
          const firstNav = navigation[0]
          const navPath = firstNav.url ? new URL(firstNav.url).pathname : firstNav.path
          console.log('No dashboard URL, using first navigation item:', navPath)
          navigate(navPath, { replace: true })
        }
      }
    } else if (isAuthenticated && user && navigation && navigation.length > 0) {
      // For non-admin users, also redirect to first navigation item
      const currentPath = window.location.pathname
      if (currentPath === '/uas/login' || currentPath === '/uas/portal/auth/login' || currentPath === '/') {
        const firstNav = navigation[0]
        const navPath = firstNav.url ? new URL(firstNav.url).pathname : firstNav.path
        console.log('Redirecting non-admin user to first navigation item:', navPath)
        navigate(navPath, { replace: true })
      }
    }
  }, [isAuthenticated, user, userRole, dashboardUrl, navigation, navigate])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Routes>
          {/* Public routes */}
          <Route path="/uas/login" element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          } />
          
          <Route path="/uas/portal/auth/login" element={
            <PublicLayout>
              <UASLoginPage />
            </PublicLayout>
          } />
          
          <Route path="/subscribe" element={
            <PublicLayout>
              <SubscribePage />
            </PublicLayout>
          } />
          
          <Route path="/plans" element={
            <PublicLayout>
              <PlansPage />
            </PublicLayout>
          } />
          
          <Route path="/health" element={
            <PublicLayout>
              <HealthPage />
            </PublicLayout>
          } />
          
          <Route path="/auth-test" element={
            <PublicLayout>
              <AuthTestPage />
            </PublicLayout>
          } />
          
          <Route path="/debug/auth-test" element={
            <PublicLayout>
              <AuthTestPage />
            </PublicLayout>
          } />
          
          <Route path="/status" element={<Navigate to="/health" replace />} />

          {/* Protected routes with fully dynamic navigation */}
          <Route path="/*" element={
            <ProtectedRoute>
              <EnhancedLayout />
            </ProtectedRoute>
          }>
            {/* Root redirect - use dashboard URL from token response */}
            <Route index element={
              isAuthenticated ? (
                userRole === 'ADMIN' ? (
                  dashboardUrl ? (
                    <Navigate to={new URL(dashboardUrl).pathname} replace />
                  ) : navigation && navigation.length > 0 ? (
                    <Navigate to={navigation[0].url ? new URL(navigation[0].url).pathname : navigation[0].path} replace />
                  ) : (
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading Dashboard...</h1>
                        <p className="text-gray-600 dark:text-gray-300">Please wait while we load your dashboard.</p>
                      </div>
                    </div>
                  )
                ) : navigation && navigation.length > 0 ? (
                  <Navigate to={navigation[0].url ? new URL(navigation[0].url).pathname : navigation[0].path} replace />
                ) : (
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading Dashboard...</h1>
                      <p className="text-gray-600 dark:text-gray-300">Please wait while we load your dashboard.</p>
                    </div>
                  </div>
                )
              ) : (
                <Navigate to="/uas/login" replace />
              )
            } />
            
            {/* Dynamic routes based on navigation from token response */}
            <Route path="*" element={<DynamicRoutes />} />
          </Route>
        </Routes>

        {/* Global components */}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  )
}

export default App
