import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API functions with access token
const getDesignationsAPI = (companyId, token) => 
  axios.get(`http://localhost:5000/api/${companyId}/designations`, {
    headers: { Authorization: `Bearer ${token}` }
  });

const createDesignationAPI = (companyId, designationData, token) => 
  axios.post(`http://localhost:5000/api/${companyId}/designations`, designationData, {
    headers: { Authorization: `Bearer ${token}` }
  });

const updateDesignationAPI = (companyId, id, designationData, token) => 
  axios.put(`http://localhost:5000/api/${companyId}/designations/${id}`, designationData, {
    headers: { Authorization: `Bearer ${token}` }
  });

const deleteDesignationAPI = (companyId, id, token) => 
  axios.delete(`http://localhost:5000/api/${companyId}/designations/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Helper function to get company ID and access token from the state
const getAuthInfoFromState = (state) => {
  const user = state.auth.user;
  const accessToken = state.auth.accessToken;
  
  // Debug logging to help identify the issue
  console.log('Auth state:', { 
    user: state.auth.user, 
    accessToken: state.auth.accessToken
  });
  
  // Check if we have a user object and extract company ID
  let companyId = null;
  
  if (user) {
    // Try different possible properties for company ID
    companyId = user.company_id || user.companyId || user.companyID || user.company?.id;
    
    console.log('Extracted company ID:', companyId);
  }
  
  if (!companyId) {
    // If no company ID found in user object, check if it's stored elsewhere
    // or use a default/fallback value if appropriate for your app
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
  designations: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  success: false,
};

// Async thunks
export const fetchDesignations = createAsyncThunk(
  'designations/fetchDesignations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { companyId, accessToken } = getAuthInfoFromState(state);
      console.log('Fetching designations for company:', companyId);
      
      const response = await getDesignationsAPI(companyId, accessToken);
      return response.data.data;
    } catch (error) {
      console.error('Fetch designations error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createDesignation = createAsyncThunk(
  'designations/createDesignation',
  async (designationData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { companyId, accessToken } = getAuthInfoFromState(state);
      console.log('Creating designation for company:', companyId, 'with data:', designationData);
      
      const response = await createDesignationAPI(companyId, designationData, accessToken);
      return response.data.data;
    } catch (error) {
      console.error('Create designation error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateDesignation = createAsyncThunk(
  'designations/updateDesignation',
  async ({ id, designationData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { companyId, accessToken } = getAuthInfoFromState(state);
      const response = await updateDesignationAPI(companyId, id, designationData, accessToken);
      return response.data.data;
    } catch (error) {
      console.error('Update designation error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteDesignation = createAsyncThunk(
  'designations/deleteDesignation',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { companyId, accessToken } = getAuthInfoFromState(state);
      await deleteDesignationAPI(companyId, id, accessToken);
      return id;
    } catch (error) {
      console.error('Delete designation error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const designationsSlice = createSlice({
  name: 'designations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Designations
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = action.payload;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Designation
      .addCase(createDesignation.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDesignation.fulfilled, (state, action) => {
        state.creating = false;
        state.success = true;
        state.designations.push(action.payload);
      })
      .addCase(createDesignation.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      // Update Designation
      .addCase(updateDesignation.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.updating = false;
        state.success = true;
        const index = state.designations.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.designations[index] = action.payload;
        }
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Delete Designation
      .addCase(deleteDesignation.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.deleting = false;
        state.designations = state.designations.filter(d => d.id !== action.payload);
      })
      .addCase(deleteDesignation.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = designationsSlice.actions;

export const selectDesignations = (state) => state.designations.designations;
export const selectDesignationsLoading = (state) => state.designations.loading;
export const selectDesignationsCreating = (state) => state.designations.creating;
export const selectDesignationsUpdating = (state) => state.designations.updating;
export const selectDesignationsDeleting = (state) => state.designations.deleting;
export const selectDesignationsError = (state) => state.designations.error;
export const selectDesignationsSuccess = (state) => state.designations.success;

export default designationsSlice.reducer;