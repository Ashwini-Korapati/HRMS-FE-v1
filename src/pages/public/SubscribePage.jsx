import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const SubscribePage = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Get Started with HR Office
        </h1>
    <p className="text-gray-600">
          Create your company account and start managing your team
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Company registration form will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
