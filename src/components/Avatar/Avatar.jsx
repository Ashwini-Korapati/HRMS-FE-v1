import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '', 
  fallback,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        {...props}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
      {...props}
    >
      {fallback ? (
        <span className={`${textSizeClasses[size]} font-medium text-gray-600 dark:text-gray-300`}>
          {fallback}
        </span>
      ) : (
        <UserIcon className={`${sizeClasses[size]} text-gray-400 dark:text-gray-500`} />
      )}
    </div>
  );
};

export default Avatar;
