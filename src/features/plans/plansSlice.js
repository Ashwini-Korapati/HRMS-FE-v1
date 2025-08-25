import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { publicApi } from '@/api/endpoints'

// Async thunks
export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApi.getPlans()
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

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = plansSlice.actions

// Selectors
export const selectPlans = (state) => state.plans.items
export const selectPlansLoading = (state) => state.plans.isLoading
export const selectPlansError = (state) => state.plans.error

export default plansSlice.reducer
