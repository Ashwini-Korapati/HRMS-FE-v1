import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  CalendarDaysIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const LeavesPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockLeaves = [
      {
        id: 1,
        employeeName: 'John Doe',
        employeeId: 'EMP001',
        leaveType: 'Annual Leave',
        startDate: '2024-02-15',
        endDate: '2024-02-19',
        days: 5,
        reason: 'Family vacation',
        status: 'approved',
        appliedDate: '2024-02-01',
        approvedBy: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      },
      {
        id: 2,
        employeeName: 'Alice Johnson',
        employeeId: 'EMP002',
        leaveType: 'Sick Leave',
        startDate: '2024-02-12',
        endDate: '2024-02-14',
        days: 3,
        reason: 'Medical treatment',
        status: 'pending',
        appliedDate: '2024-02-10',
        approvedBy: null,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
      },
      {
        id: 3,
        employeeName: 'Bob Wilson',
        employeeId: 'EMP003',
        leaveType: 'Personal Leave',
        startDate: '2024-02-20',
        endDate: '2024-02-22',
        days: 3,
        reason: 'Personal matters',
        status: 'rejected',
        appliedDate: '2024-02-05',
        approvedBy: 'Mike Johnson',
        rejectionReason: 'Project deadline conflict',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      {
        id: 4,
        employeeName: 'Sarah Davis',
        employeeId: 'EMP004',
        leaveType: 'Maternity Leave',
        startDate: '2024-03-01',
        endDate: '2024-05-30',
        days: 90,
        reason: 'Maternity leave',
        status: 'approved',
        appliedDate: '2024-01-15',
        approvedBy: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
      },
      {
        id: 5,
        employeeName: 'Mike Brown',
        employeeId: 'EMP005',
        leaveType: 'Annual Leave',
        startDate: '2024-02-26',
        endDate: '2024-02-28',
        days: 3,
        reason: 'Long weekend trip',
        status: 'pending',
        appliedDate: '2024-02-08',
        approvedBy: null,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      {
        id: 6,
        employeeName: 'Emma Wilson',
        employeeId: 'EMP006',
        leaveType: 'Emergency Leave',
        startDate: '2024-02-13',
        endDate: '2024-02-13',
        days: 1,
        reason: 'Family emergency',
        status: 'approved',
        appliedDate: '2024-02-12',
        approvedBy: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150'
      }
    ];

    setTimeout(() => {
      setLeaves(mockLeaves);
      setLoading(false);
    }, 1000);
  }, []);

  const leaveTypes = ['all', 'Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Emergency Leave'];
  const statuses = ['all', 'pending', 'approved', 'rejected'];

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.leaveType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          icon: CheckCircleIcon,
          iconColor: 'text-green-600 dark:text-green-400'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          icon: XCircleIcon,
          iconColor: 'text-red-600 dark:text-red-400'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-yellow-600 dark:text-yellow-400'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          icon: ClockIcon,
          iconColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'Annual Leave':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Sick Leave':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Personal Leave':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Maternity Leave':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
      case 'Emergency Leave':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalDays = leaves.reduce((sum, leave) => sum + leave.days, 0);
  const pendingLeaves = leaves.filter(leave => leave.status === 'pending').length;
  const approvedLeaves = leaves.filter(leave => leave.status === 'approved').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading leave requests...</p>
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
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CalendarDaysIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Leave Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage employee leave requests and approvals
                </p>
              </div>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <PlusIcon className="h-5 w-5" />
              <span>Apply Leave</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{leaves.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingLeaves}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Approved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedLeaves}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FunnelIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Days</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDays}</p>
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
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {leaveTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leave Cards */}
        <div className="space-y-4">
          {filteredLeaves.map((leave) => {
            const statusInfo = getStatusInfo(leave.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={leave.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={leave.avatar}
                      alt={leave.employeeName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {leave.employeeName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{leave.employeeId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`h-5 w-5 ${statusInfo.iconColor}`} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Leave Type</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                      {leave.leaveType}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Duration</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{leave.days} day(s)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Applied Date</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{formatDate(leave.appliedDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {leave.status === 'rejected' ? 'Rejected By' : 'Approved By'}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {leave.approvedBy || 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Reason</p>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">{leave.reason}</p>
                  {leave.rejectionReason && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Rejection Reason</p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">{leave.rejectionReason}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                  {leave.status === 'pending' && (
                    <>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span className="text-sm">Approve</span>
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                        <XCircleIcon className="h-4 w-4" />
                        <span className="text-sm">Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredLeaves.length === 0 && (
          <div className="text-center py-12">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No leave requests found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavesPage;
