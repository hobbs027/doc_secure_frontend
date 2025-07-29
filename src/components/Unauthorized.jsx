import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>🚫 Access Denied</h1>
      <p>
        {user?.role
          ? `The role '${user.role}' does not have access to this page.`
          : 'You need to be logged in to view this page.'}
      </p>
      <button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
        🔙 Go Home
      </button>
    </div>
  );
};

export default Unauthorized;
