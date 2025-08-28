import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUser, selectIsAuthenticated, selectCompanyId } from '@/features/auth/authSlice_new';
import { selectDepartments } from '@/features/departments/departmentsSlice';

import {
  fetchDesignations,
  deleteDesignation,
  selectDesignations,
  selectDesignationsLoading,
  selectDesignationsDeleting,
  selectDesignationsError,
  clearError,
  clearSuccess
} from '@/features/designations/designationsSlice';

import {
  BriefcaseIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import DesignationForm from './DesignationForm';

const DesignationsPage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const departments = useSelector(selectDepartments);
  const designations = useSelector(selectDesignations);
  const loading = useSelector(selectDesignationsLoading);
  const deleting = useSelector(selectDesignationsDeleting);
  const error = useSelector(selectDesignationsError);

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchDesignations());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleEdit = (designation) => {
    setEditingDesignation(designation);
    setIsFormOpen(true);
  };

  const handleDelete = (designationId) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      dispatch(deleteDesignation(designationId));
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDesignation(null);
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  const handleAddDesignation = () => {
    setEditingDesignation(null);
    setIsFormOpen(true);
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 1: return 'Junior';
      case 2: return 'Mid-Level';
      case 3: return 'Senior';
      case 4: return 'Manager';
      case 5: return 'Director';
      default: return 'Level ' + level;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-purple-100 text-purple-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDesignations = designations.filter(designation => {
    const matchesSearch = designation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (designation.description && designation.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === 'all' || designation.level.toString() === levelFilter;
    const matchesDepartment = departmentFilter === 'all' || designation.departmentId === departmentFilter;
   
    return matchesSearch && matchesLevel && matchesDepartment;
  });

  const totalPositions = designations.length;
  const activeDesignations = designations.filter(d => d.isActive).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access designations management.</p>
        </div>
      </div>
    );
  }

  if (loading && designations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <BriefcaseIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Designations</h1>
                <p className="text-gray-600">Manage job positions and their requirements</p>
              </div>
            </div>
            <button
              onClick={handleAddDesignation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Designation</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Designations</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPositions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Designations</p>
                  <p className="text-2xl font-bold text-gray-900">{activeDesignations}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FunnelIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                </div>
              </div>
            </div>
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

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search designations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="1">Junior</option>
              <option value="2">Mid-Level</option>
              <option value="3">Senior</option>
              <option value="4">Manager</option>
              <option value="5">Director</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>
                  {department.name}
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
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {designation.title}
                    </h3>
                    <p className="text-sm text-gray-600">{getDepartmentName(designation.departmentId)}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(designation)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                    title="Edit designation"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(designation.id)}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors p-1"
                    title="Delete designation"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(designation.level)}`}>
                  {getLevelLabel(designation.level)}
                </span>
                {!designation.isActive && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4">{designation.description}</p>

              <div className="pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Created: {new Date(designation.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredDesignations.length === 0 && (
          <div className="text-center py-12">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No designations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or create a new designation
            </p>
          </div>
        )}
      </div>

      {/* Designation Form Modal */}
      <DesignationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editDesignation={editingDesignation}
      />
    </div>
  );
};

export default DesignationsPage;