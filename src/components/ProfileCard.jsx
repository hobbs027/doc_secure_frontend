import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import './ProfileCard.css';

function ProfileCard({ token }) {
  const [expiresIn, setExpiresIn] = useState('');
  const [decoded, setDecoded] = useState(null);

  useEffect(() => {
    if (!token) return;
    try {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }, [token]);

  useEffect(() => {
    if (!decoded?.exp) return;

    const updateTimer = () => {
      const secondsLeft = decoded.exp - Math.floor(Date.now() / 1000);
      if (secondsLeft <= 0) {
        setExpiresIn('Expired');
      } else if (secondsLeft < 60) {
        setExpiresIn(`${secondsLeft} sec`);
      } else {
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        setExpiresIn(`${mins}m ${secs}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [decoded]);

  if (!decoded) return null;

  const { username, role, email, exp } = decoded;
  const expiryDate = exp
    ? new Date(exp * 1000).toLocaleString()
    : 'Unknown';

  return (
    <div className={`profile-card ${role?.toLowerCase()}`} aria-label="Token details">
      <h3> Token Info</h3>
      <p><strong>Username:</strong> {username || 'N/A'}</p>
      <p><strong>Role:</strong> {role || 'N/A'}</p>
      <p><strong>Email:</strong> {email || 'N/A'}</p>
      <p><strong>Expires:</strong> {expiryDate}</p>
      <p>
        <strong>Time left:</strong>{' '}
        <span className={expiresIn === 'Expired' ? 'expired' : 'active'}>
          {expiresIn || 'Unknown'}
        </span>
      </p>
    </div>
  );
}

export default ProfileCard;
