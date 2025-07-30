import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// @ts-ignore
import { jwtDecode } from 'jwt-decode';

export default function Signup() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role: 'user' }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        const decoded = jwtDecode(data.token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          setMessage('Session expired - please try signing up again');
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', decoded.username);
        localStorage.setItem('role', decoded.role);
        setMessage('Signup successful — logging you in...');
        setTimeout(() => navigate('/dashboard'), 1500); // redirect after brief message
      } else if (res.status === 409) {
        setMessage('Email already exists — try logging in');
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setMessage('Server error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      {message && <p className="mb-2 text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" className="w-full border p-2 rounded" required />
        <input type="email" name="email" placeholder="Email" className="w-full border p-2 rounded" required />
        <input type="password" name="password" placeholder="Password" className="w-full border p-2 rounded" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-green-600 underline">Login here</Link>
      </p>
    </div>
  );
}
