import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  ChartBarIcon,
  PresentationChartLineIcon,
  FunnelIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const AnalyticsPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [timeFilter, setTimeFilter] = useState('30d');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockAnalytics = {
      overview: {
        totalEmployees: 156,
        activeEmployees: 148,
        newHires: 12,
        turnoverRate: 5.2,
        avgSalary: 75000,
        attendanceRate: 92.5,
        satisfactionScore: 4.2,
        productivityIndex: 87
      },
      trends: {
        employeeGrowth: [
          { month: 'Jan', count: 140 },
          { month: 'Feb', count: 145 },
          { month: 'Mar', count: 150 },
          { month: 'Apr', count: 148 },
          { month: 'May', count: 152 },
          { month: 'Jun', count: 156 }
        ],
        attendanceTrend: [
          { month: 'Jan', rate: 89.2 },
          { month: 'Feb', rate: 91.5 },
          { month: 'Mar', rate: 90.8 },
          { month: 'Apr', rate: 93.1 },
          { month: 'May', rate: 94.2 },
          { month: 'Jun', rate: 92.5 }
        ],
        payrollTrend: [
          { month: 'Jan', amount: 1150000 },
          { month: 'Feb', amount: 1180000 },
          { month: 'Mar', amount: 1220000 },
          { month: 'Apr', amount: 1190000 },
          { month: 'May', amount: 1250000 },
          { month: 'Jun', amount: 1280000 }
        ]
      },
      departmentMetrics: [
        {
          name: 'Engineering',
          employees: 45,
          avgSalary: 95000,
          attendanceRate: 94.2,
          satisfactionScore: 4.5,
          turnoverRate: 3.2,
          productivity: 92
        },
        {
          name: 'Sales',
          employees: 32,
          avgSalary: 68000,
          attendanceRate: 91.8,
          satisfactionScore: 4.1,
          turnoverRate: 8.1,
          productivity: 88
        },
        {
          name: 'Marketing',
          employees: 28,
          avgSalary: 72000,
          attendanceRate: 93.5,
          satisfactionScore: 4.3,
          turnoverRate: 4.8,
          productivity: 85
        },
        {
          name: 'HR',
          employees: 15,
          avgSalary: 65000,
          attendanceRate: 95.1,
          satisfactionScore: 4.4,
          turnoverRate: 2.1,
          productivity: 90
        },
        {
          name: 'Finance',
          employees: 18,
          avgSalary: 78000,
          attendanceRate: 92.7,
          satisfactionScore: 4.0,
          turnoverRate: 5.5,
          productivity: 89
        },
        {
          name: 'Operations',
          employees: 18,
          avgSalary: 58000,
          attendanceRate: 89.3,
          satisfactionScore: 3.8,
          turnoverRate: 7.2,
          productivity: 82
        }
      ],
      leaveAnalytics: {
        totalLeaveDays: 1245,
        avgLeavePerEmployee: 8.2,
        leaveTypes: [
          { type: 'Annual Leave', count: 45, percentage: 42 },
          { type: 'Sick Leave', count: 28, percentage: 26 },
          { type: 'Personal Leave', count: 18, percentage: 17 },
          { type: 'Maternity/Paternity', count: 12, percentage: 11 },
          { type: 'Emergency Leave', count: 4, percentage: 4 }
        ]
      },
      performanceMetrics: {
        avgRating: 4.1,
        goalsAchieved: 78,
        topPerformers: 23,
        needsImprovement: 12,
        trainingCompleted: 156,
        certifications: 89
      },
      predictions: {
        nextMonthTurnover: 2.8,
        upcomingRetirements: 3,
        budgetProjection: 1320000,
        headcountForecast: 162
      }
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, []);

  const timeFilters = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '3m', label: 'Last 3 Months' },
    { value: '6m', label: 'Last 6 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  const departments = ['all', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) {
      return <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />;
    } else if (current < previous) {
      return <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading analytics...</p>
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
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ChartBarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  HR Analytics Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive insights into organizational metrics and trends
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.overview?.totalEmployees}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getTrendIcon(analytics.overview?.totalEmployees, 150)}
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +{getPercentageChange(analytics.overview?.totalEmployees, 150).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UsersIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Attendance Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.overview?.attendanceRate}%</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getTrendIcon(analytics.overview?.attendanceRate, 90)}
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +{getPercentageChange(analytics.overview?.attendanceRate, 90).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ClockIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Salary</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(analytics.overview?.avgSalary)}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getTrendIcon(analytics.overview?.avgSalary, 72000)}
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +{getPercentageChange(analytics.overview?.avgSalary, 72000).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Satisfaction Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.overview?.satisfactionScore}/5</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getTrendIcon(analytics.overview?.satisfactionScore, 4.0)}
                  <span className="text-sm text-green-600 dark:text-green-400">
                    +{getPercentageChange(analytics.overview?.satisfactionScore, 4.0).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <HeartIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Employee Growth Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Growth</h3>
              <PresentationChartLineIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.trends?.employeeGrowth?.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(data.count / 160) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.month}</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{data.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Trend Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Trend</h3>
              <ChartBarIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.trends?.attendanceTrend?.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${data.rate}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.month}</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{data.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Department Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Employees</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Avg Salary</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Attendance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Satisfaction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Turnover</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Productivity</th>
                </tr>
              </thead>
              <tbody>
                {analytics.departmentMetrics?.map((dept, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{dept.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{dept.employees}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatCurrency(dept.avgSalary)}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{dept.attendanceRate}%</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{dept.satisfactionScore}/5</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{dept.turnoverRate}%</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${dept.productivity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{dept.productivity}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Analytics */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave Analytics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Leave Days</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatNumber(analytics.leaveAnalytics?.totalLeaveDays)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Avg per Employee</span>
                <span className="font-medium text-gray-900 dark:text-white">{analytics.leaveAnalytics?.avgLeavePerEmployee} days</span>
              </div>
              <div className="space-y-2">
                {analytics.leaveAnalytics?.leaveTypes?.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{type.type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${type.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{type.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AcademicCapIcon className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</span>
                    <span className="font-medium text-gray-900 dark:text-white">{analytics.performanceMetrics?.avgRating}/5</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BriefcaseIcon className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Goals Achieved</span>
                    <span className="font-medium text-gray-900 dark:text-white">{analytics.performanceMetrics?.goalsAchieved}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <UsersIcon className="h-5 w-5 text-purple-500" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Top Performers</span>
                    <span className="font-medium text-gray-900 dark:text-white">{analytics.performanceMetrics?.topPerformers}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <AcademicCapIcon className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Training Completed</span>
                    <span className="font-medium text-gray-900 dark:text-white">{analytics.performanceMetrics?.trainingCompleted}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Predictions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Predictions & Forecasts</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600 dark:text-blue-400">Next Month Turnover</span>
                  <span className="font-medium text-blue-700 dark:text-blue-300">{analytics.predictions?.nextMonthTurnover}%</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 dark:text-green-400">Budget Projection</span>
                  <span className="font-medium text-green-700 dark:text-green-300">{formatCurrency(analytics.predictions?.budgetProjection)}</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-600 dark:text-yellow-400">Headcount Forecast</span>
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">{analytics.predictions?.headcountForecast}</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-600 dark:text-purple-400">Upcoming Retirements</span>
                  <span className="font-medium text-purple-700 dark:text-purple-300">{analytics.predictions?.upcomingRetirements}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
