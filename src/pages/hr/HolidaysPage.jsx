import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectCompany } from '@/features/auth/authSlice';
import {
  GiftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const HolidaysPage = () => {
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockHolidays = [
      {
        id: 1,
        name: 'New Year\'s Day',
        date: '2024-01-01',
        type: 'national',
        description: 'Celebration of the beginning of the new calendar year',
        isOptional: false,
        departments: ['All'],
        location: 'Global',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 2,
        name: 'Martin Luther King Jr. Day',
        date: '2024-01-15',
        type: 'national',
        description: 'Federal holiday honoring civil rights leader Martin Luther King Jr.',
        isOptional: false,
        departments: ['All'],
        location: 'United States',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 3,
        name: 'Presidents\' Day',
        date: '2024-02-19',
        type: 'national',
        description: 'Federal holiday honoring all U.S. presidents',
        isOptional: false,
        departments: ['All'],
        location: 'United States',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 4,
        name: 'Good Friday',
        date: '2024-03-29',
        type: 'religious',
        description: 'Christian holiday commemorating the crucifixion of Jesus Christ',
        isOptional: true,
        departments: ['All'],
        location: 'Global',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 5,
        name: 'Easter Monday',
        date: '2024-04-01',
        type: 'religious',
        description: 'Christian holiday celebrating the resurrection of Jesus Christ',
        isOptional: true,
        departments: ['All'],
        location: 'Global',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 6,
        name: 'Memorial Day',
        date: '2024-05-27',
        type: 'national',
        description: 'Federal holiday honoring military personnel who died in service',
        isOptional: false,
        departments: ['All'],
        location: 'United States',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 7,
        name: 'Independence Day',
        date: '2024-07-04',
        type: 'national',
        description: 'Celebration of American independence from British rule',
        isOptional: false,
        departments: ['All'],
        location: 'United States',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 8,
        name: 'Labor Day',
        date: '2024-09-02',
        type: 'national',
        description: 'Federal holiday celebrating the achievements of workers',
        isOptional: false,
        departments: ['All'],
        location: 'United States',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 9,
        name: 'Columbus Day',
        date: '2024-10-14',
        type: 'national',
        description: 'Federal holiday commemorating Christopher Columbus\'s arrival in the Americas',
        isOptional: true,
        departments: ['All'],
        location: 'United States',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 10,
        name: 'Veterans Day',
        date: '2024-11-11',
        type: 'national',
        description: 'Federal holiday honoring military veterans',
        isOptional: false,
        departments: ['All'],
        location: 'United States',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 11,
        name: 'Thanksgiving Day',
        date: '2024-11-28',
        type: 'national',
        description: 'Traditional holiday of giving thanks and celebrating harvest',
        isOptional: false,
        departments: ['All'],
        location: 'United States',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 12,
        name: 'Black Friday',
        date: '2024-11-29',
        type: 'company',
        description: 'Optional company holiday for shopping and family time',
        isOptional: true,
        departments: ['All'],
        location: 'Company Wide',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 13,
        name: 'Christmas Day',
        date: '2024-12-25',
        type: 'national',
        description: 'Christian holiday celebrating the birth of Jesus Christ',
        isOptional: false,
        departments: ['All'],
        location: 'Global',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 14,
        name: 'Company Anniversary',
        date: '2024-06-15',
        type: 'company',
        description: 'Celebrating 10 years of company establishment',
        isOptional: false,
        departments: ['All'],
        location: 'Company Wide',
        status: 'approved',
        totalDays: 1
      },
      {
        id: 15,
        name: 'Summer Break',
        date: '2024-08-01',
        type: 'company',
        description: 'Extended summer break for employee wellness',
        isOptional: true,
        departments: ['Engineering', 'Marketing'],
        location: 'Company Wide',
        status: 'pending',
        totalDays: 3
      }
    ];

    setTimeout(() => {
      setHolidays(mockHolidays);
      setLoading(false);
    }, 1000);
  }, []);

  const types = ['all', 'national', 'religious', 'company'];
  const years = ['2023', '2024', '2025'];

  const filteredHolidays = holidays.filter(holiday => {
    const holidayYear = new Date(holiday.date).getFullYear().toString();
    const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holiday.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || holiday.type === typeFilter;
    const matchesYear = holidayYear === yearFilter;
    
    return matchesSearch && matchesType && matchesYear;
  });

  const getTypeInfo = (type) => {
    switch (type) {
      case 'national':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          icon: GlobeAltIcon,
          iconColor: 'text-blue-600 dark:text-blue-400'
        };
      case 'religious':
        return {
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
          icon: GiftIcon,
          iconColor: 'text-purple-600 dark:text-purple-400'
        };
      case 'company':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          icon: BuildingOfficeIcon,
          iconColor: 'text-green-600 dark:text-green-400'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          icon: CalendarIcon,
          iconColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const holidayDate = new Date(dateString);
    const diffTime = holidayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isUpcoming = (dateString) => {
    const daysUntil = getDaysUntil(dateString);
    return daysUntil >= 0 && daysUntil <= 30;
  };

  const totalHolidays = holidays.filter(h => h.status === 'approved').length;
  const upcomingHolidays = holidays.filter(h => isUpcoming(h.date) && h.status === 'approved').length;
  const mandatoryHolidays = holidays.filter(h => !h.isOptional && h.status === 'approved').length;
  const optionalHolidays = holidays.filter(h => h.isOptional && h.status === 'approved').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading holidays...</p>
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
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <GiftIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Holiday Calendar
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage company holidays and observances
                </p>
              </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
              <PlusIcon className="h-5 w-5" />
              <span>Add Holiday</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Holidays</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalHolidays}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingHolidays}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Mandatory</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mandatoryHolidays}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FunnelIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Optional</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{optionalHolidays}</p>
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
                placeholder="Search holidays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Holiday Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHolidays.map((holiday) => {
            const typeInfo = getTypeInfo(holiday.type);
            const TypeIcon = typeInfo.icon;
            const daysUntil = getDaysUntil(holiday.date);
            const isHolidayUpcoming = isUpcoming(holiday.date);
            
            return (
              <div
                key={holiday.id}
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 ${
                  isHolidayUpcoming ? 'ring-2 ring-purple-200 dark:ring-purple-800' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${typeInfo.color.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-').replace('800', '100').replace('400', '900/30')}`}>
                      <TypeIcon className={`h-6 w-6 ${typeInfo.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {holiday.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{formatShortDate(holiday.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {holiday.isOptional && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs rounded-full font-medium">
                        Optional
                      </span>
                    )}
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{holiday.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Type:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                        {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Date:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{formatShortDate(holiday.date)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Duration:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {holiday.totalDays} day{holiday.totalDays > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Location:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{holiday.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(holiday.status)}`}>
                        {holiday.status.charAt(0).toUpperCase() + holiday.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {daysUntil >= 0 && (
                  <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days away`}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Departments:</p>
                  <div className="flex flex-wrap gap-1">
                    {holiday.departments.map((dept, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                  <button className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                    <PencilIcon className="h-4 w-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredHolidays.length === 0 && (
          <div className="text-center py-12">
            <GiftIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No holidays found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria or add a new holiday
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidaysPage;
