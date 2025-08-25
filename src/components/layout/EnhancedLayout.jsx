import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectUser, 
  selectCompany, 
  selectNavigation,
  selectUserRole,
  logout
} from '@/features/auth/authSlice';
import DynamicNavigation from '@/components/Navigation/DynamicNavigation';
import DynamicBreadcrumb from '@/components/Navigation/DynamicBreadcrumb';
import Avatar from '@/components/Avatar/Avatar';
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const EnhancedLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);
  const navigation = useSelector(selectNavigation);
  const userRole = useSelector(selectUserRole);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getCompanyKey = () => {
    // Prefer Redux state
    const stateKey = company?.subdomain || company?.name?.toLowerCase();
    if (stateKey) return stateKey;
    // Fallback to URL segment if available
    const seg = location?.pathname?.split('/')?.filter(Boolean)?.[0];
    const reserved = new Set(['dashboard', 'u', 'c', 'uas', 'public', 'auth']);
    if (!seg || reserved.has(seg)) return '';
    return seg;
  }
  const goToDashboard = () => {
    const key = getCompanyKey()
    // Navigate only to company-scoped dashboard; no plain '/dashboard' fallback
    if (!key) return;
    navigate(`/${key}/dashboard`)
    setSidebarOpen(false)
  }

  const handleSettingsClick = () => {
    // Find settings in navigation
    const settingsNav = navigation?.find(nav => nav.label.toLowerCase().includes('settings'));
    if (settingsNav) {
      const settingsUrl = settingsNav.url ? new URL(settingsNav.url).pathname : settingsNav.path;
      navigate(settingsUrl);
    } else {
      navigate('/profile');
    }
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      
      // Dispatch logout action to clear Redux state
      await dispatch(logout()).unwrap();
      
      // Clear all localStorage data
      localStorage.removeItem('hr_access_token');
      localStorage.removeItem('hr_refresh_token');
      localStorage.removeItem('hr_user_info');
      localStorage.removeItem('hr_tenant_info');
      localStorage.removeItem('hr_dashboard_url');
      localStorage.removeItem('hr_navigation_data');
      localStorage.removeItem('hr_routes_data');
      localStorage.removeItem('uas_email');
      localStorage.removeItem('uas_company_info');
      
      // Clear sessionStorage as well
      sessionStorage.clear();
      
      console.log('Logout successful, redirecting to login...');
      navigate('/uas/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      localStorage.clear();
      sessionStorage.clear();
      navigate('/uas/login', { replace: true });
    }
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      return user.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.name) {
      return user.name;
    }
    return 'User';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity ease-linear duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transform transition ease-in-out duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 cursor-pointer" onClick={goToDashboard} role="button" aria-label="Go to Dashboard">
              {company?.logo ? (
                <img className="h-8 w-auto" src={company.logo} alt={company.name} />
              ) : (
                <div className="h-8 w-8 bg-blue-500 dark:bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {company?.name?.charAt(0) || 'C'}
                  </span>
                </div>
              )}
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                {company?.name || 'HR Office'}
              </span>
            </div>
            <nav className="mt-5 px-2">
              <DynamicNavigation />
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 cursor-pointer" onClick={goToDashboard} role="button" aria-label="Go to Dashboard">
              {company?.logo ? (
                <img className="h-8 w-auto" src={company.logo} alt={company.name} />
              ) : (
                <div className="h-8 w-8 bg-blue-500 dark:bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {company?.name?.charAt(0) || 'C'}
                  </span>
                </div>
              )}
              <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                {company?.name || 'HR Office'}
              </span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <DynamicNavigation />
            </nav>
          </div>
          
          {/* User info section */}
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center w-full">
              <Avatar
                src={user?.avatar}
                alt={getUserDisplayName()}
                fallback={getUserInitials()}
                size="sm"
                className="inline-block"
              />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userRole}</p>
              </div>
              
              {/* User menu dropdown */}
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  type="button"
                  className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50">
                    <div className="py-1">
                      <button
                        onClick={handleSettingsClick}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <Cog6ToothIcon className="h-4 w-4 mr-2" />
                        Settings
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            {/* Search bar */}
            <div className="flex-1 flex items-center">
              <div className="max-w-lg w-full lg:max-w-xs">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            {/* Right side actions */}
            <div className="ml-4 flex items-center space-x-4">
              {/* Notifications */}
              <button
                type="button"
                className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <BellIcon className="h-6 w-6" />
              </button>
              
              {/* Settings */}
              <button
                type="button"
                className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleSettingsClick}
              >
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
              
              {/* User avatar with dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <Avatar
                    src={user?.avatar}
                    alt={getUserDisplayName()}
                    fallback={getUserInitials()}
                    size="sm"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  <ChevronDownIcon className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''} lg:hidden`} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={user?.avatar}
                          alt={getUserDisplayName()}
                          fallback={getUserInitials()}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mt-1">
                            {userRole}
                          </span>
                        </div>
                      </div>
                      
                      {/* Company info */}
                      {company && (
                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-500 dark:bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {company.name?.charAt(0) || 'C'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {company.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {company.subdomain}.hroffice.com
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={handleSettingsClick}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        <Cog6ToothIcon className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <DynamicBreadcrumb />

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EnhancedLayout;
