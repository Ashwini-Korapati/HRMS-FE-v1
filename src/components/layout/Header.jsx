import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { selectUser, selectUserRole, logout } from '@/features/auth/authSlice'
import { selectCompany, selectSubdomain } from '@/features/tenant/tenantSlice'
import { 
  selectPageTitle, 
  selectBreadcrumbs,
  selectMobileMenuOpen, 
  toggleMobileMenu,
  setNotificationsPanelOpen,
  selectNotificationsPanel
} from '@/features/ui/uiSlice'
import { 
  Menu, X, Search, Bell, 
  ChevronDown, Settings, LogOut, User
} from 'lucide-react'
import { cn } from '@/utils/cn'
// theme removed; app is light-only
// import { Menu as HeadlessMenu, Transition } from '@headlessui/react'

export const Header = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const userRole = useAppSelector(selectUserRole)
  const company = useAppSelector(selectCompany)
  const subdomain = useAppSelector(selectSubdomain)
  const pageTitle = useAppSelector(selectPageTitle)
  const breadcrumbs = useAppSelector(selectBreadcrumbs)
  const mobileMenuOpen = useAppSelector(selectMobileMenuOpen)
  const notificationsPanel = useAppSelector(selectNotificationsPanel)

  const handleMobileMenuToggle = () => {
    dispatch(toggleMobileMenu())
  }

  // theme toggling removed

  const handleNotificationsToggle = () => {
    dispatch(setNotificationsPanelOpen(!notificationsPanel.open))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  // no theme icon

  return (
  <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Page title and breadcrumbs */}
            <div className="flex flex-col">
              {pageTitle && (
                <h1 className="text-lg font-semibold text-gray-900">
                  {pageTitle}
                </h1>
              )}
              
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 text-sm text-gray-500">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={index} className="flex items-center">
                        {index > 0 && <span className="mr-2">/</span>}
                        {crumb.href ? (
                          <Link 
                            to={crumb.href}
                            className="hover:text-gray-700"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span>{crumb.label}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
            </div>
          </div>

          {/* Center - Company info */}
          {company && (
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <div className="text-gray-500">Company:</div>
              <div className="font-medium text-gray-900">
                {company.name}
              </div>
              {subdomain && (
                <div className="text-xs text-gray-400">
                  ({subdomain}.hroffice.com)
                </div>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button
              onClick={handleNotificationsToggle}
              className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              {notificationsPanel.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error-600 text-white text-xs flex items-center justify-center">
                  {notificationsPanel.unreadCount > 9 ? '9+' : notificationsPanel.unreadCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative">
        <button className="flex items-center space-x-3 p-2 rounded-md text-sm hover:bg-gray-100">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden md:block text-left">
          <div className="text-gray-900 font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
          <div className="text-xs text-gray-500">
                    {userRole}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
