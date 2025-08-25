import React from 'react'
import { TrendingUp, TrendingDown, Minus, Users, Calendar, Clock, DollarSign } from 'lucide-react'

export const MetricCard = ({
  title,
  value,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon: Icon,
  formatValue,
  className = ''
}) => {
  const formatDisplayValue = (val) => {
    if (formatValue) return formatValue(val)
    if (typeof val === 'number') return val.toLocaleString()
    return val
  }

  const getTrendIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white p-6 rounded-lg shadow border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatDisplayValue(value)}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {getTrendIcon()}
              <span className={`text-sm font-medium ml-1 ${getTrendColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary-50 rounded-lg">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  )
}

export const StatsGrid = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {children}
    </div>
  )
}

export const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: 248,
      change: '+12%',
      changeType: 'positive',
      icon: Users
    },
    {
      title: 'Active Projects',
      value: 15,
      change: '+3',
      changeType: 'positive',
      icon: Calendar
    },
    {
      title: 'Pending Leaves',
      value: 8,
      change: '-2',
      changeType: 'positive',
      icon: Clock
    },
    {
      title: 'Monthly Payroll',
      value: 485000,
      change: '+5.2%',
      changeType: 'positive',
      icon: DollarSign,
      formatValue: (val) => `$${(val / 1000)}K`
    }
  ]

  return (
    <StatsGrid>
      {stats.map((stat, index) => (
        <MetricCard key={index} {...stat} />
      ))}
    </StatsGrid>
  )
}

export const ProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  showValue = true,
  size = 'md',
  color = 'primary',
  className = '' 
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-sm">
          {label && (
            <span className="text-gray-700">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-gray-600">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export const CircularProgress = ({ 
  value, 
  max = 100, 
  size = 80, 
  strokeWidth = 8,
  color = 'primary',
  showValue = true,
  label,
  className = '' 
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    primary: 'stroke-primary-600',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    danger: 'stroke-red-500',
    info: 'stroke-blue-500'
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className={colorClasses[color]}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.5s ease'
            }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-900">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm text-gray-600 text-center">
          {label}
        </span>
      )}
    </div>
  )
}

export const StatusBadge = ({ 
  status, 
  variant = 'default',
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-primary-100 text-primary-800'
  }

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${sizeClasses[size]} 
      ${variantClasses[variant]} 
      ${className}
    `}>
      {status}
    </span>
  )
}
