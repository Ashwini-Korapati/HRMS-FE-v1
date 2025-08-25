import React from 'react'
import { StartFreeTrialButton } from '@/components/forms'
import { 
  SparklesIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export const TrialDemoPage = () => {
  const demoPlans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small teams',
      price: 29,
      currency: 'USD',
      interval: 'month',
      maxEmployees: 10
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing companies',
      price: 79,
      currency: 'USD',
      interval: 'month',
      maxEmployees: 100
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      price: 199,
      currency: 'USD',
      interval: 'month',
      maxEmployees: null
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <SparklesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Start Your Free Trial
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Experience the power of our HR management system with a 30-day free trial. 
            No credit card required, cancel anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <StartFreeTrialButton 
              className="px-8 py-4 text-lg"
              variant="primary"
            >
              Start 30-Day Free Trial
            </StartFreeTrialButton>
            <StartFreeTrialButton 
              plan={demoPlans[1]}
              className="px-8 py-4 text-lg"
              variant="outline"
            >
              Try Professional Plan
            </StartFreeTrialButton>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Credit Card Required
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start your trial instantly without any payment information.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                30-Day Full Access
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get complete access to all features for a full month.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cancel Anytime
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No long-term commitments. Cancel your trial anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Choose Your Trial Plan
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {demoPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    /{plan.interval}
                  </span>
                </div>

                <div className="flex items-center justify-center mb-6 text-sm text-gray-600 dark:text-gray-400">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {plan.maxEmployees ? `Up to ${plan.maxEmployees} employees` : 'Unlimited employees'}
                </div>

                <StartFreeTrialButton
                  plan={plan}
                  className="w-full py-3"
                  variant={plan.id === 'professional' ? 'primary' : 'outline'}
                >
                  Start Free Trial
                </StartFreeTrialButton>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your HR Management?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of companies that have streamlined their HR processes with our platform.
          </p>
          
          <StartFreeTrialButton 
            className="px-8 py-4 text-lg"
            variant="primary"
          >
            Get Started Now - It's Free!
          </StartFreeTrialButton>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            30-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}
