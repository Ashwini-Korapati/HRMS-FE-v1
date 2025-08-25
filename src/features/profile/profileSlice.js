import { createSlice } from '@reduxjs/toolkit'

const initialState = { user: null, isLoading: false, error: null }
const slice = createSlice({ name: 'profile', initialState, reducers: { clearError: (state) => { state.error = null } } })
export const { clearError } = slice.actions
export default slice.reducer
