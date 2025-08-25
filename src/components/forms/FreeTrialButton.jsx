import React, { useState } from 'react'
import { GiftIcon } from '@heroicons/react/24/outline'
import { StartFreeTrialModal } from './StartFreeTrialModal'

const FreeTrialButton = ({ 
  plan = null, 
  className = '', 
  children = 'Start Free Trial', 
  variant = 'secondary' 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const baseClasses = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500",
    secondary: "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg focus:ring-green-500",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500",
    ghost: "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 focus:ring-green-500"
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        <GiftIcon className="h-5 w-5 mr-2" />
        {children}
      </button>
      
      <StartFreeTrialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={plan}
      />
    </>
  )
}

export default FreeTrialButton
