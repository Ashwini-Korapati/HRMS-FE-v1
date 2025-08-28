import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '@/features/auth/authSlice';
import { 
  fetchDepartments, 
  deleteDepartment,
  selectDepartments, 
  selectDepartmentsLoading,
  selectDepartmentsDeleting,
  selectDepartmentsError,
  clearError,
  clearSuccess
} from '../../features/departments/departmentsSlice'
import { 
  BuildingOfficeIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  UsersIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import DepartmentForm from './DepartmentModal'

const DepartmentsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const departments = useSelector(selectDepartments);
  const loading = useSelector(selectDepartmentsLoading);
  const deleting = useSelector(selectDepartmentsDeleting);
  const error = useSelector(selectDepartmentsError);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.company_id) {
      dispatch(fetchDepartments());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const handleDelete = (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      dispatch(deleteDepartment(departmentId));
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDepartment(null);
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access departments management.</p>
        </div>
      </div>
    );
  }

  if (loading && departments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
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
                <p className="text-gray-600">Organize and manage company departments</p>
              </div>
            </div>
            <button 
              onClick={handleAddDepartment}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Department</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              {typeof error === 'string' ? error : error.message || 'An error occurred'}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {departments.length === 0 ? (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Departments Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first department to organize your team structure.
              </p>
              <button 
                onClick={handleAddDepartment}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors mx-auto"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create First Department</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department) => (
                <div key={department.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(department)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="Edit department"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        disabled={deleting}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors p-1"
                        title="Delete department"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {department.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{department.description}</p>
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      <span>{department.users?.length || 0} members</span>
                    </div>
                    
                    {department.head && (
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span className="truncate">Head: {department.head.firstName} {department.head.lastName}</span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-gray-100">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        department.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {department.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Department Form Modal */}
      <DepartmentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editDepartment={editingDepartment}
      />
    </div>
  );
};

export default DepartmentsPage;