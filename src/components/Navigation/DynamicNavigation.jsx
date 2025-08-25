import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectNavigation, selectUser } from '@/features/auth/authSlice';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  FolderOpenIcon,
  CheckIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline';

// Map backend icon names to Heroicon components
const iconMap = {
  'LayoutDashboard': HomeIcon,
  'Users': UsersIcon,
  'Building2': BuildingOfficeIcon,
  'Briefcase': BriefcaseIcon,
  'Calendar': CalendarIcon,
  'Clock': ClockIcon,
  'DollarSign': CurrencyDollarIcon,
  'FolderOpen': FolderOpenIcon,
  'CheckSquare': CheckIcon,
  'CalendarDays': CalendarIcon,
  'Megaphone': SpeakerWaveIcon,
  'FileText': DocumentTextIcon,
  'BarChart3': ChartBarIcon
};

const getIconForNavItem = (iconName) => {
  return iconMap[iconName] || DocumentTextIcon;
};

const DynamicNavigation = () => {
  const location = useLocation();
  const navigation = useSelector(selectNavigation);
  const user = useSelector(selectUser);
  
  console.log('DynamicNavigation - Navigation data:', navigation);
  console.log('DynamicNavigation - Current location:', location.pathname);
  
  if (!navigation || !Array.isArray(navigation)) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading navigation...</p>
      </div>
    );
  }

  return (
    <nav className="space-y-1">
      {navigation.map((item, index) => {
        const IconComponent = getIconForNavItem(item.icon);
        
        // Handle both URL and path formats
        let navigateTo = '';
        let urlPath = '';
        
        if (item.url) {
          try {
            const url = new URL(item.url);
            navigateTo = url.pathname; // Extract pathname for navigation
            urlPath = url.pathname;
            console.log(`Navigation item ${item.label}: URL=${item.url}, PathName=${url.pathname}`);
          } catch (error) {
            console.warn(`Invalid URL for ${item.label}:`, item.url);
            navigateTo = item.path || '/';
            urlPath = item.path || '/';
          }
        } else {
          navigateTo = item.path || '/';
          urlPath = item.path || '/';
          console.log(`Navigation item ${item.label}: Path=${item.path}`);
        }
        
        // Check if current path matches navigation item
        const isActive = location.pathname === urlPath || 
                        location.pathname.startsWith(urlPath + '/') ||
                        (urlPath !== '/' && location.pathname.includes(urlPath));
        
        return (
          <Link
            key={item.url || item.path || index}
            to={navigateTo}
            className={`
              group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${isActive
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 border-r-2 border-blue-500'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            <IconComponent
              className={`
                mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200
                ${isActive 
                  ? 'text-blue-500 dark:text-blue-400' 
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                }
              `}
              aria-hidden="true"
            />
            <span className="truncate">{item.label}</span>
            
            {/* Debug info - shows in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="ml-auto text-xs text-gray-400 flex flex-col items-end">
                <span>{item.url ? 'URL' : 'Path'}</span>
                <span className="max-w-20 truncate" title={navigateTo}>
                  {navigateTo}
                </span>
              </div>
            )}
          </Link>
        );
      })}
      
      {/* Debug panel showing all navigation data */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
          <details>
            <summary className="cursor-pointer font-medium">Debug: Navigation Data</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-40">
              {JSON.stringify(navigation, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </nav>
  );
};

export default DynamicNavigation;
