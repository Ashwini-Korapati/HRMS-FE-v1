import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDepartment, updateDepartment, clearError, clearSuccess } from '@/features/departments/departmentsSlice';
import { selectDepartmentsCreating, selectDepartmentsError, selectDepartmentsSuccess } from '@/features/departments/departmentsSlice';
import { XMarkIcon } from '@heroicons/react/24/outline';

const DepartmentForm = ({ isOpen, onClose, editDepartment = null }) => {
  const dispatch = useDispatch();
  const creating = useSelector(selectDepartmentsCreating);
  const error = useSelector(selectDepartmentsError);
  const success = useSelector(selectDepartmentsSuccess);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headId: ''
  });

  useEffect(() => {
    if (editDepartment) {
      setFormData({
        name: editDepartment.name || '',
        description: editDepartment.description || '',
        headId: editDepartment.headId || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        // headId: ''
      });
    }
  }, [editDepartment, isOpen]);

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
    
    if (editDepartment) {
      dispatch(updateDepartment({ id: editDepartment.id, ...formData }));
    } else {
      dispatch(createDepartment(formData));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editDepartment ? 'Edit Department' : 'Add New Department'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter department name"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter department description"
            />
          </div>

          <div>
            <label htmlFor="headId" className="block text-sm font-medium text-gray-700 mb-1">
              Department Head ID (Optional)
            </label>
            <input
              type="text"
              id="headId"
              name="headId"
              value={formData.headId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter head user ID (optional)"
            />
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
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Saving...' : editDepartment ? 'Update' : 'Create'} Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;