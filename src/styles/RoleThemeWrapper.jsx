import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import RoleBanner from '../components/RoleBanner';

export default function RoleThemeWrapper({ children }) {
  const { user } = useAuthContext();

  const getRoleStyles = (role) => {
    switch (role) {
      case 'admin':
        return {
          backgroundColor: '#fff4f4',
          color: '#8b0000',
          fontFamily: 'Segoe UI, sans-serif',
          borderLeft: '8px solid #8b0000',
        };
      case 'reviewer':
        return {
          backgroundColor: '#f4faff',
          color: '#004d80',
          fontFamily: 'Segoe UI, sans-serif',
          borderLeft: '8px solid #004d80',
        };
      case 'uploader':
        return {
          backgroundColor: '#f4fff4',
          color: '#2e6b00',
          fontFamily: 'Segoe UI, sans-serif',
          borderLeft: '8px solid #2e6b00',
        };
      default:
        return {
          backgroundColor: '#f9f9f9',
          color: '#444',
          fontFamily: 'Segoe UI, sans-serif',
          borderLeft: '8px solid #ccc',
        };
    }
  };

  const styles = getRoleStyles(user?.role || 'guest');

  return (
    <div style={{ minHeight: '100vh', ...styles }}>
      <RoleBanner role={user?.role} />
      <RoleSwitcher/>
      {children}
    </div>
  );
}
