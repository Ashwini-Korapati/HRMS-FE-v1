import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle, setBreadcrumbs } from '@/store/features/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const AnnouncementsPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Announcements'))
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Announcements', href: '/announcements' }
    ]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Company announcements and communications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Announcements management features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
