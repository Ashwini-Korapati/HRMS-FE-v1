import { createSlice } from '@reduxjs/toolkit'

const initialState = { items: [], isLoading: false, error: null }
const slice = createSlice({ name: 'holidays', initialState, reducers: { clearError: (state) => { state.error = null } } })
export const { clearError } = slice.actions
export default slice.reducer
