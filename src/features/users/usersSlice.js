import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { companyApi } from '@/api/endpoints'

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ companyId, params }, { rejectWithValue }) => {
    try {
      const response = await companyApi.getUsers(companyId, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createUser = createAsyncThunk(
  'users/createUser',
  async ({ companyId, data }, { rejectWithValue }) => {
    try {
      const response = await companyApi.createUser(companyId, data)
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

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  }
})

export const { clearError } = usersSlice.actions
export default usersSlice.reducer
