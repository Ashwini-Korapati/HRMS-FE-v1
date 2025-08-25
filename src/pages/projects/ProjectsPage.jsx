import React, { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { setPageTitle, setBreadcrumbs } from '@/features/ui/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const ProjectsPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Projects'))
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Projects', href: '/projects' }
    ]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
  <h1 className="text-2xl font-semibold text-gray-900">
          Project Management
        </h1>
  <p className="mt-1 text-sm text-gray-600">
          Manage projects and track progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Project management features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
