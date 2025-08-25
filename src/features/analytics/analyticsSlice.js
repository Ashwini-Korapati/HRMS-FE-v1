import { createSlice } from '@reduxjs/toolkit'

const initialState = { charts: [], isLoading: false, error: null }
const slice = createSlice({ name: 'analytics', initialState, reducers: { clearError: (state) => { state.error = null } } })
export const { clearError } = slice.actions
export default slice.reducer
