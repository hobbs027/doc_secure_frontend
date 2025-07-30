import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const useSignup = () => {
  const Navigate = useNavigate();
  const { login } = useAuthContext();

  const signup = async ({ username, email, password, role }) => {
    try {
      const res = await fetch("https://localhost:3001/api/user/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.token) {
        login(data.token); 
        toast.success(data.message || 'Signup successful!');
        return { success: true };
      }

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
