import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Signup() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role: "user" })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Signup successful');
      } else if (res.status === 409) {
        setMessage('Email already exists - try logging in');
      } else {
        (data.message || 'Signup failed')
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage('Server error occurred');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form id="signupForm" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <div>{message}</div>
    </div>
  );
}
