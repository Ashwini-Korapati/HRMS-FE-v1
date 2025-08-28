// @/features/departments/DepartmentsPage.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import { 
  BuildingOfficeIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import DepartmentModal from './DepartmentModal';
import { 
  fetchDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment,
  selectDepartments,
  selectDepartmentsLoading,
  selectDepartmentsError 
} from '../../features/departments/departmentsSlice'

const DepartmentsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const departments = useSelector(selectDepartments);
  const loading = useSelector(selectDepartmentsLoading);
  const error = useSelector(selectDepartmentsError);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyLoading, setCompanyLoading] = useState(true);

  useEffect(() => {
    // Check if company data is available
    if (company) {
      setCompanyLoading(false);
      dispatch(fetchDepartments(company.id));
    } else {
      // Add a timeout to prevent infinite loading
      const timer = setTimeout(() => {
        setCompanyLoading(false);
        console.error('Company data not available after timeout');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, company]);

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      if (company?.id) {
        dispatch(deleteDepartment({ 
          companyId: company.id, 
          departmentId 
        }));
      } else {
        console.error('Cannot delete department: Company ID not available');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
  };

  const handleAddDepartment = () => {
    if (!company?.id) {
      console.error('Cannot add department: Company ID not available');
      return;
    }
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleCreateDepartment = (departmentData) => {
    if (!company?.id) {
      console.error('Cannot create department: Company ID not available');
      return;
    }
    
    dispatch(createDepartment({
      companyId: company.id,
      departmentData: {
        name: departmentData.name,
        description: departmentData.description
      }
    })).then((result) => {
      if (!result.error) {
        handleCloseModal();
      }
    });
  };

  const handleUpdateDepartment = (departmentData) => {
    if (!company?.id || !editingDepartment?.id) {
      console.error('Company ID or Department ID is not available');
      return;
    }
    
    dispatch(updateDepartment({
      companyId: company.id,
      departmentId: editingDepartment.id,
      departmentData: {
        name: departmentData.name,
        description: departmentData.description,
        ...(departmentData.code && { code: departmentData.code }),
        ...(departmentData.manager && { headId: departmentData.manager }),
        ...(departmentData.budget && { budget: parseFloat(departmentData.budget) }),
        ...(departmentData.status && { status: departmentData.status })
      }
    })).then((result) => {
      if (!result.error) {
        handleCloseModal();
      }
    });
  };

  const refreshData = () => {
    if (company?.id) {
      dispatch(fetchDepartments(company.id));
    } else {
      console.error('Cannot refresh: Company ID not available');
    }
  };

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (department.code && department.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate statistics
  const totalEmployees = departments.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0);
  const totalBudget = departments.reduce((sum, dept) => sum + (parseFloat(dept.budget) || 0), 0);
  const activeDepartments = departments.filter(dept => dept.status === 'active').length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Show loading if company data is not available yet
  if (companyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  // Show error if company is still null after loading
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BuildingOfficeIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Data Not Available</h2>
          <p className="text-gray-600 mb-4">Please make sure you're logged in and have access to a company.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
                <p className="text-gray-600">Organize and manage {company.name}'s departments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button 
                onClick={handleAddDepartment}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Department</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{activeDepartments}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error.message || 'An error occurred'}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading departments...</p>
            </div>
          ) : filteredDepartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map((department) => (
                <div key={department.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      department.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {department.status || 'active'}
                    </span>
                  </div>
                  
                  {department.code && (
                    <p className="text-sm text-gray-600 mb-2">Code: {department.code}</p>
                  )}
                  
                  {department.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{department.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      {department.employeeCount || 0} employees
                    </div>
                    
                    {department.head && (
                      <div className="flex items-center text-sm text-gray-600">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Manager: {department.head.name || department.headId || 'Not assigned'}
                      </div>
                    )}
                    
                    {department.budget && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        Budget: {formatCurrency(parseFloat(department.budget))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-3 border-t">
                    <button
                      onClick={() => handleEdit(department)}
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center"
                    >
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
                      className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100 transition-colors flex items-center justify-center"
                    >
                      <TrashIcon className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No departments found' : 'No Departments Yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'Get started by creating your first department to organize your company structure.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddDepartment}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors mx-auto"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create First Department</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editDepartment={editingDepartment}
        onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default DepartmentsPage;