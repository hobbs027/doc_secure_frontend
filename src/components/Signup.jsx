import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useSignup from '../hooks/useSignup';

export default function Signup() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const responseMessage = await signup({ username, email, password, role: 'user' });
    if (responseMessage.success) {
      setMessage('Signup successful — logging you in...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setMessage(responseMessage.message || 'Signup failed');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      {message && <p className="mb-2 text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Signing you up...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-green-600 underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
