import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // convert to seconds
      return decoded.exp < currentTime;
    } catch (err) {
      return true; // Treat errors as expired or malformed
    }
  };

  if (!token || isTokenExpired(token)) {
    alert('Session expired or not logged in. Please login again.');
    localStorage.removeItem('token'); // Clear invalid token
    return <Navigate to="/login" replace />;
  }

  return children;
}
