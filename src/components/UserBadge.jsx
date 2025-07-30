import React, { useEffect, useState } from 'react';

function UserBadge() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/protected/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.email) {
          setUser(data);
        } else {
          setError(data.message || 'Failed to fetch user info');
        }
      })
      .catch(() => setError('Server error'));
  }, []);

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded text-sm flex items-center justify-between">
      {user ? (
        <div>
          <strong>{user.email}</strong> 
          <span className="ml-2 text-gray-500">
            Access Level: <span className="font-semibold">{user.role}</span>
            </span>
        </div>
      ) : (
        <span className="text-red-600">{error}</span>
      )}
    </div>
  );
}

export default UserBadge;
