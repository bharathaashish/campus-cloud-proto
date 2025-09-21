import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export default function RequireAuth({ children, adminOnly = false }) {
  const { isLoggedIn, user } = useAppContext()
  const loc = useLocation()

  if (!isLoggedIn) {
    // redirect to login
    return <Navigate to="/login" state={{ from: loc }} replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <div>Access denied: admin only</div>
  }

  return children
}
