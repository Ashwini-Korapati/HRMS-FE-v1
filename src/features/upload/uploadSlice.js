import { createSlice } from '@reduxjs/toolkit'

const initialState = { uploads: [], isLoading: false, error: null }
const slice = createSlice({ name: 'upload', initialState, reducers: { clearError: (state) => { state.error = null } } })
export const { clearError } = slice.actions
export default slice.reducer
