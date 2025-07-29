// components/RoleSwitcher.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function RoleSwitcher() {
  const { user, updateUser } = useAuth(); // ensure you have a method to update user context

  const roles = ['admin', 'reviewer', 'uploader', 'guest'];

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
        Switch Role:
      </label>
      <select
        value={user?.role || 'guest'}
        onChange={(e) => updateUser({ ...user, role: e.target.value })}
        style={{
          padding: '0.5rem',
          borderRadius: '6px',
          fontWeight: 'bold',
        }}
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
