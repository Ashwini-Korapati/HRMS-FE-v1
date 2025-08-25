import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input, Label, FormField } from '@/components/ui/Form'
import { publicApi } from '@/api/endpoints'

export const AuthTestPage = () => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Test login flow
  const [email, setEmail] = useState('admin@testco.com')
  const [password, setPassword] = useState('Password123!')
  const [rememberMe, setRememberMe] = useState(false)
  const [challengeData, setChallengeData] = useState(null)

  const testHealthEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await publicApi.health()
      setResult(JSON.stringify(response.data, null, 2))
    } catch (err) {
      setError(err.message || 'Error occurred')
    } finally {
      setLoading(false)
    }
  }

  const testAuthChallenge = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const params = {
        email: email,
        client_id: 'hr-office-frontend',
        response_type: 'code',
        scope: 'openid profile email company',
        state: 'test123',
        redirect_uri: 'http://localhost:3000/uas/login'
      }
      
      const response = await publicApi.authChallenge(params)
      
      // Don't auto-redirect in debug mode, just show the response
      const challengeResult = response.data.data || response.data
      setChallengeData(challengeResult)
      
      // Store company info and email for manual testing
      if (challengeResult.company) {
        localStorage.setItem('uas_company_info', JSON.stringify(challengeResult.company))
      }
      localStorage.setItem('uas_email', email)
      
      setResult(`Challenge Success:\n${JSON.stringify(response.data, null, 2)}\n\nLogin URL: ${challengeResult.loginUrl}`)
    } catch (err) {
      setError(`Error: ${err.message || 'Unknown error'}`)
      if (err.response) {
        setError(`Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data, null, 2)}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    if (!challengeData || !challengeData.loginChallenge) {
      setError('No challenge data available. Please run the challenge test first.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const loginPayload = {
        login_challenge: challengeData.loginChallenge,
        email: email,
        password: password,
        remember_me: rememberMe
      }

      console.log('Login payload being sent:', loginPayload)
      
      const response = await publicApi.login(loginPayload)
      setResult(`Login Success:\n${JSON.stringify(response.data, null, 2)}`)
    } catch (err) {
      setError(`Login Error: ${err.message || 'Unknown error'}`)
      if (err.response) {
        setError(`Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data, null, 2)}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const testUASHealth = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await publicApi.uasHealth()
      setResult(JSON.stringify(response.data, null, 2))
    } catch (err) {
      setError(err.message || 'Error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Authentication API Test</h1>
      
      {/* Test credentials form */}
      <Card>
        <CardHeader>
          <CardTitle>Test Credentials</CardTitle>
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

          <FormField label="Password">
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
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={testHealthEndpoint} disabled={loading}>
          Test Health Endpoint
        </Button>
        <Button onClick={testUASHealth} disabled={loading}>
          Test UAS Health
        </Button>
        <Button onClick={testAuthChallenge} disabled={loading}>
          1. Get Auth Challenge
        </Button>
        <Button 
          onClick={testLogin} 
          disabled={loading || !challengeData}
          variant={challengeData ? "default" : "secondary"}
        >
          2. Test Login
        </Button>
      </div>

      {challengeData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Challenge Data Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><strong>Login Challenge:</strong> {challengeData.loginChallenge}</p>
              <p><strong>Company:</strong> {challengeData.company?.name} ({challengeData.company?.subdomain})</p>
              <p><strong>Expires In:</strong> {challengeData.expiresIn} seconds</p>
              {challengeData.loginUrl && (
                <div className="pt-2">
                  <p><strong>Login URL:</strong></p>
                  <p className="text-xs break-all text-blue-600">{challengeData.loginUrl}</p>
                  <Button 
                    onClick={() => window.location.href = challengeData.loginUrl}
                    size="sm"
                    className="mt-2"
                  >
                    Go to Login URL
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="p-6">
            <p className="text-center">Loading...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-red-50 p-4 rounded">
              {error}
            </pre>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Success</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-green-50 p-4 rounded overflow-x-auto">
              {result}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
