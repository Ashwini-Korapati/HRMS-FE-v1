import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  BriefcaseIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CurrencyDollarIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const DesignationsPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockDesignations = [
      {
        id: 1,
        title: 'Software Engineer',
        level: 'Junior',
        department: 'Engineering',
        description: 'Develops and maintains software applications',
        minSalary: 60000,
        maxSalary: 80000,
        employeeCount: 8,
        requirements: ['Bachelor\'s degree in Computer Science', '1-3 years experience', 'JavaScript, React'],
        status: 'active',
        createdDate: '2023-01-15'
      },
      {
        id: 2,
        title: 'Senior Software Engineer',
        level: 'Senior',
        department: 'Engineering',
        description: 'Leads technical projects and mentors junior developers',
        minSalary: 90000,
        maxSalary: 120000,
        employeeCount: 5,
        requirements: ['Bachelor\'s degree in Computer Science', '5+ years experience', 'Leadership skills'],
        status: 'active',
        createdDate: '2023-01-15'
      },
      {
        id: 3,
        title: 'Marketing Manager',
        level: 'Manager',
        department: 'Marketing',
        description: 'Manages marketing campaigns and strategies',
        minSalary: 70000,
        maxSalary: 95000,
        employeeCount: 3,
        requirements: ['Bachelor\'s degree in Marketing', '3-5 years experience', 'Digital marketing'],
        status: 'active',
        createdDate: '2023-02-01'
      },
      {
        id: 4,
        title: 'HR Specialist',
        level: 'Mid-Level',
        department: 'Human Resources',
        description: 'Handles recruitment and employee relations',
        minSalary: 50000,
        maxSalary: 65000,
        employeeCount: 2,
        requirements: ['Bachelor\'s degree in HR', '2-4 years experience', 'SHRM certification'],
        status: 'active',
        createdDate: '2023-01-10'
      },
      {
        id: 5,
        title: 'Financial Analyst',
        level: 'Mid-Level',
        department: 'Finance',
        description: 'Analyzes financial data and prepares reports',
        minSalary: 55000,
        maxSalary: 75000,
        employeeCount: 4,
        requirements: ['Bachelor\'s degree in Finance', '2-4 years experience', 'Excel proficiency'],
        status: 'active',
        createdDate: '2023-01-20'
      },
      {
        id: 6,
        title: 'Sales Representative',
        level: 'Junior',
        department: 'Sales',
        description: 'Generates leads and closes sales deals',
        minSalary: 40000,
        maxSalary: 60000,
        employeeCount: 6,
        requirements: ['High school diploma', '1-2 years experience', 'Communication skills'],
        status: 'active',
        createdDate: '2023-02-15'
      },
      {
        id: 7,
        title: 'Product Manager',
        level: 'Manager',
        department: 'Engineering',
        description: 'Oversees product development and strategy',
        minSalary: 85000,
        maxSalary: 110000,
        employeeCount: 2,
        requirements: ['Bachelor\'s degree', '4-6 years experience', 'Product management'],
        status: 'active',
        createdDate: '2023-03-01'
      }
    ];

    setTimeout(() => {
      setDesignations(mockDesignations);
      setLoading(false);
    }, 1000);
  }, []);

  const levels = ['all', 'Junior', 'Mid-Level', 'Senior', 'Manager'];
  const departments = ['all', 'Engineering', 'Marketing', 'Human Resources', 'Finance', 'Sales'];

  const filteredDesignations = designations.filter(designation => {
    const matchesSearch = designation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designation.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || designation.level === levelFilter;
    const matchesDepartment = departmentFilter === 'all' || designation.department === departmentFilter;
    
    return matchesSearch && matchesLevel && matchesDepartment;
  });

  const totalPositions = designations.reduce((sum, designation) => sum + designation.employeeCount, 0);
  const averageSalary = designations.reduce((sum, designation) => 
    sum + ((designation.minSalary + designation.maxSalary) / 2), 0) / designations.length;

  const getLevelColor = (level) => {
    switch (level) {
      case 'Junior':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Mid-Level':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Senior':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Manager':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
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
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading designations...</p>
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
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BriefcaseIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Designations
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage job positions and their requirements
                </p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <PlusIcon className="h-5 w-5" />
              <span>Add Designation</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BriefcaseIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Designations</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{designations.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <UserIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Positions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPositions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg. Salary</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(averageSalary)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FunnelIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Departments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{departments.length - 1}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search designations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </option>
              ))}
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(department => (
                <option key={department} value={department}>
                  {department === 'all' ? 'All Departments' : department}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Designation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDesignations.map((designation) => (
            <div
              key={designation.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BriefcaseIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {designation.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{designation.department}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(designation.level)}`}>
                  {designation.level}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{designation.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Salary Range:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(designation.minSalary)} - {formatCurrency(designation.maxSalary)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Employees:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{designation.employeeCount}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Key Requirements:</p>
                <div className="flex flex-wrap gap-1">
                  {designation.requirements.slice(0, 2).map((req, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {req}
                    </span>
                  ))}
                  {designation.requirements.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      +{designation.requirements.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                  <EyeIcon className="h-4 w-4" />
                  <span className="text-sm">View</span>
                </button>
                <button className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                  <PencilIcon className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDesignations.length === 0 && (
          <div className="text-center py-12">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No designations found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria or create a new designation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignationsPage;
