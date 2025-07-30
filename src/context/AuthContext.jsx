import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokenExp, setTokenExp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email, role: decoded.role });
        setTokenExp(decoded.exp);
      } catch (err) {
        console.error('Token decode failed', err);
        localStorage.removeItem('token');
        toast.error('Session error: Please login again');
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
      setUser({ email: decoded.email, role: decoded.role });
      setTokenExp(decoded.exp);
      localStorage.setItem('token', token);
      toast.success(`Welcome ${decoded.email}`);
    } catch (err) {
      toast.error('Login failed');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setTokenExp(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    toast.info('Session expired — you’ve been logged out');
    navigate('/login');
  };

  const logout = () => {
    handleLogout();
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
