import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  CurrencyDollarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const PayrollPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));
  const [statusFilter, setStatusFilter] = useState('all');
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockPayrolls = [
      {
        id: 1,
        employeeName: 'John Doe',
        employeeId: 'EMP001',
        month: '2024-02',
        basicSalary: 5000,
        allowances: 1200,
        overtime: 300,
        deductions: 450,
        netSalary: 6050,
        status: 'paid',
        payDate: '2024-02-28',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        department: 'Engineering',
        workingDays: 22,
        attendedDays: 22
      },
      {
        id: 2,
        employeeName: 'Alice Johnson',
        employeeId: 'EMP002',
        month: '2024-02',
        basicSalary: 4500,
        allowances: 800,
        overtime: 150,
        deductions: 380,
        netSalary: 5070,
        status: 'pending',
        payDate: null,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        department: 'Marketing',
        workingDays: 22,
        attendedDays: 21
      },
      {
        id: 3,
        employeeName: 'Bob Wilson',
        employeeId: 'EMP003',
        month: '2024-02',
        basicSalary: 6000,
        allowances: 1500,
        overtime: 200,
        deductions: 520,
        netSalary: 7180,
        status: 'processing',
        payDate: null,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        department: 'Sales',
        workingDays: 22,
        attendedDays: 20
      },
      {
        id: 4,
        employeeName: 'Sarah Davis',
        employeeId: 'EMP004',
        month: '2024-02',
        basicSalary: 4000,
        allowances: 600,
        overtime: 100,
        deductions: 320,
        netSalary: 4380,
        status: 'paid',
        payDate: '2024-02-28',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        department: 'HR',
        workingDays: 22,
        attendedDays: 22
      },
      {
        id: 5,
        employeeName: 'Mike Brown',
        employeeId: 'EMP005',
        month: '2024-02',
        basicSalary: 5500,
        allowances: 1000,
        overtime: 250,
        deductions: 480,
        netSalary: 6270,
        status: 'paid',
        payDate: '2024-02-28',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        department: 'Finance',
        workingDays: 22,
        attendedDays: 21
      },
      {
        id: 6,
        employeeName: 'Emma Wilson',
        employeeId: 'EMP006',
        month: '2024-02',
        basicSalary: 5200,
        allowances: 900,
        overtime: 180,
        deductions: 420,
        netSalary: 5860,
        status: 'pending',
        payDate: null,
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
        department: 'Engineering',
        workingDays: 22,
        attendedDays: 22
      }
    ];

    setTimeout(() => {
      setPayrolls(mockPayrolls);
      setLoading(false);
    }, 1000);
  }, []);

  const statuses = ['all', 'paid', 'pending', 'processing'];

  const filteredPayrolls = payrolls.filter(payroll => {
    const matchesSearch = payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payroll.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payroll.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payroll.status === statusFilter;
    const matchesMonth = payroll.month === monthFilter;
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'paid':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircleIcon,
          iconColor: 'text-green-600'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-yellow-600'
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: ClockIcon,
          iconColor: 'text-blue-600'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: ClockIcon,
          iconColor: 'text-gray-600'
        };
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatMonth = (monthString) => {
    return new Date(monthString + '-01').toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const totalPayroll = payrolls.reduce((sum, payroll) => sum + payroll.netSalary, 0);
  const paidCount = payrolls.filter(payroll => payroll.status === 'paid').length;
  const pendingCount = payrolls.filter(payroll => payroll.status === 'pending').length;
  const processingCount = payrolls.filter(payroll => payroll.status === 'processing').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Payroll Management
                </h1>
                <p className="text-gray-600">
                  Manage employee salaries and payroll processing
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <ChartBarIcon className="h-5 w-5" />
                <span>Reports</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <PlusIcon className="h-5 w-5" />
                <span>Process Payroll</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BanknotesIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPayroll)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-gray-900">{paidCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">{processingCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payroll Cards */}
        <div className="space-y-4">
          {filteredPayrolls.map((payroll) => {
            const statusInfo = getStatusInfo(payroll.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={payroll.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={payroll.avatar}
                      alt={payroll.employeeName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {payroll.employeeName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {payroll.employeeId} • {payroll.department}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatMonth(payroll.month)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`h-5 w-5 ${statusInfo.iconColor}`} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                      </span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Basic Salary</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(payroll.basicSalary)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Allowances</p>
                    <p className="text-lg font-semibold text-green-600">+{formatCurrency(payroll.allowances)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overtime</p>
                    <p className="text-lg font-semibold text-green-600">+{formatCurrency(payroll.overtime)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Deductions</p>
                    <p className="text-lg font-semibold text-red-600">-{formatCurrency(payroll.deductions)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Salary</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(payroll.netSalary)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attendance</p>
                    <p className="text-sm text-gray-900">{payroll.attendedDays}/{payroll.workingDays} days</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pay Date</p>
                    <p className="text-sm text-gray-900">{formatDate(payroll.payDate)}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    <span className="text-sm">Download Slip</span>
                  </button>
                  {payroll.status === 'pending' && (
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                      <ClockIcon className="h-4 w-4" />
                      <span className="text-sm">Process</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredPayrolls.length === 0 && (
          <div className="text-center py-12">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payroll records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or month filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollPage;
