import React, { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { setPageTitle, setBreadcrumbs } from '@/features/ui/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const DepartmentsPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Departments'))
    dispatch(setBreadcrumbs([
      { label: 'Departments', href: null }
    ]))
  }, [dispatch])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            Department management features will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
