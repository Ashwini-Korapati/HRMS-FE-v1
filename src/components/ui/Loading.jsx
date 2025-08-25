import React from 'react'
import { cn } from '@/utils/cn'

const LoadingSpinner = ({ size = 'default', className }) => {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }
  
  return (
    <svg
      className={cn(
        'animate-spin text-current',
        sizes[size],
        className
      )}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

const LoadingDots = ({ className }) => {
  return (
    <div className={cn('flex space-x-1', className)}>
      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

const LoadingOverlay = ({ children, loading, className }) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  )
}

const LoadingSkeleton = ({ className, rows = 1 }) => {
  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
    </div>
  )
}

const LoadingCard = ({ className }) => {
  return (
    <div className={cn('p-6 space-y-4 animate-pulse', className)}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  )
}

const LoadingTable = ({ rows = 5, columns = 4, className }) => {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {/* Header */}
        {Array.from({ length: columns }).map((_, index) => (
          <div key={`header-${index}`} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
              style={{
                width: `${Math.random() * 30 + 70}%`
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export {
  LoadingSpinner,
  LoadingDots,
  LoadingOverlay,
  LoadingSkeleton,
  LoadingCard,
  LoadingTable
}
