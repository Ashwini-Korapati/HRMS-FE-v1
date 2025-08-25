import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserInfo, selectIsAuthenticated, selectAccessToken } from '@/features/auth/authSlice'

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const accessToken = useSelector(selectAccessToken)

  useEffect(() => {
    // If we have a token but no user info, fetch user info
    if (accessToken && !isAuthenticated) {
      dispatch(fetchUserInfo())
    }
  }, [dispatch, accessToken, isAuthenticated])

  return children
}

export default AuthProvider
