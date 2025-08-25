// User roles constants
export const ROLES = {
  IT: 'IT',
  SUPER_ADMIN: 'SUPER_ADMIN', 
  ADMIN: 'ADMIN',
  USER: 'USER'
}

// API endpoints
export const API_ENDPOINTS = {
  // Public endpoints
  HEALTH: '/api/health',
  INFO: '/api/info',
  PLANS: '/api/subscriptions/plans',
  SUBSCRIPTIONS: '/api/subscriptions',
  
  // UAS endpoints
  UAS_RESOLVE_COMPANY: '/api/uas/resolve-company',
  UAS_COMPANIES: '/api/uas/companies',
  UAS_VALIDATE_SUBDOMAIN: '/api/uas/validate-subdomain',
  UAS_AUTH_CHALLENGE: '/api/uas/auth/challenge',
  UAS_AUTH_LOGIN: '/api/uas/auth/login',
  UAS_AUTH_TOKEN: '/api/uas/auth/token',
  UAS_AUTH_USERINFO: '/api/uas/auth/userinfo',
  UAS_AUTH_LOGOUT: '/api/uas/auth/logout',
  UAS_HEALTH: '/api/uas/health',
  
  // OIDC endpoints
  OIDC_CONFIG: '/.well-known/openid_configuration',
  OIDC_JWKS: '/.well-known/jwks',
  
  // Authenticated global endpoints
  COMPANIES: '/api/companies',
  PROFILE: '/api/profile',
  SYSTEM_ADMIN: '/api/system-admin',
  PLATFORM: '/api/platform',
  ADMIN_DASHBOARD: '/api/admin-dashboard',
  CACHE: '/api/cache',
  
  // Company-scoped endpoints (use with withCompany helper)
  USERS: '/users',
  DEPARTMENTS: '/departments',
  DESIGNATIONS: '/designations',
  LEAVES: '/leaves',
  ATTENDANCE: '/attendance',
  PAYROLL: '/payroll',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  HOLIDAYS: '/holidays',
  ANNOUNCEMENTS: '/announcements',
  NOTIFICATIONS: '/notifications',
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  ANALYTICS: '/analytics'
}

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'hr_access_token',
  REFRESH_TOKEN: 'hr_refresh_token',
  USER_INFO: 'hr_user_info',
  TENANT_INFO: 'hr_tenant_info',
  DASHBOARD_URL: 'hr_dashboard_url',
  NAVIGATION_DATA: 'hr_navigation_data',
  ROUTES_DATA: 'hr_routes_data'
}

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Leave statuses
export const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
}

// Attendance statuses
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  HALF_DAY: 'HALF_DAY',
  ON_LEAVE: 'ON_LEAVE'
}

// Project statuses
export const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
}

// Task statuses
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
}

// Subscription statuses
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  TRIAL: 'TRIAL',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  SUSPENDED: 'SUSPENDED'
}

// Payroll statuses
export const PAYROLL_STATUS = {
  DRAFT: 'DRAFT',
  PROCESSING: 'PROCESSING',
  APPROVED: 'APPROVED',
  PAID: 'PAID',
  REJECTED: 'REJECTED'
}

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
}

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  FULL: 'MMM dd, yyyy hh:mm a',
  TIME: 'hh:mm a'
}

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  }
}

// Theme modes removed; app is light-only

// Navigation items by role
export const NAVIGATION = {
  [ROLES.IT]: [
    { label: 'System Admin', path: '/system-admin', icon: 'Settings' },
    { label: 'Platform', path: '/platform', icon: 'Server' },
    { label: 'Companies', path: '/companies', icon: 'Building' },
    { label: 'Subscriptions', path: '/subscriptions', icon: 'CreditCard' }
  ],
  [ROLES.SUPER_ADMIN]: [
    { label: 'System Admin', path: '/system-admin', icon: 'Settings' },
    { label: 'Platform', path: '/platform', icon: 'Server' },
    { label: 'Companies', path: '/companies', icon: 'Building' },
    { label: 'Subscriptions', path: '/subscriptions', icon: 'CreditCard' }
  ],
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/overview', icon: 'LayoutDashboard' },
    { label: 'Employees', path: '/users', icon: 'Users' },
    { label: 'Departments', path: '/departments', icon: 'Building2' },
    { label: 'Designations', path: '/designations', icon: 'Briefcase' },
    { label: 'Leaves', path: '/leaves', icon: 'Calendar' },
    { label: 'Attendance', path: '/attendance', icon: 'Clock' },
    { label: 'Payroll', path: '/payroll', icon: 'DollarSign' },
    { label: 'Projects', path: '/projects', icon: 'FolderOpen' },
    { label: 'Tasks', path: '/tasks', icon: 'CheckSquare' },
    { label: 'Holidays', path: '/holidays', icon: 'CalendarDays' },
    { label: 'Announcements', path: '/announcements', icon: 'Megaphone' },
    { label: 'Reports', path: '/reports', icon: 'FileText' },
    { label: 'Analytics', path: '/analytics', icon: 'BarChart3' }
  ],
  [ROLES.USER]: [
    { label: 'My Dashboard', path: '/overview', icon: 'LayoutDashboard' },
    { label: 'My Profile', path: '/profile', icon: 'User' },
    { label: 'My Team', path: '/team', icon: 'Users' },
    { label: 'My Leaves', path: '/leaves', icon: 'Calendar' },
    { label: 'My Attendance', path: '/attendance', icon: 'Clock' },
    { label: 'My Payroll', path: '/payroll', icon: 'DollarSign' },
    { label: 'My Tasks', path: '/tasks', icon: 'CheckSquare' }
  ]
}
