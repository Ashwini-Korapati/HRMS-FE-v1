import React from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectNavigation, selectUser, selectUserRole } from '@/features/auth/authSlice';

// Import page components
import AdminDashboard from '@/pages/AdminDashboard';

// Import HR page components
import OverviewPage from '@/pages/hr/OverviewPage';
import SmartDashboard from '@/pages/hr/SmartDashboard';
import AnalyticsPage from '@/pages/hr/AnalyticsPage';
import EmployeesPage from '@/pages/hr/EmployeesPage';
import DepartmentsPage from '@/pages/hr/DepartmentsPage';
import DesignationsPage from '@/pages/hr/DesignationsPage';
import LeavesPage from '@/pages/hr/LeavesPage';
import AttendancePage from '@/pages/hr/AttendancePage';
import PayrollPage from '@/pages/hr/PayrollPage';
import ProjectsPage from '@/pages/hr/ProjectsPage';
import TasksPage from '@/pages/hr/TasksPage';
import HolidaysPage from '@/pages/hr/HolidaysPage';
import AnnouncementsPage from '@/pages/hr/AnnouncementsPage';
import ReportsPage from '@/pages/hr/ReportsPage';

import EmployeeOnboardingForm from '@/pages/users/EmployeeOnboardingForm';

// Placeholder components for pages not yet created
const PlaceholderPage = ({ label, path }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {label} Coming Soon
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        This page is under development and will be available soon.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Path: {path}
      </p>
    </div>
  </div>
);

// Component mapping based on navigation labels from backend
const getComponentByLabel = (label, path) => {
  const normalizedLabel = label?.toLowerCase();
  const normalizedPath = path?.toLowerCase();
  
  // Handle specific overview sub-routes for SmartDashboardCards actions -> Placeholder
  if (normalizedPath?.includes('/overview/employees') || normalizedPath?.includes('/overview/users')) {
    return () => <PlaceholderPage label="Employees Overview" path={path} />;
  }
  if (normalizedPath?.includes('/overview/departments')) {
    return () => <PlaceholderPage label="Departments Overview" path={path} />;
  }
  if (normalizedPath?.includes('/overview/attendance')) {
    return () => <PlaceholderPage label="Attendance Overview" path={path} />;
  }
  if (normalizedPath?.includes('/overview/payroll')) {
    return () => <PlaceholderPage label="Payroll Overview" path={path} />;
  }
  if (normalizedPath?.includes('/overview/analytics')) {
    return () => <PlaceholderPage label="Analytics Overview" path={path} />;
  }
  if (normalizedPath?.includes('/overview/plans') || normalizedPath?.includes('/overview/subscriptions')) {
    return () => <PlaceholderPage label="Plans Overview" path={path} />;
  }
  if (normalizedPath?.includes('/overview/payments')) {
    return () => <PlaceholderPage label="Payments Overview" path={path} />;
  }
  
  // Handle Dashboard/Overview - use SmartDashboard for main dashboard
  if (normalizedLabel === 'dashboard' || 
      normalizedLabel === 'overview' || 
      normalizedPath?.includes('/dashboard') || 
      normalizedPath?.includes('/overview')) {
    // If path explicitly includes /dashboard, render SmartDashboard
    if (normalizedPath?.includes('/dashboard') || normalizedLabel === 'dashboard') {
      return SmartDashboard;
    }
    return OverviewPage;
  }
  
  switch (normalizedLabel) {
    case 'employees':
    case 'users':
      return EmployeesPage;
    case 'departments':
      return DepartmentsPage;
    case 'designations':
      return DesignationsPage;
    case 'leaves':
      return LeavesPage;
    case 'attendance':
      return AttendancePage;
    case 'payroll':
      return PayrollPage;
    case 'projects':
      return ProjectsPage;
    case 'tasks':
      return TasksPage;
    case 'holidays':
      return HolidaysPage;
    case 'announcements':
      return AnnouncementsPage;
    case 'reports':
      return ReportsPage;
    case 'analytics':
      return AnalyticsPage;
    case 'plans':
    case 'subscriptions':
      return () => <PlaceholderPage label="Plans" path={path} />;
    case 'payments':
      return () => <PlaceholderPage label="Payments" path={path} />;
    default:
      return () => <PlaceholderPage label={label} path={path} />;
  }
};

const DynamicRoutes = () => {
  const navigation = useSelector(selectNavigation);
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const params = useParams();
  const location = useLocation();

  // Extract company from URL if present
  const company = params.company;
  const currentPath = location.pathname;

  console.log('DynamicRoutes:', { navigation, company, currentPath, params });

  if (!navigation || !Array.isArray(navigation)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading Routes...
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we load your navigation.
          </p>
        </div>
      </div>
    );
  }

  // Function to match current path with navigation items
  const findMatchingNavItem = () => {
    // Check for overview sub-routes first
    if (currentPath.includes('/overview/')) {
      const overviewPath = currentPath.split('/overview/')[1]
      if (overviewPath) {
        // Return null to let the Routes component handle overview sub-routes
        return null
      }
    }

    for (const navItem of navigation) {
      const navUrl = navItem.url ? new URL(navItem.url).pathname : navItem.path;
      
      // Direct path match
      if (navUrl === currentPath) {
        return navItem;
      }
      
      // Company-specific path match (e.g., /testco/dashboard)
      if (company && currentPath === `/${company}${navUrl}`) {
        return navItem;
      }
      
      // Partial match for nested paths (but not overview sub-routes)
      if (currentPath.startsWith(navUrl) && navUrl !== '/' && !currentPath.includes('/overview/')) {
        return navItem;
      }
      
      // Company-specific partial match (but not overview sub-routes)
      if (company && currentPath.startsWith(`/${company}${navUrl}`) && navUrl !== '/' && !currentPath.includes('/overview/')) {
        return navItem;
      }
    }
    return null;
  };

  const matchingNavItem = findMatchingNavItem();

  if (matchingNavItem) {
    const routePath = matchingNavItem.url ? new URL(matchingNavItem.url).pathname : matchingNavItem.path;
    const Component = getComponentByLabel(matchingNavItem.label, routePath);
    console.log('Rendering component for:', matchingNavItem.label, 'at path:', routePath);
    return <Component />;
  }

  // If no exact match found, try to render based on Routes
  return (
    <Routes>
  {/* Direct dashboard routes */}
  <Route path="dashboard" element={<SmartDashboard />} />
  <Route path=":company/dashboard" element={<SmartDashboard />} />
  {/* Legacy/alias route for hr-office -> dashboard */}
  <Route path="hr-office" element={<SmartDashboard />} />
  {/* Overview sub-routes for SmartDashboardCards actions -> Placeholder */}
  <Route path="overview/employees" element={<PlaceholderPage label="Employees Overview" path="/overview/employees" />} />
  <Route path="overview/users" element={<PlaceholderPage label="Employees Overview" path="/overview/users" />} />

  {/* Employee Onboarding Form routes */}
  <Route path="users/employeeform" element={<EmployeeOnboardingForm />} />
  <Route path=":company/users/employeeform" element={<EmployeeOnboardingForm />} />
      
      {navigation.map((navItem, index) => {
        // Get the path from URL or use the path field
        const routePath = navItem.url ? new URL(navItem.url).pathname : navItem.path;
        const Component = getComponentByLabel(navItem.label, routePath);
        
        console.log('Creating route for:', navItem.label, 'path:', routePath);
        
        return (
          <React.Fragment key={navItem.url || navItem.path || index}>
            {/* Direct path route */}
            <Route
              path={routePath === '/' ? '' : routePath}
              element={<Component />}
            />
            {/* Company-specific path route */}
            {company && (
              <Route
                path={`${company}${routePath === '/' ? '' : routePath}`}
                element={<Component />}
              />
            )}
          </React.Fragment>
        );
      })}
      
      {/* Fallback route for any unmatched paths */}
      <Route 
        path="*" 
        element={<PlaceholderPage label="Page Not Found" path={currentPath} />} 
      />
    </Routes>
  );
};

export default DynamicRoutes;
