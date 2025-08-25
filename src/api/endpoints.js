import api from './http'
import { API_ENDPOINTS } from '@/utils/constants'

// Helper function to create company-scoped URLs
export const withCompany = (url, companyId) => {
  return `/api/${companyId}${url}`
}

// Generic HTTP methods
export const httpClient = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  del: (url, config = {}) => api.delete(url, config)
}

// Public API endpoints
export const publicApi = {
  // Health check
  health: () => httpClient.get(API_ENDPOINTS.HEALTH),
  info: () => httpClient.get(API_ENDPOINTS.INFO),
  
  // Payment subscription plans
  getPaymentPlans: (params = {}) => httpClient.get('/api/payments/plans', { params }),
  initiatePayment: (data) => httpClient.post('/api/payments/initiate', data),
  verifyPaymentOtp: (data) => httpClient.post('/api/payments/verify-otp', data),
  resendPaymentOtp: (data) => httpClient.post('/api/payments/resend-otp', data),
  
  // Legacy trial registration (keeping for backward compatibility)
  registerTrial: (data) => httpClient.post('/api/auth/register-trial', data),
  verifyTrialOtp: (data) => httpClient.post('/api/auth/verify-trial-otp', data),
  resendTrialOtp: (data) => httpClient.post('/api/auth/resend-trial-otp', data),
  
  // UAS endpoints
  resolveCompany: (params) => httpClient.get(API_ENDPOINTS.UAS_RESOLVE_COMPANY, { params }),
  getCompaniesByEmail: (email) => httpClient.get(API_ENDPOINTS.UAS_COMPANIES, { params: { email } }),
  validateSubdomain: (subdomain) => httpClient.get(`${API_ENDPOINTS.UAS_VALIDATE_SUBDOMAIN}/${subdomain}`),
  authChallenge: (params) => httpClient.get(API_ENDPOINTS.UAS_AUTH_CHALLENGE, { params }),
  login: (data) => httpClient.post(API_ENDPOINTS.UAS_AUTH_LOGIN, data),
  exchangeToken: (data) => httpClient.post(API_ENDPOINTS.UAS_AUTH_TOKEN, data),
  logout: (data) => httpClient.post(API_ENDPOINTS.UAS_AUTH_LOGOUT, data),
  uasHealth: () => httpClient.get(API_ENDPOINTS.UAS_HEALTH)
}

// Authenticated API endpoints
export const authenticatedApi = {
  // User info
  getUserInfo: () => httpClient.get(API_ENDPOINTS.UAS_AUTH_USERINFO),
  
  // Profile
  getProfile: () => httpClient.get(API_ENDPOINTS.PROFILE),
  updateProfile: (data) => httpClient.put(API_ENDPOINTS.PROFILE, data),
  
  // Global resources
  getCompanies: (params) => httpClient.get(API_ENDPOINTS.COMPANIES, { params }),
  getCompany: (id) => httpClient.get(`${API_ENDPOINTS.COMPANIES}/${id}`),
  updateCompany: (id, data) => httpClient.put(`${API_ENDPOINTS.COMPANIES}/${id}`, data),
  
  getSubscriptions: (params) => httpClient.get(API_ENDPOINTS.SUBSCRIPTIONS, { params }),
  getSubscription: (id) => httpClient.get(`${API_ENDPOINTS.SUBSCRIPTIONS}/${id}`),
  updateSubscription: (id, data) => httpClient.put(`${API_ENDPOINTS.SUBSCRIPTIONS}/${id}`, data),
  
  // System admin
  getSystemAdminData: () => httpClient.get(API_ENDPOINTS.SYSTEM_ADMIN),
  getPlatformData: () => httpClient.get(API_ENDPOINTS.PLATFORM),
  getAdminDashboard: () => httpClient.get(API_ENDPOINTS.ADMIN_DASHBOARD),
  
  // Cache management
  getCacheStatus: () => httpClient.get(API_ENDPOINTS.CACHE),
  clearCache: (key) => httpClient.del(`${API_ENDPOINTS.CACHE}/${key}`)
}

// Company-scoped API endpoints
export const companyApi = {
  // Users
  getUsers: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.USERS, companyId), { params }),
  getUser: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.USERS}/${id}`, companyId)),
  createUser: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.USERS, companyId), data),
  updateUser: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.USERS}/${id}`, companyId), data),
  deleteUser: (companyId, id) => httpClient.del(withCompany(`${API_ENDPOINTS.USERS}/${id}`, companyId)),
  
  // Departments
  getDepartments: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.DEPARTMENTS, companyId), { params }),
  getDepartment: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, companyId)),
  createDepartment: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.DEPARTMENTS, companyId), data),
  updateDepartment: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, companyId), data),
  deleteDepartment: (companyId, id) => httpClient.del(withCompany(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, companyId)),
  
  // Designations
  getDesignations: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.DESIGNATIONS, companyId), { params }),
  getDesignation: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.DESIGNATIONS}/${id}`, companyId)),
  createDesignation: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.DESIGNATIONS, companyId), data),
  updateDesignation: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.DESIGNATIONS}/${id}`, companyId), data),
  deleteDesignation: (companyId, id) => httpClient.del(withCompany(`${API_ENDPOINTS.DESIGNATIONS}/${id}`, companyId)),
  
  // Leaves
  getLeaves: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.LEAVES, companyId), { params }),
  getLeave: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.LEAVES}/${id}`, companyId)),
  createLeave: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.LEAVES, companyId), data),
  updateLeave: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.LEAVES}/${id}`, companyId), data),
  deleteLeave: (companyId, id) => httpClient.del(withCompany(`${API_ENDPOINTS.LEAVES}/${id}`, companyId)),
  approveLeave: (companyId, id, data) => httpClient.patch(withCompany(`${API_ENDPOINTS.LEAVES}/${id}/approve`, companyId), data),
  rejectLeave: (companyId, id, data) => httpClient.patch(withCompany(`${API_ENDPOINTS.LEAVES}/${id}/reject`, companyId), data),
  
  // Attendance
  getAttendance: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.ATTENDANCE, companyId), { params }),
  getAttendanceRecord: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.ATTENDANCE}/${id}`, companyId)),
  createAttendance: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.ATTENDANCE, companyId), data),
  updateAttendance: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.ATTENDANCE}/${id}`, companyId), data),
  clockIn: (companyId, data) => httpClient.post(withCompany(`${API_ENDPOINTS.ATTENDANCE}/clock-in`, companyId), data),
  clockOut: (companyId, data) => httpClient.post(withCompany(`${API_ENDPOINTS.ATTENDANCE}/clock-out`, companyId), data),
  
  // Payroll
  getPayroll: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.PAYROLL, companyId), { params }),
  getPayrollRecord: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.PAYROLL}/${id}`, companyId)),
  createPayroll: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.PAYROLL, companyId), data),
  updatePayroll: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.PAYROLL}/${id}`, companyId), data),
  approvePayroll: (companyId, id) => httpClient.patch(withCompany(`${API_ENDPOINTS.PAYROLL}/${id}/approve`, companyId)),
  processPayroll: (companyId, id) => httpClient.patch(withCompany(`${API_ENDPOINTS.PAYROLL}/${id}/process`, companyId)),
  
  // Projects
  getProjects: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.PROJECTS, companyId), { params }),
  getProject: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.PROJECTS}/${id}`, companyId)),
  createProject: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.PROJECTS, companyId), data),
  updateProject: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.PROJECTS}/${id}`, companyId), data),
  deleteProject: (companyId, id) => httpClient.del(withCompany(`${API_ENDPOINTS.PROJECTS}/${id}`, companyId)),
  
  // Tasks
  getTasks: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.TASKS, companyId), { params }),
  getTask: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.TASKS}/${id}`, companyId)),
  createTask: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.TASKS, companyId), data),
  updateTask: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.TASKS}/${id}`, companyId), data),
  deleteTask: (companyId, id) => httpClient.del(withCompany(`${API_ENDPOINTS.TASKS}/${id}`, companyId)),
  
  // Holidays
  getHolidays: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.HOLIDAYS, companyId), { params }),
  getHoliday: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.HOLIDAYS}/${id}`, companyId)),
  createHoliday: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.HOLIDAYS, companyId), data),
  updateHoliday: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.HOLIDAYS}/${id}`, companyId), data),
  deleteHoliday: (companyId, id) => httpClient.del(withCompany(`${API_ENDPOINTS.HOLIDAYS}/${id}`, companyId)),
  
  // Announcements
  getAnnouncements: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.ANNOUNCEMENTS, companyId), { params }),
  getAnnouncement: (companyId, id) => httpClient.get(withCompany(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`, companyId)),
  createAnnouncement: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.ANNOUNCEMENTS, companyId), data),
  updateAnnouncement: (companyId, id, data) => httpClient.put(withCompany(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`, companyId), data),
  deleteAnnouncement: (companyId, id) => httpClient.del(withCompany(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`, companyId)),
  
  // Notifications
  getNotifications: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.NOTIFICATIONS, companyId), { params }),
  markNotificationAsRead: (companyId, id) => httpClient.patch(withCompany(`${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`, companyId)),
  markAllNotificationsAsRead: (companyId) => httpClient.patch(withCompany(`${API_ENDPOINTS.NOTIFICATIONS}/read-all`, companyId)),
  
  // Dashboard
  getDashboardData: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.DASHBOARD, companyId), { params }),
  
  // Reports
  getReports: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.REPORTS, companyId), { params }),
  generateReport: (companyId, data) => httpClient.post(withCompany(API_ENDPOINTS.REPORTS, companyId), data),
  
  // Analytics
  getAnalytics: (companyId, params) => httpClient.get(withCompany(API_ENDPOINTS.ANALYTICS, companyId), { params })
}

// File upload endpoints
export const uploadApi = {
  uploadFile: (file, folder = 'general', onProgress = null) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    
    return httpClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      }
    })
  },
  
  uploadAvatar: (file, onProgress = null) => {
    return uploadApi.uploadFile(file, 'avatars', onProgress)
  },
  
  uploadDocument: (file, onProgress = null) => {
    return uploadApi.uploadFile(file, 'documents', onProgress)
  }
}
