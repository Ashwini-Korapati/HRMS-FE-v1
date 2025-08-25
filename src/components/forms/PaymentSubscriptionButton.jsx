import React, { useState } from 'react'
import { CreditCardIcon } from '@heroicons/react/24/outline'
import PaymentSubscriptionModal from './PaymentSubscriptionModal'

const PaymentSubscriptionButton = ({ 
  plan = null, 
  className = '', 
  children = 'Subscribe Now', 
  variant = 'primary' 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const baseClasses = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg focus:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg focus:ring-green-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500"
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        <CreditCardIcon className="h-5 w-5 mr-2" />
        {children}
      </button>
      
      <PaymentSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={plan}
      />
    </>
  )
}

export default PaymentSubscriptionButton
