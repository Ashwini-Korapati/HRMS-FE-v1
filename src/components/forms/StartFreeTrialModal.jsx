import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { httpClient } from '@/api/endpoints'
import { completeTrialRegistration } from '@/features/auth/authSlice'
import TrialSuccessModal from '@/components/modals/TrialSuccessModal'
import {
  XMarkIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

// Validation schemas
const trialFormSchema = z.object({
  adminFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  adminLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid email address'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits')
})

export const StartFreeTrialModal = ({ isOpen, onClose, selectedPlan = null }) => {
  const dispatch = useDispatch()
  const [step, setStep] = useState('form') // 'form', 'otp', 'success'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [trialData, setTrialData] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  const otpRefs = useRef([])

  // Form for trial registration
  const trialForm = useForm({
    resolver: zodResolver(trialFormSchema),
    defaultValues: {
      adminFirstName: '',
      adminLastName: '',
      adminEmail: '',
      companyName: '',
      adminPassword: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  })

  // Form for OTP verification
  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ''
    }
  })

  // Timer for OTP resend
  useEffect(() => {
    let interval = null
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => timer - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('form')
      setOtpTimer(0)
      setUserEmail('')
      setTrialData(null)
      trialForm.reset()
      otpForm.reset()
    }
  }, [isOpen, trialForm, otpForm])

  const handleTrialSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      
      // Prepare payload in the exact format expected by the API
      const payload = {
        companyName: data.companyName,
        adminFirstName: data.adminFirstName,
        adminLastName: data.adminLastName,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword
      }
      
      // API call to register for trial
      const response = await httpClient.post('/api/auth/register-trial', payload)
      
      if (response.data.success) {
        setUserEmail(data.adminEmail)
        setTrialData(response.data.trial)
        setStep('otp')
        setOtpTimer(300) // 5 minutes
        toast.success('Registration successful! Please check your email for OTP.')
      } else {
        toast.error(response.data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Trial registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      
      const response = await httpClient.post('/api/auth/verify-trial-otp', {
        email: userEmail,
        otpCode: data.otp
      })
      
      if (response.data.success) {
        // Dispatch the auth action to store user data and authenticate
        await dispatch(completeTrialRegistration(response.data))
        
        setStep('success')
        setShowSuccessModal(true)
        toast.success('Email verified successfully! Your free trial is now active.')
      } else {
        toast.error(response.data.message || 'Invalid OTP')
        otpForm.setError('otp', { message: 'Invalid OTP. Please try again.' })
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      toast.error(error.response?.data?.message || 'OTP verification failed')
      otpForm.setError('otp', { message: 'Verification failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setIsSubmitting(true)
      
      const response = await httpClient.post('/api/auth/resend-trial-otp', {
        email: userEmail
      })
      
      if (response.data.success) {
        setOtpTimer(300) // Reset to 5 minutes
        toast.success('OTP resent successfully!')
      } else {
        toast.error(response.data.message || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Failed to resend OTP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpInput = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = otpForm.getValues('otp').split('')
      newOtp[index] = value
      otpForm.setValue('otp', newOtp.join(''))
      
      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
              <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {step === 'form' && 'Start Your Free Trial'}
                {step === 'otp' && 'Verify Your Email'}
                {step === 'success' && 'Welcome Aboard!'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step === 'form' && `Get started with ${selectedPlan?.name || 'Professional'} plan`}
                {step === 'otp' && 'Enter the verification code sent to your email'}
                {step === 'success' && 'Your free trial is now active'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Registration Form */}
          {step === 'form' && (
            <form onSubmit={trialForm.handleSubmit(handleTrialSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Admin Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin First Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...trialForm.register('adminFirstName')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="John"
                      />
                    </div>
                    {trialForm.formState.errors.adminFirstName && (
                      <p className="text-red-500 text-sm mt-1">{trialForm.formState.errors.adminFirstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Last Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...trialForm.register('adminLastName')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Doe"
                      />
                    </div>
                    {trialForm.formState.errors.adminLastName && (
                      <p className="text-red-500 text-sm mt-1">{trialForm.formState.errors.adminLastName.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Email Address *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...trialForm.register('adminEmail')}
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="admin@company.com"
                      />
                    </div>
                    {trialForm.formState.errors.adminEmail && (
                      <p className="text-red-500 text-sm mt-1">{trialForm.formState.errors.adminEmail.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Company Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                      <input
                        {...trialForm.register('companyName')}
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Your Company Name"
                      />
                    </div>
                    {trialForm.formState.errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">{trialForm.formState.errors.companyName.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Account Security
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Admin Password *
                    </label>
                    <div className="relative">
                      <input
                        {...trialForm.register('adminPassword')}
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
                    {trialForm.formState.errors.adminPassword && (
                      <p className="text-red-500 text-sm mt-1">{trialForm.formState.errors.adminPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        {...trialForm.register('confirmPassword')}
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
                    {trialForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{trialForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  {...trialForm.register('agreeToTerms')}
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
              {trialForm.formState.errors.agreeToTerms && (
                <p className="text-red-500 text-sm">{trialForm.formState.errors.agreeToTerms.message}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  'Start Free Trial'
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  <EnvelopeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Check Your Email
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We've sent a 6-digit verification code to
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {userEmail}
                </p>
              </div>

              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Enter Verification Code
                  </label>
                  <div className="flex justify-center space-x-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        ref={el => otpRefs.current[index] = el}
                        type="text"
                        maxLength="1"
                        value={otpForm.watch('otp')[index] || ''}
                        onChange={(e) => handleOtpInput(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ))}
                  </div>
                  {otpForm.formState.errors.otp && (
                    <p className="text-red-500 text-sm mt-2">{otpForm.formState.errors.otp.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || otpForm.watch('otp').length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
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
                    disabled={isSubmitting || otpTimer > 0}
                    className="text-blue-600 hover:text-blue-500 disabled:text-gray-400 font-medium"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                >
                  ← Back to registration
                </button>
              </form>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to Your Free Trial!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your account has been successfully created and verified. You now have access to all {selectedPlan?.name || 'Professional'} features for 30 days.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="font-semibold text-blue-900 dark:text-blue-100">Trial Details</span>
                  </div>
                  <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <p>• Plan: {selectedPlan?.name || 'Professional'}</p>
                    <p>• Duration: 30 days</p>
                    <p>• Employee Limit: {selectedPlan?.maxEmployees || '100'}</p>
                    <p>• Full feature access included</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onClose()
                      // Redirect to dashboard
                      window.location.href = '/dashboard'
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <TrialSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false)
          onClose()
        }} 
      />
    </div>
  )
}
