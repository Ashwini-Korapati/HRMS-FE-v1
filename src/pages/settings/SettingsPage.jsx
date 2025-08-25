import React, { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { setPageTitle, setBreadcrumbs } from '@/features/ui/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const SettingsPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Settings'))
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings', href: '/settings' }
    ]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
  <h1 className="text-2xl font-semibold text-gray-900">
          Settings
        </h1>
  <p className="mt-1 text-sm text-gray-600">
          Manage application settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              General application settings coming soon...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Security and privacy settings coming soon...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Notification preferences coming soon...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Third-party integrations coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
