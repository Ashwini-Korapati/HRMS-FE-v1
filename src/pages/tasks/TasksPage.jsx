import React, { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { setPageTitle, setBreadcrumbs } from '@/features/ui/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const TasksPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Tasks'))
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Tasks', href: '/tasks' }
    ]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Task Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and track tasks across projects
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Task management features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
