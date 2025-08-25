import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  SparklesIcon,
  UsersIcon,
  BuildingOffice2Icon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { selectCompany, selectUser, selectCompanyStatus } from '@/features/auth/authSlice'

const WelcomeTour = ({ isOpen, onClose }) => {
  const company = useSelector(selectCompany)
  const user = useSelector(selectUser)
  const companyStatus = useSelector(selectCompanyStatus)
  const [currentStep, setCurrentStep] = useState(0)

  // Only show tour for trial users who just registered
  if (!isOpen || companyStatus !== 'TRIAL') return null

  const tourSteps = [
    {
      title: '🎉 Welcome to Your HR Management Trial!',
      description: `Hi ${user?.firstName}! Let's take a quick tour to get you started with your new HR management system.`,
      icon: SparklesIcon,
      color: 'purple',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Your Trial Includes:</h4>
            <ul className="space-y-1 text-sm text-purple-800 dark:text-purple-200">
              <li>• All premium features unlocked</li>
              <li>• Up to 50 employees</li>
              <li>• Complete HR management suite</li>
              <li>• 30 days free trial</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '👥 Employee Management',
      description: 'Start by adding your team members and organizing your workforce.',
      icon: UsersIcon,
      color: 'blue',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Add Employees</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">Import or manually add</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Manage Roles</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">Set permissions</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Navigate to <strong>Employees</strong> in the sidebar to get started.
          </p>
        </div>
      )
    },
    {
      title: '🏢 Company Structure',
      description: 'Organize your company with departments, designations, and hierarchies.',
      icon: BuildingOffice2Icon,
      color: 'green',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <div className="text-sm font-medium text-green-900 dark:text-green-100">Create Departments</div>
                <div className="text-xs text-green-600 dark:text-green-300">HR, Engineering, Sales, etc.</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <div className="text-sm font-medium text-green-900 dark:text-green-100">Define Designations</div>
                <div className="text-xs text-green-600 dark:text-green-300">Manager, Developer, Analyst, etc.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '⏰ Attendance Tracking',
      description: 'Set up attendance policies and track your team\'s working hours.',
      icon: ClockIcon,
      color: 'orange',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Attendance Features:</h4>
            <ul className="space-y-1 text-sm text-orange-800 dark:text-orange-200">
              <li>• Clock in/out tracking</li>
              <li>• Break time management</li>
              <li>• Overtime calculations</li>
              <li>• Attendance reports</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '💰 Payroll Management',
      description: 'Configure salary structures and automate payroll processing.',
      icon: CurrencyDollarIcon,
      color: 'emerald',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Salary Setup</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-300">Base pay + allowances</div>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Tax Calculations</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-300">Automated deductions</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '📊 Analytics & Reports',
      description: 'Get insights into your workforce with comprehensive analytics.',
      icon: ChartBarIcon,
      color: 'indigo',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Available Reports:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-indigo-800 dark:text-indigo-200">
              <div>• Attendance reports</div>
              <div>• Payroll summaries</div>
              <div>• Leave analytics</div>
              <div>• Performance metrics</div>
            </div>
          </div>
          <div className="text-center">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
              Explore Dashboard
            </button>
          </div>
        </div>
      )
    }
  ]

  const currentStepData = tourSteps[currentStep]
  const isLastStep = currentStep === tourSteps.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      // Mark tour as completed and close
      localStorage.setItem('welcomeTourCompleted', 'true')
      onClose()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('welcomeTourCompleted', 'true')
    onClose()
  }

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-600 dark:text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-600 dark:text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-600 dark:text-green-400',
        button: 'bg-green-600 hover:bg-green-700'
      },
      orange: {
        bg: 'bg-orange-100 dark:bg-orange-900',
        text: 'text-orange-600 dark:text-orange-400',
        button: 'bg-orange-600 hover:bg-orange-700'
      },
      emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900',
        text: 'text-emerald-600 dark:text-emerald-400',
        button: 'bg-emerald-600 hover:bg-emerald-700'
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900',
        text: 'text-indigo-600 dark:text-indigo-400',
        button: 'bg-indigo-600 hover:bg-indigo-700'
      }
    }
    return colors[color] || colors.blue
  }

  const colorClasses = getColorClasses(currentStepData.color)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-6 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                  <currentStepData.icon className={`h-6 w-6 ${colorClasses.text}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentStepData.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Step {currentStep + 1} of {tourSteps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${colorClasses.button}`}
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 px-6 pb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {currentStepData.description}
            </p>

            {currentStepData.content}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={isFirstStep}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  isFirstStep
                    ? 'text-gray-400 border-gray-200 dark:border-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep
                        ? colorClasses.button.split(' ')[0]
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className={`flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${colorClasses.button}`}
              >
                {isLastStep ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </div>

            {/* Skip option */}
            <div className="text-center mt-4">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Skip tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeTour
