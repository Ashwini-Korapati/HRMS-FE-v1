// @/features/departments/DepartmentModal.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  XMarkIcon, 
  BuildingOfficeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const DepartmentModal = ({ isOpen, onClose, editDepartment = null, onSubmit, loading, error }) => {
  const company = useSelector((state) => state.auth.company);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // Optional fields (not sent in POST request)
    code: '',
    manager: '',
    budget: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editDepartment) {
      setFormData({
        name: editDepartment.name || '',
        description: editDepartment.description || '',
        // Optional fields (for display only)
        code: editDepartment.code || '',
        manager: editDepartment.headId || '',
        budget: editDepartment.budget || '',
        status: editDepartment.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        // Optional fields
        code: '',
        manager: '',
        budget: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [editDepartment, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Only send required fields to the API
    const apiData = {
      name: formData.name,
      description: formData.description
    };

    // For updates, include the optional fields if they exist
    if (editDepartment) {
      if (formData.headId) apiData.headId = formData.headId;
      if (formData.budget) apiData.budget = parseFloat(formData.budget);
      if (formData.status) apiData.status = formData.status;
      if (formData.code) apiData.code = formData.code;
    }

    onSubmit(apiData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-semibold">
                  {editDepartment ? 'Edit Department' : 'Create New Department'}
                </h2>
                <p className="text-emerald-100 text-sm">
                  {editDepartment ? 'Update department details' : 'Add a new department to your organization'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-emerald-100 transition-colors p-1 rounded-full hover:bg-white/10"
              disabled={loading}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error.message || 'An error occurred'}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Department Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center">
              <BuildingOfficeIcon className="h-4 w-4 mr-2 text-green-500" />
              Department Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g., Engineering, Marketing"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-500" />
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Describe the department's purpose and responsibilities..."
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Optional Fields (Only shown when editing) */}
          {editDepartment && (
            <>
              {/* Department Code */}
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Department Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., ENG-001, MKT-002"
                  disabled={loading}
                />
              </div>

              {/* Manager */}
              <div className="space-y-2">
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                  Manager ID
                </label>
                <input
                  type="text"
                  id="manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter manager's user ID"
                  disabled={loading}
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget ($)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{editDepartment ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <span>{editDepartment ? 'Update Department' : 'Create Department'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;