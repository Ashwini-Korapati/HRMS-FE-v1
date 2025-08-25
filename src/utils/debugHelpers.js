// Debug helpers for development
import { updateNavigationData, setUser } from '@/features/auth/authSlice';

// Simulate the token response navigation data for testing
export const simulateTokenResponse = (dispatch) => {
  const mockNavigationData = {
    dashboard_url: "http://localhost:3000/testco/dashboard",
    navigation: [
      {
        "label": "Dashboard",
        "path": "/overview",
        "icon": "LayoutDashboard",
        "url": "http://localhost:3000/testco/overview"
      },
      {
        "label": "Employees",
        "path": "/users",
        "icon": "Users",
        "url": "http://localhost:3000/testco/users"
      },
      {
        "label": "Departments",
        "path": "/departments",
        "icon": "Building2",
        "url": "http://localhost:3000/testco/departments"
      },
      {
        "label": "Designations",
        "path": "/designations",
        "icon": "Briefcase",
        "url": "http://localhost:3000/testco/designations"
      },
      {
        "label": "Leaves",
        "path": "/leaves",
        "icon": "Calendar",
        "url": "http://localhost:3000/testco/leaves"
      },
      {
        "label": "Attendance",
        "path": "/attendance",
        "icon": "Clock",
        "url": "http://localhost:3000/testco/attendance"
      },
      {
        "label": "Payroll",
        "path": "/payroll",
        "icon": "DollarSign",
        "url": "http://localhost:3000/testco/payroll"
      },
      {
        "label": "Projects",
        "path": "/projects",
        "icon": "FolderOpen",
        "url": "http://localhost:3000/testco/projects"
      },
      {
        "label": "Tasks",
        "path": "/tasks",
        "icon": "CheckSquare",
        "url": "http://localhost:3000/testco/tasks"
      },
      {
        "label": "Holidays",
        "path": "/holidays",
        "icon": "CalendarDays",
        "url": "http://localhost:3000/testco/holidays"
      },
      {
        "label": "Announcements",
        "path": "/announcements",
        "icon": "Megaphone",
        "url": "http://localhost:3000/testco/announcements"
      },
      {
        "label": "Reports",
        "path": "/reports",
        "icon": "FileText",
        "url": "http://localhost:3000/testco/reports"
      },
      {
        "label": "Analytics",
        "path": "/analytics",
        "icon": "BarChart3",
        "url": "http://localhost:3000/testco/analytics"
      }
    ],
    routes: {
      "available": {
        "dashboard": "http://localhost:3000/testco/dashboard",
        "auth": {
          "login": "http://localhost:3000/login",
          "logout": "http://localhost:3000/logout",
          "callback": "http://localhost:3000/auth/callback"
        },
        "admin": {
          "overview": "http://localhost:3000/testco/overview",
          "users": "http://localhost:3000/testco/users",
          "departments": "http://localhost:3000/testco/departments",
          "designations": "http://localhost:3000/testco/designations",
          "leaves": "http://localhost:3000/testco/leaves",
          "attendance": "http://localhost:3000/testco/attendance",
          "payroll": "http://localhost:3000/testco/payroll",
          "projects": "http://localhost:3000/testco/projects",
          "tasks": "http://localhost:3000/testco/tasks",
          "holidays": "http://localhost:3000/testco/holidays",
          "announcements": "http://localhost:3000/testco/announcements",
          "reports": "http://localhost:3000/testco/reports",
          "analytics": "http://localhost:3000/testco/analytics"
        }
      }
    }
  };

  dispatch(updateNavigationData(mockNavigationData));
  
  // Also simulate user data
  const mockUser = {
    "id": "014da4ad-6707-4d9e-be1d-4c5df0899f08",
    "email": "admin@testco.com",
    "role": "ADMIN",
    "name": "Admin User",
    "firstName": "Admin",
    "lastName": "User",
    "company": {
      "id": "f16dfa3b-1358-4f0a-91fa-5b3f2ff1d561",
      "name": "Test Company Inc.",
      "subdomain": "testco"
    },
    "permissions": [
      "company.manage",
      "users.manage",
      "departments.manage",
      "designations.manage",
      "leaves.manage",
      "attendance.manage",
      "payroll.manage",
      "projects.manage",
      "tasks.manage",
      "holidays.manage",
      "announcements.manage",
      "reports.view",
      "analytics.view"
    ],
    "preferences": {
      "theme": "light",
      "language": "en"
    }
  };
  
  dispatch(setUser(mockUser));
  
  console.log('Mock navigation data loaded:', mockNavigationData);
  console.log('Mock user data loaded:', mockUser);
  return { navigation: mockNavigationData, user: mockUser };
};

// Helper to log current auth state
export const logAuthState = (authState) => {
  console.log('=== Current Auth State ===');
  console.log('isAuthenticated:', authState.isAuthenticated);
  console.log('user:', authState.user);
  console.log('role:', authState.role);
  console.log('navigation:', authState.navigation);
  console.log('dashboardUrl:', authState.dashboardUrl);
  console.log('========================');
};
