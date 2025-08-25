import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectRoutes, selectUser, selectCompany } from '@/features/auth/authSlice';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const routes = useSelector(selectRoutes);
  const user = useSelector(selectUser);
  const company = useSelector(selectCompany);

  if (!routes || !routes.breadcrumb || !routes.breadcrumb.patterns) {
    return null;
  }

  const generateBreadcrumbs = () => {
    const breadcrumbs = [];
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Build cumulative paths
    let currentPath = '';
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += '/' + pathSegments[i];
      
      // Check if this path has a breadcrumb pattern
      const breadcrumbInfo = routes.breadcrumb.patterns[currentPath];
      if (breadcrumbInfo) {
        breadcrumbs.push({
          name: breadcrumbInfo.label,
          href: breadcrumbInfo.url || currentPath,
          current: i === pathSegments.length - 1
        });
      }
    }

    // If no breadcrumbs found, create a simple fallback
    if (breadcrumbs.length === 0 && pathSegments.length > 0) {
      // Add company root
      if (pathSegments[0] && routes.breadcrumb.patterns[`/${pathSegments[0]}`]) {
        const companyPattern = routes.breadcrumb.patterns[`/${pathSegments[0]}`];
        breadcrumbs.push({
          name: companyPattern.label,
          href: companyPattern.url || `/${pathSegments[0]}`,
          current: pathSegments.length === 1
        });
      }
      
      // Add current page if not company root
      if (pathSegments.length > 1) {
        const currentSegment = pathSegments[pathSegments.length - 1];
        breadcrumbs.push({
          name: currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1),
          href: location.pathname,
          current: true
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 0) {
    return null;
  }

  return (
    <nav className="flex bg-white border-b border-gray-200 px-6 py-3" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {/* Always show home icon for first item */}
        {breadcrumbs.length > 0 && (
          <li className="flex items-center">
            <HomeIcon className="h-4 w-4 text-gray-500 mr-2" />
            {breadcrumbs[0].current ? (
              <span className="text-sm font-medium text-gray-900">
                {breadcrumbs[0].name}
              </span>
            ) : (
              <Link
                to={breadcrumbs[0].href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {breadcrumbs[0].name}
              </Link>
            )}
          </li>
        )}
        
        {/* Render remaining breadcrumbs with separators */}
        {breadcrumbs.slice(1).map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 mr-4" />
            {breadcrumb.current ? (
              <span className="text-sm font-medium text-gray-900">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                to={breadcrumb.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default DynamicBreadcrumb;
