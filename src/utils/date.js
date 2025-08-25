import { format, parseISO, isValid } from 'date-fns'
import { DATE_FORMATS } from './constants'

/**
 * Format a date string or Date object for display
 */
export const formatDate = (date, formatString = DATE_FORMATS.DISPLAY) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return ''
    return format(dateObj, formatString)
  } catch (error) {
    console.warn('Invalid date format:', date)
    return ''
  }
}

/**
 * Format a date for form inputs (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  return formatDate(date, DATE_FORMATS.INPUT)
}

/**
 * Format a date with time for display
 */
export const formatDateTime = (date) => {
  return formatDate(date, DATE_FORMATS.FULL)
}

/**
 * Format time only
 */
export const formatTime = (date) => {
  return formatDate(date, DATE_FORMATS.TIME)
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const diffInMs = now - dateObj
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return formatDate(dateObj)
}

/**
 * Check if date is today
 */
export const isToday = (date) => {
  if (!date) return false
  
  const today = new Date()
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  return dateObj.toDateString() === today.toDateString()
}

/**
 * Get start and end of current week
 */
export const getCurrentWeek = () => {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6))
  
  return {
    start: startOfWeek,
    end: endOfWeek
  }
}

/**
 * Get start and end of current month
 */
export const getCurrentMonth = () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  return {
    start: startOfMonth,
    end: endOfMonth
  }
}

/**
 * Calculate age from birthdate
 */
export const calculateAge = (birthdate) => {
  if (!birthdate) return null
  
  const today = new Date()
  const birthDate = typeof birthdate === 'string' ? parseISO(birthdate) : birthdate
  
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}
