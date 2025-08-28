import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDesignation, updateDesignation, clearError, clearSuccess } from '@/features/designations/designationsSlice';
import { selectDesignationsCreating, selectDesignationsError, selectDesignationsSuccess } from '@/features/designations/designationsSlice';
import { selectDepartments } from '@/features/departments/departmentsSlice';
import { XMarkIcon } from '@heroicons/react/24/outline';

const DesignationForm = ({ isOpen, onClose, editDesignation = null }) => {
  const dispatch = useDispatch();
  const creating = useSelector(selectDesignationsCreating);
  const error = useSelector(selectDesignationsError);
  const success = useSelector(selectDesignationsSuccess);
  const departments = useSelector(selectDepartments);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    level: 1,
    isActive: true
  });

  useEffect(() => {
    if (editDesignation) {
      setFormData({
        title: editDesignation.title || '',
        description: editDesignation.description || '',
        departmentId: editDesignation.departmentId || '',
        level: editDesignation.level || 1,
        isActive: editDesignation.isActive !== undefined ? editDesignation.isActive : true
      });
    } else {
      setFormData({
        title: '',
        description: '',
        departmentId: '',
        level: 1,
        isActive: true,
      });
    }
  }, [editDesignation, isOpen]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        onClose();
      }, 2000);
     
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
   
    // Prepare the payload for the API call, converting values to the correct type
    const payload = {
      title: formData.title,
      description: formData.description,
      departmentId: formData.departmentId,
      level: parseInt(formData.level, 10), // Convert level from string to number
      isActive: formData.isActive,
    };

    // Dispatch the correct action with the payload
    // The access token will be handled in the async thunk
    if (editDesignation) {
      dispatch(updateDesignation({ id: editDesignation.id, designationData: payload }));
    } else {
      dispatch(createDesignation(payload));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editDesignation ? 'Edit Designation' : 'Add New Designation'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {typeof error === 'string' ? error : error.message || 'An error occurred'}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Designation Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter designation title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter designation description"
            />
          </div>

          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Level *
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1">Junior (Level 1)</option>
              <option value="2">Mid-Level (Level 2)</option>
              <option value="3">Senior (Level 3)</option>
              <option value="4">Manager (Level 4)</option>
              <option value="5">Director (Level 5)</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active Designation
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Saving...' : editDesignation ? 'Update' : 'Create'} Designation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DesignationForm;