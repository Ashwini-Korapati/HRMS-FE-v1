

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API function with access token
const createEmployeeAPI = (companyId, employeeData, token) => 
  axios.post(`http://localhost:5000/api/${companyId}/users`, employeeData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });


// Helper function to get company ID and access token from the state
const getAuthInfoFromState = (state) => {
  const user = state.auth.user;
  const accessToken = state.auth.accessToken;
  console.log(accessToken)
  console.log('Auth state:', { 
    user: state.auth.user, 
    accessToken: state.auth.accessToken
  });
  
  // Try different possible properties for company ID
  let companyId = null;
  
  if (user) {
    // Try different possible property names for company ID
    companyId = user.company_id || user.companyId || user.companyID || user.company?.id;
    
    console.log('Extracted company ID:', companyId);
  }
  
  if (!companyId) {
    throw new Error('Company ID could not be determined from user information.');
  }
  
  if (!accessToken) {
    throw new Error('Access token is missing from auth state.');
  }
  
  return { 
    companyId, 
    accessToken 
  };
};

const initialState = {
  currentStep: 0,
  formData: {},
  errors: {},
  isTransitioning: false,
  loading: false,
  success: false,
  error: null,
};

// Async thunk for creating employee
export const createEmployee = createAsyncThunk(
  'onboarding/createEmployee',
  async (employeeData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { companyId, accessToken } = getAuthInfoFromState(state);
      
      console.log('Creating employee for company:', companyId);
      console.log('Using access token:', accessToken ? 'Token present' : 'No token');
      
      const response = await createEmployeeAPI(companyId, employeeData, accessToken);
      return response.data;
    } catch (error) {
      console.error('Create employee error:', error);
      if (error.response?.status === 401) {
        // Token is invalid or expired
        return rejectWithValue({
          message: 'Your session has expired. Please log in again.',
          errorCode: 'AUTHENTICATION_ERROR'
        });
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    setIsTransitioning: (state, action) => {
      state.isTransitioning = action.payload;
    },
    clearError: (state, action) => {
      const { key } = action.payload;
      if (state.errors[key]) {
        const newErrors = { ...state.errors };
        delete newErrors[key];
        state.errors = newErrors;
      }
    },
    resetOnboarding: () => initialState,
    clearSuccess: (state) => {
      state.success = false;
    },
    clearAuthError: (state) => {
      if (state.error?.errorCode === 'AUTHENTICATION_ERROR') {
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.formData = {};
        state.currentStep = 0;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        
        // Handle validation errors from backend
        if (action.payload?.errors) {
          state.errors = action.payload.errors;
        }
      });
  },
});

export const {
  setCurrentStep,
  updateFormData,
  setErrors,
  setIsTransitioning,
  clearError,
  resetOnboarding,
  clearSuccess,
  clearAuthError,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;