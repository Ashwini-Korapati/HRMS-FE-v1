import { createSlice } from '@reduxjs/toolkit'

const initialState = { items: [], unreadCount: 0, isLoading: false, error: null }
const slice = createSlice({ name: 'notifications', initialState, reducers: { clearError: (state) => { state.error = null } } })
export const { clearError } = slice.actions
export default slice.reducer
