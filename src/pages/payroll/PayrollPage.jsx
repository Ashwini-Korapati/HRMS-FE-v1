import React, { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { setPageTitle, setBreadcrumbs } from '@/features/ui/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const PayrollPage = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPageTitle('Payroll'))
    dispatch(setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Payroll', href: '/payroll' }
    ]))
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
  <h1 className="text-2xl font-semibold text-gray-900">
          Payroll Management
        </h1>
  <p className="mt-1 text-sm text-gray-600">
          Manage employee salaries and payroll processing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Payroll management features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
