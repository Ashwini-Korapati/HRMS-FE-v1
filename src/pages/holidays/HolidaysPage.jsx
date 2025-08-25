import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle, setBreadcrumbs } from '@/store/features/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const HolidaysPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Holidays'))
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Holidays', href: '/holidays' }
    ]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Holiday Management
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage company holidays and calendar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holidays Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Holiday management features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
