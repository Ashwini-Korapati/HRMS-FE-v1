import React, { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { setPageTitle, setBreadcrumbs } from '@/features/ui/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const NotificationsPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Notifications'))
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Notifications', href: '/notifications' }
    ]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your notifications and alerts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Notification management features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
