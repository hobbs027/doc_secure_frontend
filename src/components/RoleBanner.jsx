import React from 'react';

export default function RoleBanner({ role }) {
  const banners = {
    admin: { label: '🔴 Admin Dashboard', color: '#8b0000' },
    reviewer: { label: '🔵 Reviewer Workspace', color: '#004d80' },
    uploader: { label: '🟢 Uploader Center', color: '#2e6b00' },
    guest: { label: '👤 Guest Access', color: '#444' },
  };

  const current = banners[role] || banners.guest;

  return (
    <div
      style={{
        padding: '1rem 1.5rem',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        color: current.color,
        backgroundColor: '#fefefe',
        borderBottom: `2px solid ${current.color}`,
      }}
    >
      {current.label}
    </div>
  );
}
