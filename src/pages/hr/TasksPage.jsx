import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FlagIcon,
  UserIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const TasksPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: 'Implement user authentication',
        description: 'Set up JWT-based authentication system with login and logout functionality',
        status: 'in-progress',
        priority: 'high',
        assignee: 'John Doe',
        assigneeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        project: 'Employee Management System',
        dueDate: '2024-02-20',
        createdDate: '2024-02-10',
        estimatedHours: 8,
        actualHours: 5,
        tags: ['Frontend', 'Security', 'React']
      },
      {
        id: 2,
        title: 'Design payroll calculation module',
        description: 'Create comprehensive payroll calculation system with tax deductions',
        status: 'todo',
        priority: 'medium',
        assignee: 'Alice Johnson',
        assigneeAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        project: 'Employee Management System',
        dueDate: '2024-02-25',
        createdDate: '2024-02-08',
        estimatedHours: 12,
        actualHours: 0,
        tags: ['Backend', 'Finance', 'API']
      },
      {
        id: 3,
        title: 'Update company branding',
        description: 'Refresh logo and brand guidelines across all marketing materials',
        status: 'completed',
        priority: 'low',
        assignee: 'Sarah Davis',
        assigneeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        project: 'Marketing Campaign Q1',
        dueDate: '2024-02-15',
        createdDate: '2024-02-01',
        estimatedHours: 6,
        actualHours: 7,
        tags: ['Design', 'Branding', 'Creative']
      },
      {
        id: 4,
        title: 'Database optimization',
        description: 'Optimize database queries and implement caching strategies',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Bob Wilson',
        assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        project: 'Financial Reporting System',
        dueDate: '2024-02-18',
        createdDate: '2024-02-12',
        estimatedHours: 10,
        actualHours: 6,
        tags: ['Database', 'Performance', 'Backend']
      },
      {
        id: 5,
        title: 'Mobile app wireframes',
        description: 'Create detailed wireframes for mobile application screens',
        status: 'review',
        priority: 'medium',
        assignee: 'Emma Wilson',
        assigneeAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
        project: 'Mobile App Development',
        dueDate: '2024-02-22',
        createdDate: '2024-02-14',
        estimatedHours: 8,
        actualHours: 8,
        tags: ['Design', 'Mobile', 'UX/UI']
      },
      {
        id: 6,
        title: 'Security vulnerability assessment',
        description: 'Conduct comprehensive security audit of existing systems',
        status: 'overdue',
        priority: 'high',
        assignee: 'David Lee',
        assigneeAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
        project: 'Security Audit',
        dueDate: '2024-02-10',
        createdDate: '2024-02-05',
        estimatedHours: 16,
        actualHours: 12,
        tags: ['Security', 'Audit', 'Testing']
      },
      {
        id: 7,
        title: 'Budget planning for Q2',
        description: 'Prepare detailed budget allocation for second quarter operations',
        status: 'todo',
        priority: 'medium',
        assignee: 'Mike Brown',
        assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        project: 'Financial Planning',
        dueDate: '2024-03-01',
        createdDate: '2024-02-12',
        estimatedHours: 6,
        actualHours: 0,
        tags: ['Finance', 'Planning', 'Budget']
      }
    ];

    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

  const statuses = ['all', 'todo', 'in-progress', 'review', 'completed', 'overdue'];
  const priorities = ['all', 'low', 'medium', 'high'];
  const assignees = ['all', ...Array.from(new Set(tasks.map(task => task.assignee)))];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircleIcon,
          iconColor: 'text-green-600'
        };
      case 'in-progress':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: PlayIcon,
          iconColor: 'text-blue-600'
        };
      case 'review':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: EyeIcon,
          iconColor: 'text-purple-600'
        };
      case 'todo':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: ClockIcon,
          iconColor: 'text-gray-600'
        };
      case 'overdue':
        return {
          color: 'bg-red-100 text-red-800',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-red-600'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: ClockIcon,
          iconColor: 'text-gray-600'
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const overdueTasks = tasks.filter(task => task.status === 'overdue').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
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
                <ClipboardDocumentListIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Task Management
                </h1>
                <p className="text-gray-600">
                  Track and manage project tasks and assignments
                </p>
              </div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <PlusIcon className="h-5 w-5" />
              <span>New Task</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">To Do</p>
                  <p className="text-2xl font-bold text-gray-900">{todoTasks}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <PlayIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>
                  {assignee === 'all' ? 'All Assignees' : assignee}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const statusInfo = getStatusInfo(task.status);
            const StatusIcon = statusInfo.icon;
            const daysUntilDue = getDaysUntilDue(task.dueDate);
            
            return (
              <div
                key={task.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <p className="text-sm text-blue-600 font-medium">{task.project}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-4 w-4 ${statusInfo.iconColor}`} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FlagIcon className="h-4 w-4 text-gray-400" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={task.assigneeAvatar}
                      alt={task.assignee}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{task.assignee}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Date</p>
                    <p className={`text-sm font-medium ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatDate(task.dueDate)}
                    </p>
                    {daysUntilDue >= 0 ? (
                      <p className="text-xs text-gray-500">{daysUntilDue} days left</p>
                    ) : (
                      <p className="text-xs text-red-500">{Math.abs(daysUntilDue)} days overdue</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estimated</p>
                    <p className="text-sm text-gray-900">{task.estimatedHours}h</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Actual</p>
                    <p className="text-sm text-gray-900">{task.actualHours}h</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Progress</p>
                    <p className="text-sm text-gray-900">
                      {task.estimatedHours > 0 ? Math.round((task.actualHours / task.estimatedHours) * 100) : 0}%
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                    <PencilIcon className="h-4 w-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                  {task.status === 'todo' && (
                    <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                      <PlayIcon className="h-4 w-4" />
                      <span className="text-sm">Start</span>
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="text-sm">Complete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or create a new task
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
