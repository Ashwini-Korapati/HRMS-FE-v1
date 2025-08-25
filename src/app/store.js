import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

// Import all slice reducers
import  authReducer  from '@/features/auth/authSlice'
import tenantReducer from '@/features/tenant/tenantSlice'
import uiReducer from '@/features/ui/uiSlice'
import plansReducer from '@/features/plans/plansSlice'
import subscriptionsReducer from '@/features/subscriptions/subscriptionsSlice'
import companiesReducer from '@/features/companies/companiesSlice'
import usersReducer from '@/features/users/usersSlice'
import departmentsReducer from '@/features/departments/departmentsSlice'
import designationsReducer from '@/features/designations/designationsSlice'
import leavesReducer from '@/features/leaves/leavesSlice'
import attendanceReducer from '@/features/attendance/attendanceSlice'
import payrollReducer from '@/features/payroll/payrollSlice'
import projectsReducer from '@/features/projects/projectsSlice'
import tasksReducer from '@/features/tasks/tasksSlice'
import holidaysReducer from '@/features/holidays/holidaysSlice'
import announcementsReducer from '@/features/announcements/announcementsSlice'
import notificationsReducer from '@/features/notifications/notificationsSlice'
import dashboardReducer from '@/features/dashboard/dashboardSlice'
import analyticsReducer from '@/features/analytics/analyticsSlice'
import profileReducer from '@/features/profile/profileSlice'
import uploadReducer from '@/features/upload/uploadSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  tenant: tenantReducer,
  ui: uiReducer,
  plans: plansReducer,
  subscriptions: subscriptionsReducer,
  companies: companiesReducer,
  users: usersReducer,
  departments: departmentsReducer,
  designations: designationsReducer,
  leaves: leavesReducer,
  attendance: attendanceReducer,
  payroll: payrollReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
  holidays: holidaysReducer,
  announcements: announcementsReducer,
  notifications: notificationsReducer,
  dashboard: dashboardReducer,
  analytics: analyticsReducer,
  profile: profileReducer,
  upload: uploadReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
})

export default store
