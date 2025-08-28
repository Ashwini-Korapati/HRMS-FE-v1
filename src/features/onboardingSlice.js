// onboardingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyApi } from '../api/endpoints'

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
  async ({ companyId, employeeData }, { rejectWithValue }) => {
    try {
      const response = await companyApi.createUser(companyId, employeeData);
      return response.data;
    } catch (error) {
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
} = onboardingSlice.actions;

export default onboardingSlice.reducer;