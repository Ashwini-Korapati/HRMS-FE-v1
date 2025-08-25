import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline';

const EmployeesPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
                <p className="text-gray-600">Manage employee information and records</p>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <PlusIcon className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Employee Management Coming Soon
            </h3>
            <p className="text-gray-600">
              This page will contain comprehensive employee management features including:
            </p>
            <ul className="mt-4 text-sm text-gray-500 space-y-1">
              <li>• Employee directory and profiles</li>
              <li>• Onboarding and offboarding workflows</li>
              <li>• Performance tracking</li>
              <li>• Document management</li>
              <li>• Role and permission management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
