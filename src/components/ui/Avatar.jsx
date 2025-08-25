import React from 'react'
import { cn } from '@/utils/cn'

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
  '3xl': 'w-24 h-24 text-2xl'
}

export const Avatar = ({ 
  src, 
  alt, 
  fallback, 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const [imageError, setImageError] = React.useState(false)
  
  const sizeClasses = avatarSizes[size] || avatarSizes.md
  
  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'rounded-full object-cover border-2 border-gray-200 dark:border-gray-700',
          sizeClasses,
          className
        )}
        onError={() => setImageError(true)}
        {...props}
      />
    )
  }
  
  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200 dark:border-gray-700',
        sizeClasses,
        className
      )}
      {...props}
    >
      {fallback || '?'}
    </div>
  )
}
