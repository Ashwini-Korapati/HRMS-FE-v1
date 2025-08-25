/**
 * Format currency values
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined) return ''
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format numbers with thousand separators
 */
export const formatNumber = (number, locale = 'en-US') => {
  if (number === null || number === undefined) return ''
  
  return new Intl.NumberFormat(locale).format(number)
}

/**
 * Format percentage values
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return ''
  
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format file sizes
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str) => {
  if (!str) return ''
  
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Convert camelCase to title case
 */
export const camelToTitle = (str) => {
  if (!str) return ''
  
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return ''
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

/**
 * Format phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return ''
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // Check if it's a US phone number
  if (cleaned.length === 10) {
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
  }
  
  // Return original if can't format
  return phoneNumber
}

/**
 * Format email for display (mask middle part)
 */
export const maskEmail = (email) => {
  if (!email) return ''
  
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) return email
  
  const maskedLocal = localPart.charAt(0) + 
    '*'.repeat(localPart.length - 2) + 
    localPart.charAt(localPart.length - 1)
  
  return `${maskedLocal}@${domain}`
}

/**
 * Generate random color for avatars
 */
export const generateAvatarColor = (name) => {
  if (!name) return '#64748b'
  
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', 
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Format time duration (e.g., "2h 30m")
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return '0m'
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) return `${remainingMinutes}m`
  if (remainingMinutes === 0) return `${hours}h`
  
  return `${hours}h ${remainingMinutes}m`
}

/**
 * Parse duration string to minutes
 */
export const parseDuration = (durationStr) => {
  if (!durationStr) return 0
  
  const hoursMatch = durationStr.match(/(\d+)h/)
  const minutesMatch = durationStr.match(/(\d+)m/)
  
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0
  
  return hours * 60 + minutes
}
