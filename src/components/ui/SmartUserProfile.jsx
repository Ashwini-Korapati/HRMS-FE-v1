import React from 'react'
import { useSelector } from 'react-redux'
import { 
  BuildingOfficeIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { selectCompany, selectUser, selectCompanyStatus } from '@/features/auth/authSlice'

const SmartUserProfile = () => {
  const company = useSelector(selectCompany)
  const user = useSelector(selectUser)
  const companyStatus = useSelector(selectCompanyStatus)

  if (!user || !company) return null

  const getStatusBadge = () => {
    switch (companyStatus) {
      case 'TRIAL':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <StarIcon className="h-3 w-3 mr-1" />
            Trial
          </span>
        )
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <ShieldCheckIcon className="h-3 w-3 mr-1" />
            Premium
          </span>
        )
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <ClockIcon className="h-3 w-3 mr-1" />
            Expired
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* User Avatar */}
      <div className="flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user.firstName} {user.lastName}
          </p>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center space-x-1 mt-1">
          <BuildingOfficeIcon className="h-3 w-3 text-gray-400" />
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {company.name}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.role}
          </p>
          <p className="text-xs font-mono text-gray-400">
            {user.employeeId}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SmartUserProfile
