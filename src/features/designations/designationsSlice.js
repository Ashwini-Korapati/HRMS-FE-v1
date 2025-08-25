import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  isLoading: false,
  error: null
}

const designationsSlice = createSlice({
  name: 'designations',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null }
  }
})

export const { clearError } = designationsSlice.actions
export default designationsSlice.reducer
