import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle, setBreadcrumbs } from '@/store/features/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const AttendancePage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Attendance'))
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Attendance', href: '/attendance' }
    ]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Attendance Management
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Track and manage employee attendance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Attendance management features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
