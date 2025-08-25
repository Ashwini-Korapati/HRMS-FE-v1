import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  UserGroupIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const DepartmentsPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockDepartments = [
      {
        id: 1,
        name: 'Engineering',
        description: 'Software development and technical operations',
        manager: 'John Doe',
        employeeCount: 15,
        budget: 500000,
        location: 'Building A, Floor 3',
        status: 'active',
        createdDate: '2023-01-15'
      },
      {
        id: 2,
        name: 'Marketing',
        description: 'Brand promotion and customer acquisition',
        manager: 'Jane Smith',
        employeeCount: 8,
        budget: 250000,
        location: 'Building B, Floor 2',
        status: 'active',
        createdDate: '2023-02-01'
      },
      {
        id: 3,
        name: 'Human Resources',
        description: 'Employee relations and organizational development',
        manager: 'Mike Johnson',
        employeeCount: 5,
        budget: 150000,
        location: 'Building A, Floor 1',
        status: 'active',
        createdDate: '2023-01-10'
      },
      {
        id: 4,
        name: 'Finance',
        description: 'Financial planning and accounting operations',
        manager: 'Sarah Wilson',
        employeeCount: 6,
        budget: 200000,
        location: 'Building B, Floor 1',
        status: 'active',
        createdDate: '2023-01-20'
      },
      {
        id: 5,
        name: 'Sales',
        description: 'Revenue generation and client relationships',
        manager: 'Robert Brown',
        employeeCount: 12,
        budget: 400000,
        location: 'Building A, Floor 2',
        status: 'active',
        createdDate: '2023-02-15'
      }
    ];

    setTimeout(() => {
      setDepartments(mockDepartments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BuildingOfficeIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Departments
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage organizational departments and their structure
                </p>
              </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <PlusIcon className="h-5 w-5" />
              <span>Add Department</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Departments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{departments.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEmployees}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg. Team Size</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(totalEmployees / departments.length)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDepartments.map((department) => (
            <div
              key={department.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {department.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(department.status)}`}>
                      {department.status}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{department.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Manager:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{department.manager}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Employees:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{department.employeeCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Budget:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(department.budget)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Location:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{department.location}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-sm">View Details</span>
                </button>
                <button className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                  <PencilIcon className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No departments found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria or create a new department
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
