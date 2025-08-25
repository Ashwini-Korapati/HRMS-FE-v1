import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectUser } from '@/features/auth/authSlice'
import { setPageTitle, setBreadcrumbs } from '@/features/ui/uiSlice'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Label, FormField } from '@/components/ui/Form'
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react'

export const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  useEffect(() => {
    dispatch(setPageTitle('My Profile'))
    dispatch(setBreadcrumbs([
      { label: 'Profile', href: null }
    ]))
  }, [dispatch])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Profile header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border border-gray-200">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-500">
                  {user?.designation || 'Employee'} • {user?.department || 'General'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Employee ID: {user?.employeeId || 'EMP001'}
                </p>
              </div>
              
              <Button variant="outline">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="First Name">
                <Input value={user?.firstName || ''} readOnly />
              </FormField>
              
              <FormField label="Last Name">
                <Input value={user?.lastName || ''} readOnly />
              </FormField>
              
              <FormField label="Date of Birth">
                <Input type="date" value={user?.dateOfBirth || ''} readOnly />
              </FormField>
              
              <FormField label="Gender">
                <Input value={user?.gender || ''} readOnly />
              </FormField>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Email Address">
                <Input type="email" value={user?.email || ''} readOnly />
              </FormField>
              
              <FormField label="Phone Number">
                <Input type="tel" value={user?.phone || ''} readOnly />
              </FormField>
              
              <FormField label="Emergency Contact">
                <Input value={user?.emergencyContact || ''} readOnly />
              </FormField>
              
              <FormField label="Emergency Phone">
                <Input value={user?.emergencyPhone || ''} readOnly />
              </FormField>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Street Address">
                <Input value={user?.address?.street || ''} readOnly />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="City">
                  <Input value={user?.address?.city || ''} readOnly />
                </FormField>
                
                <FormField label="State">
                  <Input value={user?.address?.state || ''} readOnly />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="ZIP Code">
                  <Input value={user?.address?.zipCode || ''} readOnly />
                </FormField>
                
                <FormField label="Country">
                  <Input value={user?.address?.country || ''} readOnly />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Employee ID">
                <Input value={user?.employeeId || ''} readOnly />
              </FormField>
              
              <FormField label="Department">
                <Input value={user?.department || ''} readOnly />
              </FormField>
              
              <FormField label="Designation">
                <Input value={user?.designation || ''} readOnly />
              </FormField>
              
              <FormField label="Date of Joining">
                <Input type="date" value={user?.dateOfJoining || ''} readOnly />
              </FormField>
              
              <FormField label="Employment Type">
                <Input value={user?.employmentType || ''} readOnly />
              </FormField>
              
              <FormField label="Reporting Manager">
                <Input value={user?.manager || ''} readOnly />
              </FormField>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Password</h4>
          <p className="text-sm text-gray-500">
                    Update your password to keep your account secure
                  </p>
                </div>
                <Button variant="outline">
                  Change Password
                </Button>
              </div>
              
        <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
