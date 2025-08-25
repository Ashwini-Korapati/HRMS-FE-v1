import React from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  ChartBarIcon,
  UsersIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { selectCompany, selectUser, selectCompanyStatus, selectNavigation } from '@/features/auth/authSlice'

const SmartDashboardCards = () => {
  const company = useSelector(selectCompany)
  const user = useSelector(selectUser)
  const companyStatus = useSelector(selectCompanyStatus)
  const navigation = useSelector(selectNavigation)
  const location = useLocation()
  const navigate = useNavigate()

  // Helper function to get route from navigation data
  const getNavigationRoute = (searchTerms) => {
    if (!navigation || !Array.isArray(navigation)) {
      return '/dashboard' // fallback route
    }

    // Search for navigation item by multiple possible labels
    const navItem = navigation.find(item => 
      searchTerms.some(term => 
        item.label.toLowerCase().includes(term.toLowerCase())
      )
    )

    if (navItem) {
      // Handle both URL and path formats
      if (navItem.url) {
        try {
          const url = new URL(navItem.url)
          return url.pathname
        } catch (error) {
          return navItem.path || '/dashboard'
        }
      } else {
        return navItem.path || '/dashboard'
      }
    }

    // Fallback to static route if not found in navigation
    return `/company/${searchTerms[0].toLowerCase()}`
  }

  // Helper function to create dynamic route based on current location
  const getDynamicActionLink = (searchTerms) => {
    const currentPath = location.pathname
    
    // If we're on an overview page (contains "overview"), extend the route
    if (currentPath.includes('/overview')) {
      // Get the base route (everything before and including "overview")
      const basePath = currentPath.split('/overview')[0] + '/overview'
      
      // Create sub-route based on search terms
      const subRoute = searchTerms[0].toLowerCase()
      return `${basePath}/${subRoute}`
    }
    
    // Otherwise, use the standard navigation route
    return getNavigationRoute(searchTerms)
  }

  const getTrialCards = () => [
    {
      id: 'welcome',
      title: 'Welcome to Your Trial!',
      description: `Hi ${user?.firstName}! Explore all HR features with your free trial.`,
      icon: SparklesIcon,
      iconColor: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      action: 'Setup Company',
      actionLink: getDynamicActionLink(['settings', 'company', 'setup'])
    },
    {
      id: 'employees',
      title: 'Add Employees',
      description: 'Start by adding your team members to the system.',
      icon: UsersIcon,
      iconColor: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      value: '0 / 10',
      action: 'Add Employees',
      actionLink: getDynamicActionLink(['employees', 'users', 'team'])
    },
    {
      id: 'departments',
      title: 'Create Departments',
      description: 'Organize your company structure with departments.',
      icon: BuildingOffice2Icon,
      iconColor: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-700',
      value: '0 / 5',
      action: 'Create Departments',
      actionLink: getDynamicActionLink(['departments', 'department'])
    },
    {
      id: 'attendance',
      title: 'Setup Attendance',
      description: 'Configure attendance tracking for your team.',
      icon: ClockIcon,
      iconColor: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20',
      borderColor: 'border-orange-200 dark:border-orange-700',
      action: 'Configure Attendance',
      actionLink: getDynamicActionLink(['attendance', 'time'])
    },
    {
      id: 'payroll',
      title: 'Setup Payroll',
      description: 'Configure salary structures and payroll settings.',
      icon: CurrencyDollarIcon,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700',
      action: 'Setup Payroll',
      actionLink: getDynamicActionLink(['payroll', 'salary'])
    },
    {
      id: 'upgrade',
      title: 'Upgrade to Premium',
      description: 'Unlock unlimited employees and advanced features.',
      icon: BoltIcon,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-700',
      action: 'View Plans',
      actionLink: getDynamicActionLink(['plans', 'subscription', 'billing']),
      highlighted: true
    }
  ]

  const getActiveCards = () => [
    {
      id: 'analytics',
      title: 'HR Analytics',
      description: 'View comprehensive reports and insights.',
      icon: ChartBarIcon,
      iconColor: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      value: 'View Reports',
      action: 'Open Analytics',
      actionLink: getDynamicActionLink(['analytics', 'reports', 'insights'])
    },
    {
      id: 'employees',
      title: 'Employee Management',
      description: 'Manage your team and employee records.',
      icon: UsersIcon,
      iconColor: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-700',
      value: 'Active Users',
      action: 'Manage Team',
      actionLink: getDynamicActionLink(['employees', 'users', 'team'])
    },
    {
      id: 'growth',
      title: 'Company Growth',
      description: 'Track your company\'s progress and metrics.',
      icon: ArrowTrendingUpIcon,
      iconColor: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      action: 'View Metrics',
      actionLink: getDynamicActionLink(['reports', 'analytics', 'metrics'])
    }
  ]

  const getExpiredCards = () => [
    {
      id: 'renewal',
      title: 'Renew Subscription',
      description: 'Your subscription has expired. Renew to continue.',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
      borderColor: 'border-red-200 dark:border-red-700',
      action: 'Renew Now',
      actionLink: getDynamicActionLink(['plans', 'subscription', 'billing']),
      highlighted: true
    }
  ]

  const getCards = () => {
    switch (companyStatus) {
      case 'TRIAL':
        return getTrialCards()
      case 'ACTIVE':
        return getActiveCards()
      case 'EXPIRED':
        return getExpiredCards()
      default:
        return getTrialCards()
    }
  }

  const cards = getCards()

  const handleCardAction = (actionLink) => {
    console.log('Navigating to:', actionLink)
    navigate(actionLink)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
            card.highlighted ? 'ring-2 ring-yellow-300 dark:ring-yellow-500' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                {card.highlighted && (
                  <div className="px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium">
                    Recommended
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {card.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {card.description}
              </p>

              {card.value && (
                <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
                  {card.value}
                </div>
              )}

              <button
                onClick={() => handleCardAction(card.actionLink)}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  card.highlighted
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {card.action}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SmartDashboardCards
