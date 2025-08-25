import React from 'react'
import { useAppSelector } from '@/app/hooks'
import { selectSidebarOpen, selectMobileMenuOpen } from '@/features/ui/uiSlice'
import { selectUserRole, selectIsAuthenticated } from '@/features/auth/authSlice'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import CompanyStatusBanner from '@/components/ui/CompanyStatusBanner'
import { cn } from '@/utils/cn'

export const AppLayout = ({ children }) => {
  const sidebarOpen = useAppSelector(selectSidebarOpen)
  const mobileMenuOpen = useAppSelector(selectMobileMenuOpen)
  const userRole = useAppSelector(selectUserRole)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden lg:flex lg:flex-shrink-0 transition-all duration-300',
        sidebarOpen ? 'lg:w-64' : 'lg:w-16'
      )}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileMenuOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Company Status Banner - only show for authenticated users */}
              {isAuthenticated && <CompanyStatusBanner />}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
