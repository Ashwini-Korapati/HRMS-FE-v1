import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  FolderIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

const ProjectsPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        name: 'Employee Management System',
        description: 'Comprehensive HR management platform with employee tracking and payroll',
        status: 'in-progress',
        priority: 'high',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        progress: 65,
        budget: 50000,
        spent: 32500,
        teamMembers: [
          { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
          { name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
          { name: 'Bob Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
        ],
        manager: 'John Doe',
        department: 'Engineering',
        tasksCompleted: 23,
        totalTasks: 35
      },
      {
        id: 2,
        name: 'Marketing Campaign Q1',
        description: 'Digital marketing campaign for product launch and brand awareness',
        status: 'planning',
        priority: 'medium',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        progress: 15,
        budget: 25000,
        spent: 3750,
        teamMembers: [
          { name: 'Sarah Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
          { name: 'Mike Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
        ],
        manager: 'Sarah Davis',
        department: 'Marketing',
        tasksCompleted: 3,
        totalTasks: 20
      },
      {
        id: 3,
        name: 'Financial Reporting System',
        description: 'Automated financial reporting and analytics dashboard',
        status: 'completed',
        priority: 'high',
        startDate: '2023-10-01',
        endDate: '2024-01-31',
        progress: 100,
        budget: 40000,
        spent: 38500,
        teamMembers: [
          { name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150' },
          { name: 'David Lee', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150' }
        ],
        manager: 'Emma Wilson',
        department: 'Finance',
        tasksCompleted: 18,
        totalTasks: 18
      },
      {
        id: 4,
        name: 'Mobile App Development',
        description: 'Cross-platform mobile application for employee self-service',
        status: 'in-progress',
        priority: 'high',
        startDate: '2024-02-01',
        endDate: '2024-06-30',
        progress: 40,
        budget: 75000,
        spent: 30000,
        teamMembers: [
          { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
          { name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
          { name: 'Bob Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
          { name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150' }
        ],
        manager: 'John Doe',
        department: 'Engineering',
        tasksCompleted: 12,
        totalTasks: 30
      },
      {
        id: 5,
        name: 'Office Renovation',
        description: 'Complete renovation of workspace and meeting rooms',
        status: 'on-hold',
        priority: 'low',
        startDate: '2024-04-01',
        endDate: '2024-07-31',
        progress: 5,
        budget: 100000,
        spent: 5000,
        teamMembers: [
          { name: 'Mike Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
        ],
        manager: 'Mike Brown',
        department: 'Operations',
        tasksCompleted: 1,
        totalTasks: 25
      },
      {
        id: 6,
        name: 'Security Audit',
        description: 'Comprehensive security assessment and compliance review',
        status: 'in-progress',
        priority: 'high',
        startDate: '2024-02-15',
        endDate: '2024-03-15',
        progress: 80,
        budget: 20000,
        spent: 16000,
        teamMembers: [
          { name: 'David Lee', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150' },
          { name: 'Sarah Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' }
        ],
        manager: 'David Lee',
        department: 'IT',
        tasksCompleted: 8,
        totalTasks: 10
      }
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const statuses = ['all', 'planning', 'in-progress', 'completed', 'on-hold'];
  const priorities = ['all', 'low', 'medium', 'high'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
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
      case 'planning':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: ClockIcon,
          iconColor: 'text-yellow-600'
        };
      case 'on-hold':
        return {
          color: 'bg-red-100 text-red-800',
          icon: PauseIcon,
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

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const activeProjects = projects.filter(project => project.status === 'in-progress').length;
  const completedProjects = projects.filter(project => project.status === 'completed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
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
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Project Management
                </h1>
                <p className="text-gray-600">
                  Track and manage organizational projects
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <ChartBarIcon className="h-5 w-5" />
                <span>Analytics</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <PlusIcon className="h-5 w-5" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FolderIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <PlayIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Budget Used</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((totalSpent / totalBudget) * 100)}%
                  </p>
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const statusInfo = getStatusInfo(project.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div
                key={project.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FolderIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600">{project.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                <div className="flex items-center space-x-2 mb-4">
                  <StatusIcon className={`h-4 w-4 ${statusInfo.iconColor}`} />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {project.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {project.tasksCompleted}/{project.totalTasks} tasks
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budget</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(project.budget)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Spent</p>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(project.spent)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Team Members</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {project.teamMembers.slice(0, 4).map((member, index) => (
                        <img
                          key={index}
                          src={member.avatar}
                          alt={member.name}
                          className="h-8 w-8 rounded-full border-2 border-white object-cover"
                          title={member.name}
                        />
                      ))}
                      {project.teamMembers.length > 4 && (
                        <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            +{project.teamMembers.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">
                        Manager: <span className="font-medium text-gray-900">{project.manager}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                    <PencilIcon className="h-4 w-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or create a new project
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
