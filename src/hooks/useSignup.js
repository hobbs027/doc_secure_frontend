import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 

const useSignup = () => {
  const Navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const signup = async ({ username, email, password, role }) => {
    try {
      const res = await fetch(`http://localhost/3001/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const decoded = jwtDecode(data.token);

        // Expiry check
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          toast.error('Session expired — please try signing up again');
          return { success: false, message: 'Session expired' };
        }

        // Save to localStorage (or secure cookie if preferred)
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', decoded.username);
        localStorage.setItem('role', decoded.role);

        // Optional: store in context for global access
        setAuth({ token: data.token, role: decoded.role, username: decoded.username });

        toast.success(data.message || 'Signup successful!');
        return { success: true };
      }

      // Backend error like duplicate email
      toast.error(data.message || 'Signup failed');
      return { success: false, message: data.message };
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('Network error or server offline');
      return { success: false, message: 'Network error' };
    }
  };

  return { signup };
};

export default useSignup;
