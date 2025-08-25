import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const HealthPage = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          System Status
        </h1>
        <p className="text-gray-600">
          Current status of HR Office services
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>API Service</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Operational
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Operational
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Authentication</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Operational
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
