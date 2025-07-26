import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decode = jwtDecode(token);
    const now = Date.now() / 1000;
    if (decode.exp < now) {

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
}
