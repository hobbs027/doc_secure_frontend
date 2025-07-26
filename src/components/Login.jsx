import React, { useState } from 'react';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import {jwtDecode} from 'jwt-decode';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          setMessage('Session expired - please login again');
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', decoded.username);
        localStorage.setItem('role', decoded.role);
        setMessage('Login successful');
        onLogin && onLogin();
        navigate('/dashboard'); 
      } else {
        setMessage(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage('Server error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Secure Login</h2>
      {message && <p className="mb-2 text-red-600">{message}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
