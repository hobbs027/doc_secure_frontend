// /context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [tokenExp, setTokenExp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuth({ username: decoded.username, email: decoded.email, role: decoded.role, token });
        setTokenExp(decoded.exp);
      } catch (err) {
        console.error('Token decode failed', err);
        localStorage.removeItem('token');
        toast.error('Session error — please login again');
      }
    }
  }, []);

  useEffect(() => {
    if (!tokenExp) return;

    const now = Math.floor(Date.now() / 1000);
    const timeUntilLogout = tokenExp - now;

    if (timeUntilLogout <= 0) {
      handleLogout();
    } else {
      const timer = setTimeout(handleLogout, timeUntilLogout * 1000);
      return () => clearTimeout(timer);
    }
  }, [tokenExp]);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      setAuth({ username: decoded.username, email: decoded.email, role: decoded.role, token });
      setTokenExp(decoded.exp);
      localStorage.setItem('token', token);
      toast.success(`Welcome ${decoded.username || decoded.email}`);
    } catch (err) {
      toast.error('Login failed');
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setTokenExp(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const logout = () => {
    handleLogout();
  };

  const updateAuth = (newAuth) => {
    setAuth(prev => ({ ...prev, ...newAuth }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
