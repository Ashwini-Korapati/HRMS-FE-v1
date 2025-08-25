import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { selectSidebarOpen, selectSidebarCollapsed, toggleSidebarCollapsed } from '@/features/ui/uiSlice'
import { selectUser, selectUserRole } from '@/features/auth/authSlice'
import { selectCompanyId } from '@/features/tenant/tenantSlice'
import { NAVIGATION, ROLES } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { 
  LayoutDashboard, Users, Building2, Briefcase, Calendar, Clock, 
  DollarSign, FolderOpen, CheckSquare, CalendarDays, Megaphone,
  FileText, BarChart3, User, Settings, Server, Building, CreditCard,
  ChevronLeft, ChevronRight
} from 'lucide-react'

// Icon mapping
const iconMap = {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  FolderOpen,
  CheckSquare,
  CalendarDays,
  Megaphone,
  FileText,
  BarChart3,
  User,
  Settings,
  Server,
  Building,
  CreditCard
}

export const Sidebar = () => {
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector(selectSidebarOpen)
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed)
  const user = useAppSelector(selectUser)
  const userRole = useAppSelector(selectUserRole)
  const companyId = useAppSelector(selectCompanyId)
  const location = useLocation()

  const handleToggleCollapsed = () => {
    dispatch(toggleSidebarCollapsed())
  }

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!userRole) return []
    
    const baseItems = NAVIGATION[userRole] || []
    
    // For company-scoped routes, add company prefix
    if (companyId && (userRole === ROLES.ADMIN || userRole === ROLES.USER)) {
      return baseItems.map(item => ({
        ...item,
        path: `/c/${companyId}${item.path}`
      }))
    }
    
    return baseItems
  }

  const navigationItems = getNavigationItems()

  const isCollapsed = !sidebarOpen || sidebarCollapsed

  return (
    <div className={cn(
      'flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo and toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HR</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              HR Offic
            </span>
          </div>
        )}
        
        {sidebarOpen && (
          <button
            onClick={handleToggleCollapsed}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path))

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'sidebar-nav-item',
                isActive && 'active',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {userRole}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
