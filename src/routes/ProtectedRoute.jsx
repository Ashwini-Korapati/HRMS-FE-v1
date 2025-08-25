import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectIsAuthenticated, selectAuthLoading } from '@/features/auth/authSlice'
import { LoadingSpinner } from '@/components/ui/Loading'

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoading = useAppSelector(selectAuthLoading)
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login with the current location as return URL
    const returnUrl = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/uas/login?returnUrl=${returnUrl}`} replace />
  }

  return children
}
