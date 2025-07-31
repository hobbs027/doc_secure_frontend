import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const useSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const signup = async ({ username, email, password, role }) => {
    try {
      const res = await fetch("https://backend-secure-app.onrender.com/api/user/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
        credentials: 'include', // for cookies/session auth
      });

      const data = await res.json();

      if (res.ok && data.token) {
        login(data.token);
        toast.success(data.message || 'Signup successful!');
        navigate('/dashboard'); // optional: redirect after signup
        return { success: true };
      }

      toast.error(data.message || 'Signup failed');
      return { success: false, message: data.message };
    } catch (err) {
      console.error('❌ Signup error:', err);
      toast.error('Network error or server unreachable');
      return { success: false, message: 'Network error' };
    }
  };

  return { signup };
};

export default useSignup;

