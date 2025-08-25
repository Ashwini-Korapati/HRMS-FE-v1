import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectUserRole } from '@/features/auth/authSlice'

export const RoleGuard = ({ children, allowedRoles, fallbackPath = '/profile' }) => {
  const userRole = useAppSelector(selectUserRole)

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={fallbackPath} replace />
  }

  return children
}
