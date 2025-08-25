import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectUser, selectUserRole } from '@/features/auth/authSlice'
import { selectCompany, selectCompanyId } from '@/features/tenant/tenantSlice'
import { setPageTitle, setBreadcrumbs } from '@/features/ui/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { 
  Users, Calendar, Clock, DollarSign, TrendingUp, 
  AlertCircle, CheckCircle, XCircle, Activity 
} from 'lucide-react'

export const DashboardPage = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const userRole = useAppSelector(selectUserRole)
  const company = useAppSelector(selectCompany)
  const companyId = useAppSelector(selectCompanyId)

  useEffect(() => {
    if (userRole === 'ADMIN') {
      dispatch(setPageTitle('Company Dashboard'))
      dispatch(setBreadcrumbs([
        { label: 'Dashboard', href: null }
      ]))
    } else {
      dispatch(setPageTitle('My Dashboard'))
      dispatch(setBreadcrumbs([
        { label: 'My Dashboard', href: null }
      ]))
    }
  }, [dispatch, userRole])

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h2>
        <p className="text-primary-100">
          Here's what's happening at {company?.name || 'your company'} today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Employees
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  24
                </p>
              </div>
              <Users className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Leaves
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  3
                </p>
              </div>
              <Calendar className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Present Today
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  22
                </p>
              </div>
              <Clock className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Monthly Payroll
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  $45K
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-info-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activities and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">John Doe submitted leave request</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-primary-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Payroll processed for March</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-warning-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">3 employees pending approval</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn btn-outline text-left p-4 h-auto flex flex-col items-start space-y-1">
                <Users className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-medium">Add Employee</span>
              </button>
              
              <button className="btn btn-outline text-left p-4 h-auto flex flex-col items-start space-y-1">
                <Calendar className="h-5 w-5 text-success-600" />
                <span className="text-sm font-medium">Review Leaves</span>
              </button>
              
              <button className="btn btn-outline text-left p-4 h-auto flex flex-col items-start space-y-1">
                <DollarSign className="h-5 w-5 text-info-600" />
                <span className="text-sm font-medium">Run Payroll</span>
              </button>
              
              <button className="btn btn-outline text-left p-4 h-auto flex flex-col items-start space-y-1">
                <TrendingUp className="h-5 w-5 text-warning-600" />
                <span className="text-sm font-medium">View Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderUserDashboard = () => (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Good morning, {user?.firstName}!
        </h2>
        <p className="text-primary-100">
          Here's your overview for today.
        </p>
      </div>

      {/* Personal stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Attendance This Month
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  22/24
                </p>
              </div>
              <Clock className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Leave Balance
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  18
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Tasks
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  5
                </p>
              </div>
              <Activity className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's info and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Clock In</span>
                <span className="text-sm text-success-600 font-medium">9:15 AM</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                  Present
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hours Worked</span>
                <span className="text-sm font-medium">7h 45m</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="btn btn-primary w-full">
                Apply for Leave
              </button>
              <button className="btn btn-outline w-full">
                View Payslips
              </button>
              <button className="btn btn-outline w-full">
                Update Profile
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {userRole === 'ADMIN' ? renderAdminDashboard() : renderUserDashboard()}
    </div>
  )
}
