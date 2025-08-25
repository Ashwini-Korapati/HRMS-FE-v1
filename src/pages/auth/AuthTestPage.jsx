import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { uasChallenge, loginWithChallenge, selectAuthLoading, selectAuthError, selectChallenge } from '@/features/auth/authSlice'
import { Button } from '@/components/ui/Button'
import { Input, Label, FormField } from '@/components/ui/Form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export const AuthTestPage = () => {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('john.doe@testco.com')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [response, setResponse] = useState(null)
  
  const isLoading = useAppSelector(selectAuthLoading)
  const authError = useAppSelector(selectAuthError)
  const challenge = useAppSelector(selectChallenge)

  const testUasChallenge = async () => {
    try {
      const result = await dispatch(uasChallenge({
        email,
        clientId: 'hr-office-frontend',
        redirectUri: 'http://localhost:3000/uas/login',
        scope: 'openid profile email company',
        state: 'test123',
        responseType: 'code'
      })).unwrap()
      
      setResponse({ success: true, data: result })
    } catch (error) {
      setResponse({ success: false, error: error.message || error })
    }
  }

  const testLogin = async () => {
    if (!challenge || !password) {
      setResponse({ success: false, error: 'Challenge or password missing' })
      return
    }

    try {
      const result = await dispatch(loginWithChallenge({
        loginChallenge: challenge.loginChallenge,
        email,
        password,
        rememberMe
      })).unwrap()
      
      setResponse({ success: true, data: result, type: 'login' })
    } catch (error) {
      setResponse({ success: false, error: error.message || error, type: 'login' })
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">UAS Authentication Test</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Complete Authentication Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to test"
              />
            </FormField>

            <FormField label="Password (for login test)">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </FormField>

            <div className="flex items-center">
              <input
                id="remember-me-test"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me-test" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={testUasChallenge}
                disabled={isLoading || !email}
                loading={isLoading}
              >
                1. Get Challenge
              </Button>

              <Button 
                onClick={testLogin}
                disabled={isLoading || !challenge || !password}
                loading={isLoading}
                variant="secondary"
              >
                2. Login with Challenge
              </Button>
            </div>
            
            {authError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-medium text-red-800">Error:</h3>
                <p className="text-red-700">{authError.message || JSON.stringify(authError)}</p>
              </div>
            )}
            
            {challenge && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-medium text-green-800">Challenge Response:</h3>
                <div className="text-sm text-green-700 mt-2">
                  <p><strong>Login Challenge:</strong> {challenge.loginChallenge}</p>
                  <p><strong>Company:</strong> {challenge.company?.name} ({challenge.company?.subdomain})</p>
                  <p><strong>Expires In:</strong> {challenge.expiresIn} seconds</p>
                </div>
              </div>
            )}
            
            {response && (
              <div className={`p-4 border rounded ${response.success ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                <h3 className={`font-medium ${response.success ? 'text-blue-800' : 'text-red-800'}`}>
                  {response.type === 'login' ? 'Login' : 'Challenge'} Response:
                </h3>
                <pre className={`text-sm mt-2 overflow-auto ${response.success ? 'text-blue-700' : 'text-red-700'}`}>
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>UAS Base URL:</strong> {import.meta.env.VITE_UAS_BASE_URL || 'Not set'}</p>
              <p><strong>Client ID:</strong> {import.meta.env.VITE_UAS_CLIENT_ID || 'Not set'}</p>
              <p><strong>Scope:</strong> {import.meta.env.VITE_UAS_SCOPE || 'Not set'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
