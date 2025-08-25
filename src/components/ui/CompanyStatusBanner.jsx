import React from 'react'
import { useSelector } from 'react-redux'
import { 
  ExclamationTriangleIcon, 
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  CreditCardIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { selectCompany, selectCompanyStatus, selectUser } from '@/features/auth/authSlice'

const CompanyStatusBanner = () => {
  const company = useSelector(selectCompany)
  const companyStatus = useSelector(selectCompanyStatus)
  const user = useSelector(selectUser)

  if (!company || !companyStatus) return null

  const getStatusConfig = () => {
    switch (companyStatus) {
      case 'TRIAL':
        return {
          icon: SparklesIcon,
          bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
          borderColor: 'border-purple-200 dark:border-purple-700',
          iconColor: 'text-purple-600 dark:text-purple-400',
          textColor: 'text-purple-900 dark:text-purple-100',
          title: 'Free Trial Active',
          message: `Welcome to your HR Management trial, ${user?.firstName}! Explore all features.`,
          action: 'Upgrade to Premium',
          actionColor: 'bg-purple-600 hover:bg-purple-700 text-white'
        }
      case 'ACTIVE':
        return {
          icon: CheckCircleIcon,
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
          borderColor: 'border-green-200 dark:border-green-700',
          iconColor: 'text-green-600 dark:text-green-400',
          textColor: 'text-green-900 dark:text-green-100',
          title: 'Premium Account',
          message: `${company.name} is actively subscribed with full access to all features.`,
          action: 'Manage Subscription',
          actionColor: 'bg-green-600 hover:bg-green-700 text-white'
        }
      case 'EXPIRED':
        return {
          icon: ExclamationTriangleIcon,
          bgColor: 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
          borderColor: 'border-red-200 dark:border-red-700',
          iconColor: 'text-red-600 dark:text-red-400',
          textColor: 'text-red-900 dark:text-red-100',
          title: 'Subscription Expired',
          message: 'Your subscription has expired. Renew now to continue using all features.',
          action: 'Renew Subscription',
          actionColor: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'SUSPENDED':
        return {
          icon: ClockIcon,
          bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          textColor: 'text-yellow-900 dark:text-yellow-100',
          title: 'Account Suspended',
          message: 'Your account is temporarily suspended. Contact support for assistance.',
          action: 'Contact Support',
          actionColor: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }
      default:
        return null
    }
  }

  const statusConfig = getStatusConfig()
  if (!statusConfig) return null

  const handleActionClick = () => {
    switch (companyStatus) {
      case 'TRIAL':
        // Redirect to subscription plans
        window.location.href = '/plans'
        break
      case 'ACTIVE':
        // Redirect to subscription management
        window.location.href = '/account/subscription'
        break
      case 'EXPIRED':
        // Redirect to renewal page
        window.location.href = '/plans'
        break
      case 'SUSPENDED':
        // Open support contact
        window.location.href = 'mailto:support@hrmanagement.com'
        break
    }
  }

  return (
    <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-4 mb-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
            <statusConfig.icon className={`h-6 w-6 ${statusConfig.iconColor}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold text-sm ${statusConfig.textColor}`}>
                {statusConfig.title}
              </h3>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <BuildingOfficeIcon className="h-3 w-3" />
                <span>{company.companyCode}</span>
              </div>
            </div>
            <p className={`text-sm ${statusConfig.textColor} opacity-90 mt-1`}>
              {statusConfig.message}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {companyStatus === 'TRIAL' && (
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Company ID
              </div>
              <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {company.id?.slice(0, 8)}...
              </div>
            </div>
          )}
          
          <button
            onClick={handleActionClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${statusConfig.actionColor}`}
          >
            {statusConfig.action}
          </button>
        </div>
      </div>

      {/* Additional Trial Information */}
      {companyStatus === 'TRIAL' && (
        <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-purple-600 dark:text-purple-400 font-medium">Created</div>
              <div className={statusConfig.textColor}>
                {new Date(company.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-purple-600 dark:text-purple-400 font-medium">Timezone</div>
              <div className={statusConfig.textColor}>
                {company.timezone || 'UTC'}
              </div>
            </div>
            <div>
              <div className="text-purple-600 dark:text-purple-400 font-medium">Admin</div>
              <div className={statusConfig.textColor}>
                {user?.firstName} {user?.lastName}
              </div>
            </div>
            <div>
              <div className="text-purple-600 dark:text-purple-400 font-medium">Employee ID</div>
              <div className={`font-mono text-xs ${statusConfig.textColor}`}>
                {user?.employeeId}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyStatusBanner
