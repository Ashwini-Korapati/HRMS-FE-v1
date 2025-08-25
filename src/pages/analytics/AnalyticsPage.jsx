import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle, setBreadcrumbs } from '@/store/features/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const AnalyticsPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Analytics'))
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Analytics', href: '/analytics' }
    ]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Analytics & Reports
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          HR metrics, insights, and reporting
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Analytics and reporting features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
