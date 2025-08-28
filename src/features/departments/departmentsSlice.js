// @/features/departments/departmentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyApi } from '../../api/endpoints'

const initialState = {
  departments: [],
  loading: false,
  error: null,
  success: false,
  selectedDepartment: null
};

// Async thunks
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await companyApi.getDepartments(companyId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async ({ companyId, departmentData }, { rejectWithValue }) => {
    try {
      const response = await companyApi.createDepartment(companyId, departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async ({ companyId, departmentId, departmentData }, { rejectWithValue }) => {
    try {
      const response = await companyApi.updateDepartment(companyId, departmentId, departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async ({ companyId, departmentId }, { rejectWithValue }) => {
    try {
      await companyApi.deleteDepartment(companyId, departmentId);
      return departmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    resetDepartments: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch departments
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create department
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.departments.push(action.payload);
        state.error = null;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update department
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.departments.findIndex(dept => dept.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete department
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.departments = state.departments.filter(dept => dept.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearSuccess, 
  setSelectedDepartment, 
  resetDepartments 
} = departmentsSlice.actions;

export const selectDepartments = (state) => state.departments.departments;
export const selectDepartmentsLoading = (state) => state.departments.loading;
export const selectDepartmentsError = (state) => state.departments.error;
export const selectDepartmentsSuccess = (state) => state.departments.success;
export const selectSelectedDepartment = (state) => state.departments.selectedDepartment;

export default departmentsSlice.reducer;