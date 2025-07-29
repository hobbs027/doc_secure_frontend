import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function RoleProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuthContext();

  if (!allowedRoles.includes(user.role)) {
    toast.warn(`Access denied: role '${user.role}' not allowed`, {
      toastId: 'access-denied', // 👈 prevents duplicate toasts
    });

    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
