import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  isLoading: false,
  error: null
}

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null }
  }
})

export const { clearError } = departmentsSlice.actions
export default departmentsSlice.reducer
