import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  DocumentChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  ShareIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

const ReportsPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        title: 'Monthly Attendance Report',
        description: 'Comprehensive attendance analysis for all employees including absences, late arrivals, and overtime',
        category: 'attendance',
        type: 'scheduled',
        status: 'completed',
        author: 'HR System',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        createdDate: '2024-02-01',
        lastRun: '2024-02-12',
        nextRun: '2024-03-01',
        frequency: 'Monthly',
        format: 'PDF',
        size: '2.3 MB',
        downloads: 45,
        recipients: ['HR Team', 'Department Managers'],
        parameters: {
          dateRange: 'February 2024',
          departments: ['All'],
          includeOvertimeDetails: true
        }
      },
      {
        id: 2,
        title: 'Payroll Summary Report',
        description: 'Detailed payroll breakdown including salaries, deductions, taxes, and net pay calculations',
        category: 'payroll',
        type: 'scheduled',
        status: 'completed',
        author: 'Finance System',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        createdDate: '2024-01-28',
        lastRun: '2024-02-10',
        nextRun: '2024-03-10',
        frequency: 'Monthly',
        format: 'Excel',
        size: '1.8 MB',
        downloads: 23,
        recipients: ['Finance Team', 'CEO', 'HR Director'],
        parameters: {
          payPeriod: 'February 2024',
          includeDeductions: true,
          includeTaxBreakdown: true
        }
      },
      {
        id: 3,
        title: 'Employee Performance Analytics',
        description: 'Performance metrics and KPI analysis across all departments with goal achievement tracking',
        category: 'performance',
        type: 'ad-hoc',
        status: 'processing',
        author: 'John Doe',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        createdDate: '2024-02-08',
        lastRun: null,
        nextRun: null,
        frequency: 'On-demand',
        format: 'PDF',
        size: 'Processing...',
        downloads: 0,
        recipients: ['Management Team'],
        parameters: {
          quarter: 'Q1 2024',
          departments: ['Engineering', 'Sales'],
          includeGoalTracking: true
        }
      },
      {
        id: 4,
        title: 'Leave Analysis Report',
        description: 'Comprehensive analysis of leave patterns, trends, and utilization across the organization',
        category: 'leave',
        type: 'scheduled',
        status: 'completed',
        author: 'HR Analytics',
        authorAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
        createdDate: '2024-01-15',
        lastRun: '2024-02-05',
        nextRun: '2024-03-05',
        frequency: 'Monthly',
        format: 'Excel',
        size: '945 KB',
        downloads: 18,
        recipients: ['HR Team', 'Department Heads'],
        parameters: {
          analysisType: 'Full Analysis',
          includeLeaveBalance: true,
          includeTrends: true
        }
      },
      {
        id: 5,
        title: 'Department Budget Utilization',
        description: 'Budget allocation and spending analysis by department with variance reporting',
        category: 'financial',
        type: 'scheduled',
        status: 'failed',
        author: 'Finance Team',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        createdDate: '2024-02-01',
        lastRun: '2024-02-11',
        nextRun: '2024-02-15',
        frequency: 'Bi-weekly',
        format: 'PDF',
        size: 'Failed',
        downloads: 0,
        recipients: ['Finance Team', 'Department Managers'],
        parameters: {
          fiscalPeriod: 'Q1 2024',
          includeForecast: true,
          showVariance: true
        }
      },
      {
        id: 6,
        title: 'Training Completion Dashboard',
        description: 'Employee training progress and completion rates across all mandatory and optional courses',
        category: 'training',
        type: 'ad-hoc',
        status: 'completed',
        author: 'Learning & Development',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        createdDate: '2024-02-09',
        lastRun: '2024-02-09',
        nextRun: null,
        frequency: 'On-demand',
        format: 'Excel',
        size: '1.2 MB',
        downloads: 12,
        recipients: ['L&D Team', 'HR Director'],
        parameters: {
          courseType: 'All Courses',
          includeCompletionRates: true,
          showProgressTracking: true
        }
      },
      {
        id: 7,
        title: 'Recruitment Metrics Report',
        description: 'Hiring funnel analysis, time-to-hire metrics, and recruitment source effectiveness',
        category: 'recruitment',
        type: 'scheduled',
        status: 'scheduled',
        author: 'Talent Acquisition',
        authorAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
        createdDate: '2024-02-10',
        lastRun: '2024-01-15',
        nextRun: '2024-02-15',
        frequency: 'Monthly',
        format: 'PDF',
        size: 'Pending',
        downloads: 0,
        recipients: ['HR Team', 'Hiring Managers'],
        parameters: {
          reportPeriod: 'February 2024',
          includeSourceAnalysis: true,
          showTimeToHire: true
        }
      }
    ];

    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['all', 'attendance', 'payroll', 'performance', 'leave', 'financial', 'training', 'recruitment'];
  const statuses = ['all', 'completed', 'processing', 'failed', 'scheduled'];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircleIcon,
          iconColor: 'text-green-600'
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: ClockIcon,
          iconColor: 'text-blue-600'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-red-600'
        };
      case 'scheduled':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: CalendarIcon,
          iconColor: 'text-yellow-600'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: ClockIcon,
          iconColor: 'text-gray-600'
        };
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'attendance':
  return 'bg-blue-100 text-blue-800';
      case 'payroll':
  return 'bg-green-100 text-green-800';
      case 'performance':
  return 'bg-purple-100 text-purple-800';
      case 'leave':
  return 'bg-orange-100 text-orange-800';
      case 'financial':
  return 'bg-yellow-100 text-yellow-800';
      case 'training':
  return 'bg-indigo-100 text-indigo-800';
      case 'recruitment':
  return 'bg-pink-100 text-pink-800';
      default:
  return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const completedReports = reports.filter(report => report.status === 'completed').length;
  const processingReports = reports.filter(report => report.status === 'processing').length;
  const scheduledReports = reports.filter(report => report.status === 'scheduled').length;
  const totalDownloads = reports.reduce((sum, report) => sum + report.downloads, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
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
              <div className="p-3 bg-indigo-100 rounded-lg">
                <DocumentChartBarIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Reports & Analytics
                </h1>
                <p className="text-gray-600">
                  Generate and manage organizational reports and insights
                </p>
              </div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <PlusIcon className="h-5 w-5" />
              <span>Create Report</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedReports}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{processingReports}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">{scheduledReports}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ArrowDownTrayIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
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
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => {
            const statusInfo = getStatusInfo(report.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={report.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <img
                      src={report.authorAvatar}
                      alt={report.author}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                          {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className={`h-3 w-3 inline mr-1 ${statusInfo.iconColor}`} />
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(report.createdDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Run</p>
                    <p className="text-sm text-gray-900">{formatDate(report.lastRun)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Frequency</p>
                    <p className="text-sm text-gray-900">{report.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Format</p>
                    <p className="text-sm text-gray-900">{report.format}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Size</p>
                    <p className="text-sm text-gray-900">{report.size}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Downloads</p>
                    <p className="text-sm text-gray-900">{report.downloads}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Recipients</p>
                  <div className="flex flex-wrap gap-1">
                    {report.recipients.map((recipient, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {recipient}
                      </span>
                    ))}
                  </div>
                </div>

                {report.nextRun && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">
                        Next run: {formatDate(report.nextRun)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
          {report.status === 'completed' && (
                    <>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span className="text-sm">Download</span>
                      </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                        <EyeIcon className="h-4 w-4" />
                        <span className="text-sm">Preview</span>
                      </button>
                    </>
                  )}
                  {report.status === 'processing' && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                      <ClockIcon className="h-4 w-4" />
                      <span className="text-sm">Processing...</span>
                    </button>
                  )}
                  {report.status === 'failed' && (
                    <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <span className="text-sm">Retry</span>
                    </button>
                  )}
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                    <ShareIcon className="h-4 w-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or create a new report
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
