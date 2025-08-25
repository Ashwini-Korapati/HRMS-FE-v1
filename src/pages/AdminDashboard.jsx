import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectUser, 
  selectCompany, 
  selectNavigation,
  selectUserPermissions,
  selectUserRole,
  selectIsAuthenticated,
  logout
} from '@/features/auth/authSlice';
import MetricCard from '@/components/Stats/MetricCard';
import DynamicNavigation from '@/components/Navigation/DynamicNavigation';
import {
  UsersIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const navigation = useSelector(selectNavigation);
  const permissions = useSelector(selectUserPermissions);
  const userRole = useSelector(selectUserRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedStats, setAnimatedStats] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  // dark mode removed; app uses light theme only

  // Check authentication and admin role on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/uas/login');
      return;
    }
    
    if (userRole !== 'ADMIN') {
      // If user is not admin, redirect to their appropriate dashboard
      if (navigation && navigation.length > 0) {
        const firstNavUrl = navigation[0].url ? new URL(navigation[0].url).pathname : navigation[0].path;
        navigate(firstNavUrl);
      } else {
        navigate('/');
      }
      return;
    }
    
    console.log('Admin dashboard loaded for:', user?.firstName, user?.lastName);
  }, [isAuthenticated, userRole, navigate, user, navigation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Trigger animation after component mount
    const animationTimer = setTimeout(() => {
      setAnimatedStats(true);
    }, 100);

    // Close user menu when clicking outside
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(timer);
      clearTimeout(animationTimer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/uas/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force navigation even if logout fails
      navigate('/uas/login');
    }
  };

  const getUserInitials = () => {
    if (!user?.firstName || !user?.lastName) return 'AD';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user?.firstName || !user?.lastName) return 'Admin User';
    return `${user.firstName} ${user.lastName}`;
  };

  // Mock data - in real app this would come from API
  const dashboardStats = [
    {
      title: 'Total Employees',
      value: '248',
      change: '+12%',
      trend: 'up',
      icon: UsersIcon,
      color: 'blue',
      description: 'Active employees in system'
    },
    {
      title: 'Departments',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: BuildingOfficeIcon,
      color: 'green',
      description: 'Active departments'
    },
    {
      title: 'Attendance Rate',
      value: '94.2%',
      change: '-1.2%',
      trend: 'down',
      icon: ClockIcon,
      color: 'yellow',
      description: 'This month average'
    },
    {
      title: 'Monthly Payroll',
      value: '$486,200',
      change: '+8.5%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'purple',
      description: 'Total payroll this month'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'employee_join',
      message: 'Sarah Johnson joined Marketing Department',
      time: '2 hours ago',
      icon: UsersIcon,
      color: 'green'
    },
    {
      id: 2,
      type: 'leave_request',
      message: '5 pending leave requests require approval',
      time: '4 hours ago',
      icon: CalendarIcon,
      color: 'yellow'
    },
    {
      id: 3,
      type: 'document_upload',
      message: 'Policy document updated by HR Team',
      time: '6 hours ago',
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      id: 4,
      type: 'report_generated',
      message: 'Monthly attendance report generated',
      time: '1 day ago',
      icon: ChartBarIcon,
      color: 'purple'
    }
  ];

  const quickActions = [
    {
      title: 'Add Employee',
      description: 'Register new team member',
      route: navigation?.find(nav => nav.label === 'Employees')?.path || `/${user?.company?.subdomain || 'company'}/users`,
      icon: UsersIcon,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Generate Report',
      description: 'Create custom reports',
      route: navigation?.find(nav => nav.label === 'Reports')?.path || `/${user?.company?.subdomain || 'company'}/reports`,
      icon: ChartBarIcon,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Manage Payroll',
      description: 'Process monthly payroll',
      route: navigation?.find(nav => nav.label === 'Payroll')?.path || `/${user?.company?.subdomain || 'company'}/payroll`,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Department Settings',
      description: 'Configure departments',
      route: navigation?.find(nav => nav.label === 'Departments')?.path || `/${user?.company?.subdomain || 'company'}/departments`,
      icon: BuildingOfficeIcon,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const alertsAndNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Pending Approvals',
      message: '8 leave requests awaiting approval',
      priority: 'medium',
      icon: ExclamationTriangleIcon
    },
    {
      id: 2,
      type: 'success',
      title: 'Payroll Processed',
      message: 'November payroll successfully completed',
      priority: 'low',
      icon: CheckCircleIcon
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'Scheduled maintenance this weekend',
      priority: 'high',
      icon: ExclamationTriangleIcon
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 bg-gray-50`}>
      {/* Header */}
      <div className={`shadow-sm border-b transition-colors duration-200 bg-white border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className={`text-3xl font-bold transition-colors duration-200 text-gray-900`}>
                Admin Dashboard
              </h1>
              <p className={`mt-1 text-sm transition-colors duration-200 text-gray-500`}>
                Welcome back, {getUserDisplayName()}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Company Info & Time */}
              <div className="text-right hidden md:block">
                <p className={`text-sm transition-colors duration-200 text-gray-500`}>
                  {company?.name}
                </p>
                <p className={`text-lg font-semibold transition-colors duration-200 text-gray-900`}>
                  {currentTime.toLocaleTimeString()}
                </p>
                <p className={`text-sm transition-colors duration-200 text-gray-500`}>
                  {currentTime.toLocaleDateString()}
                </p>
              </div>

              {/* User Menu */}
              <div className="relative user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-900`}
                >
                  {/* User Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-blue-500 text-white`}>
                    {getUserInitials()}
                  </div>
                  
                  {/* User Info */}
                  <div className="text-left hidden lg:block">
                    <p className={`text-sm font-medium transition-colors duration-200 text-gray-900`}>
                      {getUserDisplayName()}
                    </p>
                    <p className={`text-xs transition-colors duration-200 text-gray-500`}>
                      {userRole} • {user?.email}
                    </p>
                  </div>
                  
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''} text-gray-500`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50 transition-colors duration-200 bg-white border-gray-200`}>
                    {/* User Bio Section */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium bg-blue-500 text-white`}>
                          {getUserInitials()}
                        </div>
                        <div>
                          <p className={`font-medium transition-colors duration-200 text-gray-900`}>
                            {getUserDisplayName()}
                          </p>
                          <p className={`text-sm transition-colors duration-200 text-gray-500`}>
                            {user?.email}
                          </p>
                          <p className={`text-xs px-2 py-1 rounded-full inline-block mt-1 bg-blue-100 text-blue-800`}>
                            {userRole}
                          </p>
                        </div>
                      </div>
                      
                      {/* Company Badge */}
                      {company && (
                        <div className={`mt-3 p-2 rounded-lg bg-gray-50`}>
                          <div className="flex items-center space-x-2">
                            <BuildingOfficeIcon className={`h-4 w-4 text-gray-500`} />
                            <div>
                              <p className={`text-sm font-medium text-gray-900`}>
                                {company.name}
                              </p>
                              <p className={`text-xs text-gray-500`}>
                                {company.subdomain}.hroffice.com
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Navigate to profile if it exists in navigation
                          const profileNav = navigation?.find(nav => nav.label.toLowerCase().includes('profile'));
                          if (profileNav) {
                            const profileUrl = profileNav.url ? new URL(profileNav.url).pathname : profileNav.path;
                            navigate(profileUrl);
                          }
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center space-x-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                      >
                        <UserCircleIcon className="h-4 w-4" />
                        <span>View Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Navigate to settings if it exists in navigation
                          const settingsNav = navigation?.find(nav => nav.label.toLowerCase().includes('settings'));
                          if (settingsNav) {
                            const settingsUrl = settingsNav.url ? new URL(settingsNav.url).pathname : settingsNav.path;
                            navigate(settingsUrl);
                          }
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center space-x-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      
                      <hr className={`my-2 border-gray-200`} />
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 flex items-center space-x-2 text-red-600 hover:bg-red-50 hover:text-red-700`}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-sm p-6 transition-colors duration-200 bg-white`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 text-gray-900`}>
                Navigation
              </h3>
              <DynamicNavigation />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <div
                  key={stat.title}
                  className={`transform transition-all duration-500 ${
                    animatedStats 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <MetricCard
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                    change={stat.change}
                    color={stat.color}
                    description={stat.description}
                  />
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className={`rounded-lg shadow-sm p-6 transition-colors duration-200 bg-white`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 text-gray-900`}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                    onClick={() => navigate(action.route)}
                  >
                    <action.icon className="h-8 w-8 mb-2" />
                    <h4 className="font-semibold text-sm">{action.title}</h4>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className={`rounded-lg shadow-sm p-6 transition-colors duration-200 bg-white`}>
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 text-gray-900`}>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 p-2 rounded-full ${
                        activity.color === 'green' ? 'bg-green-100 text-green-600' :
                        activity.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                        activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm transition-colors duration-200 text-gray-900`}>
                          {activity.message}
                        </p>
                        <p className={`text-xs transition-colors duration-200 text-gray-500`}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts & Notifications */}
              <div className={`rounded-lg shadow-sm p-6 transition-colors duration-200 bg-white`}>
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-200 text-gray-900`}>
                  Alerts & Notifications
                </h3>
                <div className="space-y-4">
                  {alertsAndNotifications.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 transition-colors duration-200 ${
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      alert.type === 'success' ? 'bg-green-50 border-green-400' :
                      'bg-blue-50 border-blue-400'
                    }`}>
                      <div className="flex items-start">
                        <alert.icon className={`h-5 w-5 mr-3 ${
                          alert.type === 'warning' ? 'text-yellow-600' :
                          alert.type === 'success' ? 'text-green-600' :
                          'text-blue-600'
                        }`} />
                        <div>
                          <h4 className={`text-sm font-semibold transition-colors duration-200 text-gray-900`}>
                            {alert.title}
                          </h4>
                          <p className={`text-sm transition-colors duration-200 text-gray-600`}>
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
