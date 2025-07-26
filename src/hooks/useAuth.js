import { useEffect, useState } from 'react';

export function useAuth() {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3000/api/protected/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setIsValid(res.ok);
      })
      .catch(() => setIsValid(false));
  }, []);

  return isValid;
}
