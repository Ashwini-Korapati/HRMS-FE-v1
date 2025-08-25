import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  SpeakerWaveIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  BellIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const AnnouncementsPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockAnnouncements = [
      {
        id: 1,
        title: 'New Employee Onboarding Program',
        content: 'We are excited to announce the launch of our comprehensive new employee onboarding program. This program will help new hires integrate smoothly into our company culture and get up to speed with their roles more efficiently.',
        type: 'general',
        priority: 'medium',
        author: 'HR Department',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        publishDate: '2024-02-10',
        expiryDate: '2024-03-10',
        departments: ['All'],
        status: 'published',
        views: 145,
        likes: 23,
        comments: 8,
        isPinned: true,
        isRead: false
      },
      {
        id: 2,
        title: 'Quarterly Performance Reviews - Q1 2024',
        content: 'Performance review cycle for Q1 2024 will begin on March 1st. All employees are required to complete their self-assessments by March 15th. Managers will conduct review meetings between March 16th and March 30th.',
        type: 'important',
        priority: 'high',
        author: 'Jane Smith',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        publishDate: '2024-02-12',
        expiryDate: '2024-03-30',
        departments: ['All'],
        status: 'published',
        views: 89,
        likes: 15,
        comments: 12,
        isPinned: true,
        isRead: true
      },
      {
        id: 3,
        title: 'New Office Hours Effective March 1st',
        content: 'Starting March 1st, our office hours will be updated to 9:00 AM - 6:00 PM Monday through Friday. This change is being made to better align with our client needs and improve work-life balance.',
        type: 'policy',
        priority: 'high',
        author: 'Mike Johnson',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        publishDate: '2024-02-08',
        expiryDate: '2024-04-08',
        departments: ['All'],
        status: 'published',
        views: 234,
        likes: 45,
        comments: 18,
        isPinned: false,
        isRead: true
      },
      {
        id: 4,
        title: 'Engineering Team Hackathon - March 15-16',
        content: 'Join us for our quarterly hackathon! This is a great opportunity to work on innovative projects, collaborate with colleagues, and showcase your creativity. Prizes will be awarded for the most innovative solutions.',
        type: 'event',
        priority: 'medium',
        author: 'John Doe',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        publishDate: '2024-02-05',
        expiryDate: '2024-03-16',
        departments: ['Engineering', 'Product'],
        status: 'published',
        views: 67,
        likes: 34,
        comments: 15,
        isPinned: false,
        isRead: false
      },
      {
        id: 5,
        title: 'Health Insurance Plan Updates',
        content: 'Our health insurance provider has updated their coverage plans. New benefits include dental coverage and mental health support. Please review the updated documentation and contact HR if you have questions.',
        type: 'benefits',
        priority: 'high',
        author: 'Sarah Davis',
        authorAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
        publishDate: '2024-02-01',
        expiryDate: '2024-05-01',
        departments: ['All'],
        status: 'published',
        views: 178,
        likes: 28,
        comments: 22,
        isPinned: false,
        isRead: true
      },
      {
        id: 6,
        title: 'Remote Work Policy Update',
        content: 'We are updating our remote work policy to provide more flexibility. Employees can now work remotely up to 3 days per week with manager approval. Please review the new guidelines and discuss with your manager.',
        type: 'policy',
        priority: 'medium',
        author: 'Emma Wilson',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        publishDate: '2024-01-28',
        expiryDate: '2024-04-28',
        departments: ['All'],
        status: 'published',
        views: 312,
        likes: 67,
        comments: 34,
        isPinned: false,
        isRead: false
      },
      {
        id: 7,
        title: 'New Parking Regulations',
        content: 'Effective immediately, visitor parking will be restricted to designated areas only. Employee parking assignments have been updated. Please check your email for your new parking spot assignment.',
        type: 'general',
        priority: 'low',
        author: 'Facilities Team',
        authorAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
        publishDate: '2024-02-14',
        expiryDate: '2024-06-14',
        departments: ['All'],
        status: 'draft',
        views: 0,
        likes: 0,
        comments: 0,
        isPinned: false,
        isRead: false
      }
    ];

    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setLoading(false);
    }, 1000);
  }, []);

  const types = ['all', 'general', 'important', 'policy', 'event', 'benefits'];
  const departments = ['all', 'All', 'Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Product'];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || announcement.type === typeFilter;
    const matchesDepartment = departmentFilter === 'all' || 
                             announcement.departments.includes(departmentFilter) ||
                             announcement.departments.includes('All');
    
    return matchesSearch && matchesType && matchesDepartment;
  });

  const getTypeInfo = (type) => {
    switch (type) {
      case 'important':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-red-600 dark:text-red-400'
        };
      case 'policy':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          icon: InformationCircleIcon,
          iconColor: 'text-blue-600 dark:text-blue-400'
        };
      case 'event':
        return {
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
          icon: CalendarIcon,
          iconColor: 'text-purple-600 dark:text-purple-400'
        };
      case 'benefits':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          icon: CheckCircleIcon,
          iconColor: 'text-green-600 dark:text-green-400'
        };
      case 'general':
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          icon: SpeakerWaveIcon,
          iconColor: 'text-gray-600 dark:text-gray-400'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          icon: SpeakerWaveIcon,
          iconColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const totalAnnouncements = announcements.filter(a => a.status === 'published').length;
  const unreadAnnouncements = announcements.filter(a => !a.isRead && a.status === 'published').length;
  const pinnedAnnouncements = announcements.filter(a => a.isPinned && a.status === 'published').length;
  const draftAnnouncements = announcements.filter(a => a.status === 'draft').length;

  // Sort announcements: pinned first, then by publish date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishDate) - new Date(a.publishDate);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading announcements...</p>
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
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <SpeakerWaveIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Announcements
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Company news, updates, and important information
                </p>
              </div>
            </div>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <PlusIcon className="h-5 w-5" />
              <span>New Announcement</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <SpeakerWaveIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Published</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAnnouncements}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <BellIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Unread</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{unreadAnnouncements}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pinned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pinnedAnnouncements}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <PencilIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{draftAnnouncements}</p>
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
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {departments.map(department => (
                <option key={department} value={department}>
                  {department === 'all' ? 'All Departments' : department}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Announcement Cards */}
        <div className="space-y-6">
          {sortedAnnouncements.map((announcement) => {
            const typeInfo = getTypeInfo(announcement.type);
            const TypeIcon = typeInfo.icon;
            
            return (
              <div
                key={announcement.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 ${
                  announcement.isPinned ? 'ring-2 ring-orange-200 dark:ring-orange-800' : ''
                } ${!announcement.isRead ? 'border-l-4 border-l-orange-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <img
                        src={announcement.authorAvatar}
                        alt={announcement.author}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {announcement.isPinned && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 text-xs rounded-full font-medium">
                              Pinned
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                            {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                            {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                          </span>
                        </div>
                        <h3 className={`text-xl font-semibold mb-2 ${!announcement.isRead ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-900 dark:text-white'}`}>
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                          {announcement.content}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>By {announcement.author}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(announcement.publishDate)}</span>
                          <span>•</span>
                          <span>Expires {formatDate(announcement.expiryDate)}</span>
                          <span>•</span>
                          <span>{announcement.views} views</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                        {announcement.likes > 0 ? (
                          <HeartIconSolid className="h-5 w-5 text-red-600" />
                        ) : (
                          <HeartIcon className="h-5 w-5" />
                        )}
                        <span className="text-sm">{announcement.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span className="text-sm">{announcement.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                        <ShareIcon className="h-5 w-5" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Target: {announcement.departments.join(', ')}
                      </span>
                      <div className="flex space-x-2">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 rounded text-sm flex items-center space-x-1 transition-colors duration-200">
                          <EyeIcon className="h-4 w-4" />
                          <span>Read More</span>
                        </button>
                        <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-1 px-3 rounded text-sm flex items-center space-x-1 transition-colors duration-200">
                          <PencilIcon className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sortedAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <SpeakerWaveIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No announcements found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria or create a new announcement
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
