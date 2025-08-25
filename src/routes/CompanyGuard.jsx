import React, { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { selectCompanyId, selectTenantLoading, setTenantContext } from '@/features/tenant/tenantSlice'
import { selectUserRole } from '@/features/auth/authSlice'
import { LoadingSpinner } from '@/components/ui/Loading'

export const CompanyGuard = ({ children }) => {
  const dispatch = useAppDispatch()
  const { companyId: routeCompanyId } = useParams()
  const currentCompanyId = useAppSelector(selectCompanyId)
  const isLoading = useAppSelector(selectTenantLoading)
  const userRole = useAppSelector(selectUserRole)

  useEffect(() => {
    // If route has companyId but we don't have it in state, set it
    if (routeCompanyId && routeCompanyId !== currentCompanyId) {
      dispatch(setTenantContext({
        companyId: routeCompanyId,
        subdomain: null, // Will be resolved later
        company: null
      }))
    }
  }, [routeCompanyId, currentCompanyId, dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Users with IT or SUPER_ADMIN roles can access any company
  if (userRole === 'IT' || userRole === 'SUPER_ADMIN') {
    return children
  }

  // Regular users need to have a matching company context
  if (!routeCompanyId || routeCompanyId !== currentCompanyId) {
    return <Navigate to="/profile" replace />
  }

  return children
}
