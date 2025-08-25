import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { publicApi } from '@/api/endpoints'
import { 
  XMarkIcon as CloseIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  GlobeAltIcon,
  IdentificationIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  CreditCardIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

// Enhanced validation schemas with real-world business requirements
const customerInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional()
})

const companyInfoSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  email: z.string().email('Invalid company email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  taxId: z.string().optional(),
  timezone: z.string().default('UTC'),
  industry: z.string().optional(),
  companySize: z.string().optional()
})

const adminInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid admin email address'),
  phone: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: z.string(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const otpSchema = z.object({
  otpCode: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers')
})

const PaymentSubscriptionModal = ({ isOpen, onClose, selectedPlan }) => {
  const [currentStep, setCurrentStep] = useState('customer') // customer, company, admin, payment, otp, success
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [otpTimer, setOtpTimer] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const otpRefs = useRef([])

  // Initialize OTP refs array
  useEffect(() => {
    otpRefs.current = Array(6).fill(null)
  }, [])

  // Form instances for each step
  const customerForm = useForm({ resolver: zodResolver(customerInfoSchema) })
  const companyForm = useForm({ resolver: zodResolver(companyInfoSchema) })
  const adminForm = useForm({ resolver: zodResolver(adminInfoSchema) })
  const otpForm = useForm({ 
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: ''
    }
  })

  // OTP Timer Effect
  useEffect(() => {
    let timer = null
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [otpTimer])

  // Reset form when modal closes and handle body scroll
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('customer')
      setOtpTimer(0)
      setPaymentData(null)
      customerForm.reset()
      companyForm.reset()
      adminForm.reset()
      otpForm.reset({ otpCode: '' })
      // Re-enable body scroll
      document.body.style.overflow = 'unset'
    } else {
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }
    
    // Cleanup function to ensure body scroll is restored
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, customerForm, companyForm, adminForm, otpForm])

  const handleCustomerInfoSubmit = (data) => {
    setCurrentStep('company')
  }

  const handleCompanyInfoSubmit = (data) => {
    setCurrentStep('admin')
  }

  const handleAdminInfoSubmit = (data) => {
    setCurrentStep('payment')
  }

  const handlePaymentInitiate = async () => {
    try {
      setLoading(true)
      
      // Validate plan ID exists
      if (!selectedPlan?.id) {
        throw new Error('No plan selected')
      }
      
      // Accept both UUID and numeric plan ID formats from API
      const planId = selectedPlan.id.toString().trim()
      if (!planId) {
        throw new Error('Invalid plan ID: empty or undefined')
      }
      
      console.log(`Initiating payment for plan ID: ${planId} (${selectedPlan.name})`)
      
      const customerData = customerForm.getValues()
      const companyData = companyForm.getValues()
      const adminData = adminForm.getValues()

      const paymentPayload = {
        email: customerData.email,
        planId: selectedPlan.id,
        customerInfo: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          address: customerData.address
        },
        subscriptionData: {
          company: {
            name: companyData.name,
            email: companyData.email,
            phone: companyData.phone,
            address: companyData.address,
            website: companyData.website,
            taxId: companyData.taxId,
            timezone: companyData.timezone || 'UTC',
            workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
            workingHours: {
              start: '09:00',
              end: '17:00'
            }
          },
          admin: {
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            email: adminData.email,
            phone: adminData.phone,
            password: adminData.password,
            dateOfBirth: adminData.dateOfBirth,
            gender: adminData.gender
          },
          trialDays: 0,
          metadata: {
            source: 'website_payment',
            customFields: {
              industry: companyData.industry,
              companySize: companyData.companySize
            }
          }
        }
      }

      console.log('Initiating payment with payload:', paymentPayload)
      const response = await publicApi.initiatePayment(paymentPayload)
      console.log('Payment API Response:', response.data)
      
      if (response.data.success) {
        const responseData = response.data.data
        setPaymentData(responseData)
        
        // Calculate timer from API expiry (convert to seconds)
        const expiryDate = new Date(responseData.otpExpiry)
        const currentDate = new Date()
        const timeDifferenceSeconds = Math.max(0, Math.floor((expiryDate - currentDate) / 1000))
        
        setCurrentStep('otp')
        setOtpTimer(timeDifferenceSeconds || 600) // Fallback to 10 minutes if calculation fails
        
        toast.success(`Payment OTP sent to ${responseData.email}. Check your email for the 6-digit code.`)
        console.log(`OTP sent to: ${responseData.email}, Transaction ID: ${responseData.transactionId}`)
      } else {
        toast.error(response.data.message || 'Failed to initiate payment')
      }
    } catch (error) {
      console.error('Payment initiation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Payment initiation failed'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (data) => {
    try {
      setLoading(true)
      
      const verifyPayload = {
        transactionId: paymentData.transactionId,
        email: paymentData.email,
        otpCode: data.otpCode
      }

      console.log('Verifying OTP with payload:', verifyPayload)
      const response = await publicApi.verifyPaymentOtp(verifyPayload)
      
      if (response.data.success) {
        setCurrentStep('success')
        toast.success('Payment verified and subscription created successfully!')
      } else {
        const errorMessage = response.data.message || 'Invalid OTP code'
        toast.error(errorMessage)
        if (response.data.remainingAttempts !== undefined) {
          toast.warning(`${response.data.remainingAttempts} attempts remaining`)
        }
        otpForm.setError('otpCode', { message: errorMessage })
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'OTP verification failed'
      toast.error(errorMessage)
      otpForm.setError('otpCode', { message: 'Verification failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setLoading(true)
      
      const resendPayload = {
        transactionId: paymentData.transactionId,
        email: paymentData.email
      }

      const response = await publicApi.resendPaymentOtp(resendPayload)
      console.log('Resend OTP API Response:', response.data)
      
      if (response.data.success) {
        // Update payment data if new expiry is provided
        if (response.data.data?.otpExpiry) {
          setPaymentData(prev => ({ ...prev, ...response.data.data }))
          
          // Calculate timer from new API expiry
          const expiryDate = new Date(response.data.data.otpExpiry)
          const currentDate = new Date()
          const timeDifferenceSeconds = Math.max(0, Math.floor((expiryDate - currentDate) / 1000))
          setOtpTimer(timeDifferenceSeconds || 600)
        } else {
          setOtpTimer(600) // Fallback to 10 minutes
        }
        
        toast.success('OTP resent successfully! Check your email.')
      } else {
        toast.error(response.data.message || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Failed to resend OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const currentOtpValue = otpForm.getValues('otpCode') || ''
      const currentOtp = currentOtpValue.split('')
      
      // Ensure the array has 6 elements
      while (currentOtp.length < 6) {
        currentOtp.push('')
      }
      
      currentOtp[index] = value
      otpForm.setValue('otpCode', currentOtp.join(''))
      
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {['customer', 'company', 'admin', 'payment', 'otp'].map((step, index) => {
        const stepNumber = index + 1
        const isActive = currentStep === step
        const isCompleted = ['customer', 'company', 'admin', 'payment'].indexOf(currentStep) > index
        
        return (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              isCompleted ? 'bg-green-500 border-green-500 text-white' :
              isActive ? 'bg-blue-500 border-blue-500 text-white' :
              'bg-gray-100 border-gray-300 text-gray-500'
            }`}>
              {isCompleted ? <CheckCircleIcon className="w-5 h-5" /> : stepNumber}
            </div>
            {index < 4 && (
              <div className={`w-12 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )

  if (!isOpen) return null

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" 
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-[10001]">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
              <CreditCardIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentStep === 'success' ? 'Subscription Complete!' : `Subscribe to ${selectedPlan?.name}`}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStep === 'success' ? 'Welcome to your new HR Management system!' : 
                 `${selectedPlan?.formattedPrice || selectedPlan?.price} per month`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CloseIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {currentStep !== 'success' && renderStepIndicator()}

          {/* Customer Information Step */}
          {currentStep === 'customer' && (
            <form onSubmit={customerForm.handleSubmit(handleCustomerInfoSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...customerForm.register('firstName')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="John"
                      />
                    </div>
                    {customerForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{customerForm.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...customerForm.register('lastName')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Doe"
                      />
                    </div>
                    {customerForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{customerForm.formState.errors.lastName.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...customerForm.register('email')}
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    {customerForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{customerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...customerForm.register('phone')}
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="+1-555-123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...customerForm.register('address')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="123 Main Street, City, State"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Continue to Company Info
                </button>
              </div>
            </form>
          )}

          {/* Company Information Step */}
          {currentStep === 'company' && (
            <form onSubmit={companyForm.handleSubmit(handleCompanyInfoSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...companyForm.register('name')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Acme Corporation"
                      />
                    </div>
                    {companyForm.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">{companyForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Email *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...companyForm.register('email')}
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="admin@acme.com"
                      />
                    </div>
                    {companyForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{companyForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Phone
                    </label>
                    <div className="relative">
                      <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...companyForm.register('phone')}
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="+1-555-COMPANY"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...companyForm.register('website')}
                        type="url"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="https://acme.com"
                      />
                    </div>
                    {companyForm.formState.errors.website && (
                      <p className="text-red-500 text-sm mt-1">{companyForm.formState.errors.website.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax ID
                    </label>
                    <div className="relative">
                      <IdentificationIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...companyForm.register('taxId')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="123-45-6789"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Address
                    </label>
                    <div className="relative">
                      <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...companyForm.register('address')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="456 Business Ave, Suite 100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    <select
                      {...companyForm.register('industry')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Size
                    </label>
                    <select
                      {...companyForm.register('companySize')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Company Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('customer')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Continue to Admin Setup
                </button>
              </div>
            </form>
          )}

          {/* Admin Information Step */}
          {currentStep === 'admin' && (
            <form onSubmit={adminForm.handleSubmit(handleAdminInfoSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Administrator Account</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin First Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...adminForm.register('firstName')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="John"
                      />
                    </div>
                    {adminForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{adminForm.formState.errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Last Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...adminForm.register('lastName')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Doe"
                      />
                    </div>
                    {adminForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{adminForm.formState.errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Email *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...adminForm.register('email')}
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="john.doe@acme.com"
                      />
                    </div>
                    {adminForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{adminForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Phone
                    </label>
                    <div className="relative">
                      <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...adminForm.register('phone')}
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="+1-555-ADMIN"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        {...adminForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                    {adminForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">{adminForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        {...adminForm.register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                    {adminForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{adminForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      {...adminForm.register('dateOfBirth')}
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    <select
                      {...adminForm.register('gender')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-start">
                    <input
                      {...adminForm.register('agreeToTerms')}
                      type="checkbox"
                      id="agreeToTerms"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {adminForm.formState.errors.agreeToTerms && (
                    <p className="text-red-500 text-sm mt-1">{adminForm.formState.errors.agreeToTerms.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('company')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* Payment Summary Step */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
                
                {/* Plan Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">{selectedPlan?.name}</h4>
                      <p className="text-blue-700 dark:text-blue-300">{selectedPlan?.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {selectedPlan?.formattedPrice || selectedPlan?.price}
                      </div>
                      <div className="text-blue-700 dark:text-blue-300">per month</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Max Employees:</span> {selectedPlan?.maxEmployees}
                    </div>
                    <div>
                      <span className="font-medium">Currency:</span> {selectedPlan?.currency}
                    </div>
                  </div>
                  
                  {selectedPlan?.features && (
                    <div className="mt-4">
                      <span className="font-medium text-blue-900 dark:text-blue-100">Features included:</span>
                      <ul className="grid md:grid-cols-2 gap-1 mt-2 text-sm text-blue-700 dark:text-blue-300">
                        {selectedPlan.features.slice(0, 6).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Security Notice */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">Secure Payment Processing</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Your payment will be processed securely. An OTP will be sent to your email for verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('admin')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentInitiate}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      Initiate Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* OTP Verification Step */}
          {currentStep === 'otp' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  <EnvelopeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Verify Payment</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  We've sent a 6-digit verification code to
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">{paymentData?.email}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-1">
                  <p>Transaction ID: {paymentData?.transactionId}</p>
                  {paymentData?.amount && paymentData?.currency && (
                    <p>Amount: {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: paymentData.currency
                    }).format(paymentData.amount)}</p>
                  )}
                </div>
              </div>

              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                    Enter 6-Digit Payment Verification Code
                  </label>
                  <div className="flex justify-center space-x-3">
                    {[0, 1, 2, 3, 4, 5].map(index => {
                      const otpValue = otpForm.watch('otpCode') || ''
                      return (
                        <input
                          key={index}
                          ref={el => otpRefs.current[index] = el}
                          type="text"
                          maxLength="1"
                          value={otpValue[index] || ''}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      )
                    })}
                  </div>
                  {otpForm.formState.errors.otpCode && (
                    <p className="text-red-500 text-sm mt-2 text-center">{otpForm.formState.errors.otpCode.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || (otpForm.watch('otpCode') || '').length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Verifying Payment...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-5 w-5 mr-2" />
                      Verify & Complete Payment
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {otpTimer > 0 ? formatTime(otpTimer) : 'Expired'}
                  </div>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || otpTimer > 0}
                    className="text-blue-600 hover:text-blue-500 disabled:text-gray-400 font-medium"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep('payment')}
                  className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                >
                  ← Back to Payment Summary
                </button>
              </form>
            </div>
          )}

          {/* Success Step */}
          {currentStep === 'success' && (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your subscription has been activated and your HR management system is ready to use.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4">What's Next?</h4>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    Check your email for login credentials and setup instructions
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    Access your admin dashboard to configure your HR system
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    Start adding employees and setting up your organization
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    Explore all the features included in your {selectedPlan?.name}
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose()
                    window.location.href = '/uas/login'
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Go to Login
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default PaymentSubscriptionModal
