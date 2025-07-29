// hooks/useAutoLogout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';

export default function useAutoLogout(token, logoutHandler) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const expiry = decoded.exp;

    const checkExpiry = () => {
      const now = Math.floor(Date.now() / 1000);
      if (expiry <= now) {
        toast.info('🔐 Session expired. You’ve been logged out.');
        logoutHandler(); // clear auth state
        navigate('/login');
      }
    };

    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [token, logoutHandler, navigate]);
}
