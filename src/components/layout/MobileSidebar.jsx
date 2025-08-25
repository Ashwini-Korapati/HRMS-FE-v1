import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { selectUser, selectUserRole, selectCompany } from '@/features/auth/authSlice'
import { selectCompanyId } from '@/features/tenant/tenantSlice'
import { setMobileMenuOpen } from '@/features/ui/uiSlice'
import { NAVIGATION, ROLES } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

export const MobileSidebar = ({ open }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const userRole = useAppSelector(selectUserRole)
  const company = useAppSelector(selectCompany)
  const companyId = useAppSelector(selectCompanyId)
  const location = useLocation()

  const handleClose = () => {
    dispatch(setMobileMenuOpen(false))
  }

  const goToDashboard = () => {
    const stateKey = company?.subdomain || company?.name?.toLowerCase()
    const urlKeyRaw = location?.pathname?.split('/')?.filter(Boolean)?.[0]
    const reserved = new Set(['dashboard', 'u', 'c', 'uas', 'public', 'auth'])
    const urlKey = reserved.has(urlKeyRaw) ? '' : urlKeyRaw
    const key = stateKey || urlKey
    if (!key) return
    navigate(`/${key}/dashboard`)
    handleClose()
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

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Slide-over panel inspired by Aceternity Sidebar */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={cn(
                'fixed inset-0 z-50 lg:hidden bg-white dark:bg-neutral-900 p-6 flex flex-col'
              )}
            >
              {/* Close button */}
              <div className="absolute right-6 top-6 z-50 text-neutral-800 dark:text-neutral-200">
                <button onClick={handleClose} aria-label="Close menu">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Header / Brand */}
              <div className="flex items-center space-x-3 mb-6 cursor-pointer" onClick={goToDashboard} role="button" aria-label="Go to Dashboard">
                <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base">HR</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  HR Office
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto space-y-1">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleClose}
                    className={({ isActive }) => cn(
                      'sidebar-nav-item',
                      isActive && 'active'
                    )}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* User info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
              </div>
            </motion.div>

            {/* Backdrop for click-to-close (fade) */}
            <motion.div
              className="fixed inset-0 z-40 lg:hidden bg-gray-900/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}
