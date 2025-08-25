import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import SmartDashboardCards from '@/components/ui/SmartDashboardCards';
import SmartUserProfile from '@/components/ui/SmartUserProfile';
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BellIcon,
  CalendarIcon,
  BriefcaseIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const OverviewPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - replace with API call
  useEffect(() => {
    // Get company name for dynamic routing - fallback to 'demoproject' if not available
    const companyName = company?.name?.toLowerCase() || 'demoproject';
    
    const mockOverview = {
      quickStats: {
        totalEmployees: 156,
        presentToday: 142,
        onLeave: 8,
        lateArrivals: 3,
        totalSalaryExpense: 1280000,
        activeTasks: 89,
        completedTasks: 156,
        upcomingHolidays: 2
      },
      recentActivities: [
        {
          id: 1,
          type: 'employee_joined',
          title: 'New Employee Onboarding',
          description: 'Sarah Johnson joined the Marketing team',
          time: '2 hours ago',
          priority: 'medium',
          icon: UsersIcon
        },
        {
          id: 2,
          type: 'leave_approved',
          title: 'Leave Request Approved',
          description: 'Mike Davis - Annual Leave (Mar 15-20)',
          time: '4 hours ago',
          priority: 'low',
          icon: CalendarIcon
        },
        {
          id: 3,
          type: 'payroll_processed',
          title: 'Payroll Processing Complete',
          description: 'February payroll processed for all employees',
          time: '1 day ago',
          priority: 'high',
          icon: CurrencyDollarIcon
        },
        {
          id: 4,
          type: 'task_completed',
          title: 'Project Milestone Reached',
          description: 'Website Redesign - Phase 1 completed',
          time: '2 days ago',
          priority: 'medium',
          icon: CheckCircleIcon
        },
        {
          id: 5,
          type: 'announcement',
          title: 'Company All-Hands Meeting',
          description: 'Quarterly review scheduled for next Friday',
          time: '3 days ago',
          priority: 'high',
          icon: BellIcon
        }
      ],
      alerts: [
        {
          id: 1,
          type: 'warning',
          title: 'High Absenteeism Alert',
          description: 'Sales department has 15% absenteeism this week',
          action: 'Review attendance reports',
          link: `/${companyName}/overview/attendance`
        },
        {
          id: 2,
          type: 'info',
          title: 'Pending Leave Approvals',
          description: '12 leave requests awaiting manager approval',
          action: 'Review pending requests',
          link: `/${companyName}/overview/employees`
        },
        {
          id: 3,
          type: 'success',
          title: 'Training Completion Rate',
          description: '95% employees completed mandatory security training',
          action: 'View training reports',
          link: `/${companyName}/overview/analytics`
        }
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'New Hire Orientation',
          date: 'Today, 2:00 PM',
          location: 'Conference Room A',
          attendees: 5,
          type: 'orientation'
        },
        {
          id: 2,
          title: 'Performance Review Meeting',
          date: 'Tomorrow, 10:00 AM',
          location: 'HR Office',
          attendees: 1,
          type: 'review'
        },
        {
          id: 3,
          title: 'Team Building Event',
          date: 'Mar 15, 9:00 AM',
          location: 'Offsite Location',
          attendees: 45,
          type: 'event'
        },
        {
          id: 4,
          title: 'Board Meeting',
          date: 'Mar 20, 3:00 PM',
          location: 'Boardroom',
          attendees: 8,
          type: 'meeting'
        }
      ],
      quickActions: [
        {
          title: 'Add New Employee',
          description: 'Register a new team member',
          icon: UsersIcon,
          color: 'blue',
          link: `/${companyName}/overview/employees`,
          action: 'add'
        },
        {
          title: 'Process Payroll',
          description: 'Run monthly payroll calculation',
          icon: CurrencyDollarIcon,
          color: 'green',
          link: `/${companyName}/overview/payroll`,
          action: 'process'
        },
        {
          title: 'Approve Leaves',
          description: 'Review pending leave requests',
          icon: CalendarIcon,
          color: 'yellow',
          link: `/${companyName}/overview/employees`,
          action: 'approve'
        },
        {
          title: 'Generate Reports',
          description: 'Create custom HR reports',
          icon: ChartBarIcon,
          color: 'purple',
          link: `/${companyName}/overview/analytics`,
          action: 'generate'
        }
      ],
      performance: {
        attendanceRate: 92.5,
        satisfactionScore: 4.2,
        productivityIndex: 87,
        turnoverRate: 5.2
      },
      departmentSummary: [
        { name: 'Engineering', employees: 45, attendance: 94.2, status: 'excellent' },
        { name: 'Sales', employees: 32, attendance: 91.8, status: 'good' },
        { name: 'Marketing', employees: 28, attendance: 93.5, status: 'excellent' },
        { name: 'HR', employees: 15, attendance: 95.1, status: 'excellent' },
        { name: 'Finance', employees: 18, attendance: 92.7, status: 'good' },
        { name: 'Operations', employees: 18, attendance: 89.3, status: 'needs-attention' }
      ]
    };

    setTimeout(() => {
      setOverview(mockOverview);
      setLoading(false);
    }, 1000);
  }, [company]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
  return 'text-green-600 bg-green-100';
      case 'good':
  return 'text-yellow-600 bg-yellow-100';
      case 'needs-attention':
  return 'text-red-600 bg-red-100';
      default:
  return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertBg = (type) => {
    switch (type) {
      case 'warning':
  return 'bg-yellow-50 border-yellow-200';
      case 'success':
  return 'bg-green-50 border-green-200';
      default:
  return 'bg-blue-50 border-blue-200';
    }
  };

  const getActionColor = (color) => {
    const colors = {
  blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
  green: 'bg-green-100 text-green-600 hover:bg-green-200',
  yellow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
  purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-lg">
        <HomeIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
        <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName || 'User'}!
                </h1>
        <p className="text-gray-600">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
            
            {/* Smart User Profile */}
            <div className="lg:w-80">
              <SmartUserProfile />
            </div>
          </div>
        </div>

        {/* Smart Dashboard Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <SmartDashboardCards />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{overview.quickStats?.totalEmployees}</p>
                <p className="text-sm text-green-600 mt-1">
                  {overview.quickStats?.presentToday} present today
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-gray-900">{overview.performance?.attendanceRate}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {overview.quickStats?.lateArrivals} late arrivals
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ClockIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Payroll</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(overview.quickStats?.totalSalaryExpense)}</p>
                <p className="text-sm text-blue-600 mt-1">
                  Processing complete
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{overview.quickStats?.activeTasks}</p>
                <p className="text-sm text-purple-600 mt-1">
                  {overview.quickStats?.completedTasks} completed
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BriefcaseIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Alerts */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Alerts</h3>
              <div className="space-y-4">
                {overview.alerts?.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertBg(alert.type)}`}>
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <Link
                          to={alert.link}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                        >
                          {alert.action}
                          <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {overview.quickActions?.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`p-4 rounded-lg transition-colors ${getActionColor(action.color)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="h-8 w-8" />
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm opacity-80">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Department Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Overview</h3>
              <div className="space-y-3">
                {overview.departmentSummary?.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{dept.name}</h4>
                        <p className="text-sm text-gray-600">{dept.employees} employees</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{dept.attendance}%</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dept.status)}`}>
                        {dept.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Attendance Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${overview.performance?.attendanceRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{overview.performance?.attendanceRate}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Satisfaction Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(overview.performance?.satisfactionScore / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{overview.performance?.satisfactionScore}/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Productivity Index</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${overview.performance?.productivityIndex}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{overview.performance?.productivityIndex}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Turnover Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${overview.performance?.turnoverRate * 2}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{overview.performance?.turnoverRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Events</h3>
              <div className="space-y-4">
                {overview.upcomingEvents?.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.date}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">{event.location}</span>
                        <span className="text-xs text-gray-500">{event.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
              <div className="space-y-4">
                {overview.recentActivities?.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <activity.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/hr/activities"
                className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-4 pt-4 border-t border-gray-200"
              >
                View all activities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
