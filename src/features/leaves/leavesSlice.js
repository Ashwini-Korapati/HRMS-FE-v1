import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  isLoading: false,
  error: null
}

const leavesSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null }
  }
})

export const { clearError } = leavesSlice.actions
export default leavesSlice.reducer
