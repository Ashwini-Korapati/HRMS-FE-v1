import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { selectUser, selectIsAuthenticated } from '@/features/auth/authSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { MetricCard } from '@/components/ui/Stats'
import { 
  User, 
  Building, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Phone,
  Mail,
  MapPin,
  Edit3,
  Settings,
  LogOut,
  Bell,
  FileText,
  TrendingUp,
  Users,
  Target
} from 'lucide-react'

export const UserDashboardPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])
  
  useEffect(() => {
    // Verify user matches the route
    if (isAuthenticated && user && user.id !== userId) {
      // Redirect to correct user dashboard
      navigate(`/u/${user.id}/dashboard`, { replace: true })
    }
  }, [user, userId, isAuthenticated, navigate])
  
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <Button onClick={() => navigate('/uas/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }
  
  const company = user.company || JSON.parse(localStorage.getItem('company_info') || '{}')
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Avatar
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                size="lg"
                fallback={`${user.firstName?.[0]}${user.lastName?.[0]}`}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {company.name} • {user.role}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatTime(currentTime)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(currentTime)}
                </p>
              </div>
              
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Quick Stats & Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="Attendance"
                value="98.5%"
                icon={CheckCircle}
                change="+2.3%"
                changeType="positive"
              />
              <MetricCard
                title="Tasks"
                value={12}
                icon={Target}
                change="Active"
                changeType="neutral"
              />
              <MetricCard
                title="Leave Balance"
                value={15}
                icon={Calendar}
                change="Days remaining"
                changeType="neutral"
              />
              <MetricCard
                title="Projects"
                value={3}
                icon={FileText}
                change="In progress"
                changeType="neutral"
              />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Checked in today</p>
                      <p className="text-xs text-gray-500">9:15 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed task: "Review quarterly reports"</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New project assignment: "Mobile App UI"</p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                    <Clock className="w-6 h-6" />
                    <span className="text-sm">Clock In/Out</span>
                  </Button>
                  
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                    <Calendar className="w-6 h-6" />
                    <span className="text-sm">Request Leave</span>
                  </Button>
                  
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                    <FileText className="w-6 h-6" />
                    <span className="text-sm">View Payslip</span>
                  </Button>
                  
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                    <Users className="w-6 h-6" />
                    <span className="text-sm">Team Directory</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile & Company Info */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </span>
                  <Button size="sm" variant="ghost">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Avatar
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    size="xl"
                    fallback={`${user.firstName?.[0]}${user.lastName?.[0]}`}
                  />
                  <h3 className="mt-3 text-lg font-semibold">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.role}
                  </p>
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                  
                  {user.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm">{user.address}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Joined {formatDate(user.createdAt)}
                    </span>
                  </div>
                  
                  {user.lastLogin && (
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        Last login: {formatDate(user.lastLogin)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            {company && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Company</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg">{company.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {company.subdomain}.hroffice.com
                    </p>
                  </div>
                  
                  {company.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{company.email}</span>
                    </div>
                  )}
                  
                  {company.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{company.phone}</span>
                    </div>
                  )}
                  
                  {company.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm">{company.address}</span>
                    </div>
                  )}
                  
                  {company.website && (
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(company.website, '_blank')}
                      >
                        Visit Website
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Emergency Contact */}
            {user.emergencyContact && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium">{user.emergencyContact.name}</p>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{user.emergencyContact.phone}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
