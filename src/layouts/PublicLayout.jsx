import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

export const PublicLayout = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100', className)}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">HR</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Office Management
                </span>
              </Link>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Link 
                to="/plans" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Plans
              </Link>
              <Link 
                to="/subscribe" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
  <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">HR</span>
              </div>
      <span className="text-sm text-gray-600">
                © 2024 HR Office Management. All rights reserved.
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
      <Link to="/health" className="text-sm text-gray-600 hover:text-gray-900">
                Status
              </Link>
      <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </a>
      <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
