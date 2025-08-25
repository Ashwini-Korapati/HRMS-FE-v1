import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authenticatedApi } from '@/api/endpoints'

// Async thunks
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (params, { rejectWithValue }) => {
    try {
      const response = await authenticatedApi.getSubscriptions(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authenticatedApi.createSubscription(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// Initial state
const initialState = {
  items: [],
  current: null,
  isLoading: false,
  error: null
}

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  }
})

export const { clearError } = subscriptionsSlice.actions
export default subscriptionsSlice.reducer
