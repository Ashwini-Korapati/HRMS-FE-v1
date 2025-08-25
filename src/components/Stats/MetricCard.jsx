import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon 
} from '@heroicons/react/24/outline';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  change, 
  color = 'blue',
  description
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-all duration-200 bg-white border-gray-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 transition-colors duration-200 text-gray-600`}>
            {title}
          </p>
          <p className={`text-2xl font-bold transition-colors duration-200 text-gray-900`}>
            {value}
          </p>
          {description && (
            <p className={`text-xs mt-1 transition-colors duration-200 text-gray-500`}>
              {description}
            </p>
          )}
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-lg transition-colors duration-200 ${colorClasses[color] || colorClasses.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      
      {change && trend && (
        <div className="flex items-center mt-4">
          {trend === 'up' && <ArrowUpIcon className={`h-4 w-4 mr-1 ${trendColors.up}`} />}
          {trend === 'down' && <ArrowDownIcon className={`h-4 w-4 mr-1 ${trendColors.down}`} />}
          <span className={`text-sm font-medium ${trendColors[trend] || trendColors.neutral}`}>
            {change}
          </span>
          <span className={`text-sm ml-1 transition-colors duration-200 text-gray-500`}>
            vs last period
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
