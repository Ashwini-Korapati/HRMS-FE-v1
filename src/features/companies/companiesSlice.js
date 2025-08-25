import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authenticatedApi } from '@/api/endpoints'

// Async thunks
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (params, { rejectWithValue }) => {
    try {
      const response = await authenticatedApi.getCompanies(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// Initial state
const initialState = {
  items: [],
  isLoading: false,
  error: null
}

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = companiesSlice.actions
export default companiesSlice.reducer
