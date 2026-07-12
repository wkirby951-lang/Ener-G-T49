import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Check your email for a reset link.');
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-gray-900">🧘 Ener-G-T-49</Link>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {message ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">📧</div>
              <p className="text-gray-700 mb-2">{message}</p>
              <p className="text-sm text-gray-500">Check your inbox and follow the link to reset your password.</p>
              <Link to="/login" className="inline-block mt-4 text-blue-600 hover:underline">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Remember your password? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}