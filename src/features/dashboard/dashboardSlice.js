import { createSlice } from '@reduxjs/toolkit'

const initialState = { widgets: [], isLoading: false, error: null }
const slice = createSlice({ name: 'dashboard', initialState, reducers: { clearError: (state) => { state.error = null } } })
export const { clearError } = slice.actions
export default slice.reducer
