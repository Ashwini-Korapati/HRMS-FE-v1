import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-6xl font-bold text-primary-600">
            404
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go Back
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
