import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyApi } from '@/api/endpoints';

// Helper function to get company ID from user info
const getCompanyIdFromState = (state) => {
  const user = state.auth.user;
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Check both company_id and companyId for compatibility
  const companyId = user.company_id || user.companyId;
  if (!companyId) {
    throw new Error('Company ID not found in user info');
  }
  
  return companyId;
};

// Async thunks - Updated to use user info from auth state
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const companyId = getCompanyIdFromState(state);

      const response = await companyApi.getDepartments(companyId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const companyId = getCompanyIdFromState(state);

      const response = await companyApi.createDepartment(companyId, departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async ({ id, ...departmentData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const companyId = getCompanyIdFromState(state);

      const response = await companyApi.updateDepartment(companyId, id, departmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async (departmentId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const companyId = getCompanyIdFromState(state);

      await companyApi.deleteDepartment(companyId, departmentId);
      return departmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  departments: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  success: null
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
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
        state.departments = action.payload.data || [];
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create department
      .addCase(createDepartment.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.creating = false;
        state.departments.push(action.payload.data);
        state.success = 'Department created successfully';
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      
      // Update department
      .addCase(updateDepartment.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.departments.findIndex(dept => dept.id === action.payload.data.id);
        if (index !== -1) {
          state.departments[index] = action.payload.data;
        }
        state.success = 'Department updated successfully';
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      
      // Delete department
      .addCase(deleteDepartment.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.deleting = false;
        state.departments = state.departments.filter(dept => dept.id !== action.payload);
        state.success = 'Department deleted successfully';
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, resetDepartments } = departmentsSlice.actions;

// Selectors
export const selectDepartments = (state) => state.departments.departments;
export const selectDepartmentsLoading = (state) => state.departments.loading;
export const selectDepartmentsCreating = (state) => state.departments.creating;
export const selectDepartmentsUpdating = (state) => state.departments.updating;
export const selectDepartmentsDeleting = (state) => state.departments.deleting;
export const selectDepartmentsError = (state) => state.departments.error;
export const selectDepartmentsSuccess = (state) => state.departments.success;

export default departmentsSlice.reducer;