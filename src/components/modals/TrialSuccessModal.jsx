import React from 'react'
import { useSelector } from 'react-redux'
import { 
  CheckCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  SparklesIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { selectCompany, selectUser, selectCompanyStatus } from '@/features/auth/authSlice'

const TrialSuccessModal = ({ isOpen, onClose }) => {
  const company = useSelector(selectCompany)
  const user = useSelector(selectUser)
  const companyStatus = useSelector(selectCompanyStatus)

  if (!isOpen || !company || !user) return null

  const handleGetStarted = () => {
    onClose()
    window.location.href = '/hr/overview'
  }

  const handleViewPlans = () => {
    onClose()
    window.location.href = '/plans'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🎉 Welcome to HR Management!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your free trial is now active and ready to use.
              </p>
            </div>

            {/* Company & User Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{company.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Company ID: {company.companyCode}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <SparklesIcon className="h-3 w-3 mr-1" />
                    {companyStatus}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <UserIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {user.role} • {user.employeeId}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Next Steps:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Explore your HR dashboard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Add your team members</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Set up departments and roles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Configure attendance tracking</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGetStarted}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Get Started
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
              
              <button
                onClick={handleViewPlans}
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-300 dark:border-gray-600 transition-colors duration-200"
              >
                View Premium Plans
              </button>
            </div>

            {/* Trial Note */}
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                🚀 Your trial includes full access to all features. Upgrade anytime for unlimited usage!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrialSuccessModal
