import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { publicApi } from '@/api/endpoints'
import PaymentSubscriptionButton from '@/components/forms/PaymentSubscriptionButton'
import FreeTrialButton from '@/components/forms/FreeTrialButton'
import { 
  CheckIcon, 
  XMarkIcon, 
  StarIcon,
  UsersIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export const PlansPage = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async (isRetry = false) => {
    try {
      setLoading(true)
      if (!isRetry) {
        setError(null)
        setRetryCount(0)
      }
      
      console.log(`Fetching payment plans from API: GET /api/payments/plans`)
      
      // Fetch active plans from the payment API endpoint
      const response = await publicApi.getPaymentPlans({ currency: 'USD' })
      console.log('Payment Plans API Response:', response.data)
      
      // Handle payment API response structure
      let plansData = []
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        plansData = response.data.data
      } else if (response.data && Array.isArray(response.data)) {
        plansData = response.data
      } else {
        console.warn('Unexpected Payment API response structure:', response.data)
        plansData = []
      }
      
      // If we got data from API, normalize and use it; otherwise fallback to mock
      if (plansData.length > 0) {
        const normalizedPlans = plansData.map(normalizePlanData)
        console.log('Normalized plans from API:', normalizedPlans.map(p => ({ id: p.id, name: p.name, idType: typeof p.id })))
        setPlans(normalizedPlans)
        setError(null) // Clear any previous errors
        console.log('Successfully loaded plans from API:', normalizedPlans)
      } else {
        console.log('No plans returned from API, using mock data')
        setPlans(getMockPlans())
        if (!isRetry) {
          setError('No plans available from API - showing demo plans')
        }
      }
    } catch (err) {
      console.error('Error fetching plans:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error'
      setError(`Failed to load subscription plans: ${errorMessage}`)
      
      // Always fallback to mock data on error
      setPlans(getMockPlans())
      
      // Auto-retry once after 2 seconds if first attempt fails
      if (!isRetry && retryCount < 1) {
        console.log('Retrying API call in 2 seconds...')
        setRetryCount(prev => prev + 1)
        setTimeout(() => {
          fetchPlans(true)
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const getMockPlans = () => [
    {
      id: '12345678-1234-1234-1234-123456789abc',
      name: 'Starter',
      description: 'Perfect for small teams just getting started',
      price: 29,
      currency: 'USD',
      interval: 'month',
      maxEmployees: 10,
      isActive: true,
      features: [
        'Up to 10 employees',
        'Basic HR management',
        'Employee records',
        'Leave management',
        'Basic reporting',
        'Email support',
        '99% uptime SLA'
      ],
      limitations: [
        'No advanced analytics',
        'Limited integrations',
        'Basic customization'
      ],
      popular: false,
      buttonText: 'Start Free Trial'
    },
    {
      id: '12345678-1234-1234-1234-123456789def',
      name: 'Professional',
      description: 'Ideal for growing businesses with advanced needs',
      price: 79,
      currency: 'USD',
      interval: 'month',
      maxEmployees: 100,
      isActive: true,
      features: [
        'Up to 100 employees',
        'Advanced HR management',
        'Performance tracking',
        'Payroll processing',
        'Time & attendance',
        'Advanced reporting',
        'API integrations',
        'Priority support',
        '99.9% uptime SLA',
        'Custom workflows'
      ],
      limitations: [
        'Limited white-labeling'
      ],
      popular: true,
      buttonText: 'Start Free Trial'
    },
    {
      id: '12345678-1234-1234-1234-123456789ghi',
      name: 'Enterprise',
      description: 'Comprehensive solution for large organizations',
      price: 199,
      currency: 'USD',
      interval: 'month',
      maxEmployees: null, // Unlimited
      isActive: true,
      features: [
        'Unlimited employees',
        'Full HR suite',
        'Advanced analytics',
        'Custom integrations',
        'White-label options',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom onboarding',
        '99.99% uptime SLA',
        'Advanced security',
        'Compliance tools',
        'Multi-location support'
      ],
      limitations: [],
      popular: false,
      buttonText: 'Contact Sales'
    }
  ]

  // Helper function to normalize plan data from API
  const normalizePlanData = (plan) => {
    // Handle different feature structures
    let features = []
    let limitations = []
    let planType = 'monthly'
    
    if (plan.features) {
      if (Array.isArray(plan.features)) {
        // Simple array of features
        features = plan.features
      } else if (typeof plan.features === 'object') {
        // Complex features object with core, limits, advanced, bonus
        const featureObj = plan.features
        
        // Combine all feature types
        features = [
          ...(featureObj.core || []),
          ...(featureObj.advanced || []),
          ...(featureObj.bonus || [])
        ]
        
        // Add limits as additional features
        if (featureObj.limits) {
          Object.entries(featureObj.limits).forEach(([key, value]) => {
            if (value) {
              features.push(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            }
          })
        }
      }
    }
    
    // Detect billing cycle from name or price
    if (plan.name.toLowerCase().includes('annual')) {
      planType = 'year'
    }
    
    // Determine if plan is popular (Professional plans tend to be popular)
    const isPopular = plan.name.toLowerCase().includes('professional') && !plan.name.toLowerCase().includes('annual')
    
    // Ensure plan ID is properly handled (convert to string if needed)
    const planId = (plan.id || plan._id || '').toString()
    if (!planId) {
      console.warn('Plan missing ID:', plan)
    }
    
    return {
      id: planId,
      name: plan.name || plan.title,
      description: plan.description || plan.subtitle || '',
      price: plan.price || plan.cost || plan.amount || 0,
      currency: plan.currency || 'USD',
      interval: planType,
      maxEmployees: plan.maxEmployees || plan.max_employees || plan.employeeLimit,
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      features: features,
      limitations: limitations,
      popular: isPopular,
      buttonText: plan.price > 150 ? 'Contact Sales' : 'Start Free Trial',
      originalFeatures: plan.features // Keep original for detailed view
    }
  }

  const formatPrice = (price, currency = 'USD', interval = 'month') => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
    
    // For annual plans, show monthly equivalent
    if (interval === 'year') {
      const monthlyPrice = price / 12
      const monthlyFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(monthlyPrice)
      return { annual: formattedPrice, monthly: monthlyFormatted }
    }
    
    return { main: formattedPrice }
  }

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return <UsersIcon className="h-8 w-8" />
      case 'professional':
        return <ChartBarIcon className="h-8 w-8" />
      case 'enterprise':
        return <ShieldCheckIcon className="h-8 w-8" />
      default:
        return <CurrencyDollarIcon className="h-8 w-8" />
    }
  }

  const getPlanColor = (planName, popular) => {
    if (popular) {
      return {
        border: 'border-blue-500',
        header: 'bg-gradient-to-r from-blue-500 to-blue-600',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        badge: 'bg-blue-100 text-blue-800'
      }
    }
    
    const name = planName.toLowerCase()
    
    if (name.includes('basic') || name.includes('starter')) {
      return {
        border: 'border-green-200',
        header: 'bg-gradient-to-r from-green-500 to-green-600',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700 text-white',
        badge: 'bg-green-100 text-green-800'
      }
    }
    
    if (name.includes('enterprise')) {
      return {
        border: 'border-purple-200',
        header: 'bg-gradient-to-r from-purple-500 to-purple-600',
        icon: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        badge: 'bg-purple-100 text-purple-800'
      }
    }
    
    if (name.includes('annual')) {
      return {
        border: 'border-orange-200',
        header: 'bg-gradient-to-r from-orange-500 to-orange-600',
        icon: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700 text-white',
        badge: 'bg-orange-100 text-orange-800'
      }
    }
    
    // Default
    return {
      border: 'border-gray-200',
      header: 'bg-gradient-to-r from-gray-500 to-gray-600',
      icon: 'text-gray-600',
      button: 'bg-gray-600 hover:bg-gray-700 text-white',
      badge: 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading payment plans...</p>
        </div>
      </div>
    )
  }

  if (error && plans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Payment Plans</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => fetchPlans(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Retrying...' : 'Try Again'}
            </button>
            <p className="text-xs text-gray-500">
              If the problem persists, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
            <SparklesIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the ideal subscription plan for your organization. Start with a free trial and scale as you grow.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-200 rounded-lg inline-block">
              <p className="text-sm text-yellow-800">
                <ClockIcon className="h-4 w-4 inline mr-2" />
                Showing cached plans due to connection issues
              </p>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const colors = getPlanColor(plan.name, plan.popular)
            const pricing = formatPrice(plan.price, plan.currency, plan.interval)
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg ${colors.border} border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                } ${plan.interval === 'year' ? 'ring-1 ring-orange-300' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${colors.badge}`}>
                      <StarIcon className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Annual Savings Badge */}
                {plan.interval === 'year' && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Save $
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className={`${colors.header} text-white p-6 rounded-t-2xl`}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-full">
                      {getPlanIcon(plan.name)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">{plan.name}</h3>
                  <p className="text-white text-opacity-90 text-center text-sm line-clamp-2">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="p-6 text-center border-b border-gray-200">
                  {plan.interval === 'year' ? (
                    <div>
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                          {pricing.monthly}
                        </span>
                        <span className="text-gray-500 ml-1 text-lg">
                          /month
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Billed annually at {pricing.annual}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                        {pricing.main}
                      </span>
                      <span className="text-gray-500 ml-2">
                        /{plan.interval}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {plan.maxEmployees 
                      ? `Up to ${plan.maxEmployees} employees` 
                      : 'Unlimited employees'
                    }
                  </p>
                </div>

                {/* Features */}
                <div className="p-6 flex-1">
                  <h4 className="font-semibold text-gray-900 mb-4">Features included:</h4>
                  <ul className="space-y-2">
                    {plan.features?.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                    {plan.features?.length > 6 && (
                      <li className="text-sm text-blue-600 font-medium">
                        + {plan.features.length - 6} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="p-6 pt-0 space-y-3">
                  <PaymentSubscriptionButton
                    plan={plan}
                    className="w-full py-3 px-6"
                    variant="primary"
                  >
                    {plan.price > 0 ? 'Subscribe Now' : 'Get Started'}
                  </PaymentSubscriptionButton>
                  
                  <FreeTrialButton
                    plan={plan}
                    className="w-full py-2 px-6"
                    variant="outline"
                  >
                    Start Free Trial
                  </FreeTrialButton>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    {plan.interval === 'year' ? 'Billed annually • ' : ''}30-day free trial • Cancel anytime
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need help choosing the right plan?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our team is here to help you find the perfect solution for your organization's needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Contact Sales
            </button>
            <FreeTrialButton
              className="px-6 py-3"
              variant="secondary"
              plan={plans.find(p => p.name.toLowerCase().includes('professional')) || plans[0]}
            >
              Start Free Trial
            </FreeTrialButton>
            <PaymentSubscriptionButton
              className="px-6 py-3"
              variant="primary"
              plan={plans.find(p => p.name.toLowerCase().includes('professional')) || plans[0]}
            >
              Subscribe Now
            </PaymentSubscriptionButton>
          </div>
        </div>

        {/* Detailed Features Comparison */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Compare All Features
          </h3>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 sticky left-0 bg-gray-50">
                      Features
                    </th>
                    {plans.filter(plan => !plan.name.toLowerCase().includes('annual')).slice(0, 4).map(plan => (
                      <th key={plan.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900 min-w-[150px]">
                        <div className="flex flex-col items-center">
                          <span className="font-bold">{plan.name}</span>
                          <span className="text-xs font-normal text-gray-600 mt-1">
                            {formatPrice(plan.price, plan.currency, plan.interval).main || formatPrice(plan.price, plan.currency, plan.interval).monthly}
                            /{plan.interval === 'year' ? 'mo' : plan.interval}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium sticky left-0 bg-white">
                      Employee Limit
                    </td>
                    {plans.filter(plan => !plan.name.toLowerCase().includes('annual')).slice(0, 4).map(plan => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.maxEmployees ? plan.maxEmployees : 'Unlimited'}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium sticky left-0 bg-gray-50">
                      Core Features
                    </td>
                    {plans.filter(plan => !plan.name.toLowerCase().includes('annual')).slice(0, 4).map(plan => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        <div className="space-y-1">
                          {plan.originalFeatures?.core?.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="text-xs">{feature}</div>
                          )) || (
                            <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                          )}
                          {plan.originalFeatures?.core?.length > 3 && (
                            <div className="text-xs text-blue-600">
                              +{plan.originalFeatures.core.length - 3} more
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium sticky left-0 bg-white">
                      Storage
                    </td>
                    {plans.filter(plan => !plan.name.toLowerCase().includes('annual')).slice(0, 4).map(plan => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.originalFeatures?.limits?.storage || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium sticky left-0 bg-gray-50">
                      Support Level
                    </td>
                    {plans.filter(plan => !plan.name.toLowerCase().includes('annual')).slice(0, 4).map(plan => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.originalFeatures?.limits?.support || 'Standard'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium sticky left-0 bg-white">
                      Advanced Features
                    </td>
                    {plans.filter(plan => !plan.name.toLowerCase().includes('annual')).slice(0, 4).map(plan => (
                      <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {plan.originalFeatures?.advanced?.length > 0 ? (
                          <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Annual Plans Section */}
        {plans.some(plan => plan.name.toLowerCase().includes('annual')) && (
          <div className="mt-16">
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Annual Plans - Save More
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.filter(plan => plan.name.toLowerCase().includes('annual')).map((plan) => {
                const colors = getPlanColor(plan.name, false)
                const pricing = formatPrice(plan.price, plan.currency, plan.interval)
                
                return (
                  <div
                    key={plan.id}
        className={`relative bg-white rounded-2xl shadow-lg ${colors.border} border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ring-1 ring-orange-300`}
                  >
                    {/* Savings Badge */}
                    <div className="absolute -top-3 -right-3 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        Save 20%+
                      </span>
                    </div>

                    {/* Plan Header */}
                    <div className={`${colors.header} text-white p-6 rounded-t-2xl`}>
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-white bg-opacity-20 rounded-full">
                          {getPlanIcon(plan.name)}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">{plan.name}</h3>
                      <p className="text-white text-opacity-90 text-center text-sm line-clamp-2">{plan.description}</p>
                    </div>

                    {/* Pricing */}
                    <div className="p-6 text-center border-b border-gray-200">
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                          {pricing.monthly}
                        </span>
                        <span className="text-gray-500 ml-1 text-lg">
                          /month
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Billed annually at {pricing.annual}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {plan.maxEmployees 
                          ? `Up to ${plan.maxEmployees} employees` 
                          : 'Unlimited employees'
                        }
                      </p>
                    </div>

                    {/* Features */}
                    <div className="p-6 flex-1">
                      <h4 className="font-semibold text-gray-900 mb-4">Features included:</h4>
                      <ul className="space-y-2">
                        {plan.features?.slice(0, 5).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm leading-tight">{feature}</span>
                          </li>
                        ))}
                        {plan.features?.length > 5 && (
                          <li className="text-sm text-blue-600 font-medium">
                            + {plan.features.length - 5} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="p-6 pt-0 space-y-3">
                      <PaymentSubscriptionButton
                        plan={plan}
                        className="w-full py-3 px-6"
                        variant="primary"
                      >
                        {plan.price > 0 ? 'Subscribe Now' : 'Get Started'}
                      </PaymentSubscriptionButton>
                      
                      <FreeTrialButton
                        plan={plan}
                        className="w-full py-2 px-6"
                        variant="outline"
                      >
                        Start Free Trial
                      </FreeTrialButton>
                      
                      <p className="text-xs text-gray-500 text-center mt-3">
                        Billed annually • 30-day free trial • Cancel anytime
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
