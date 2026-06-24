import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', fullName: '', ageSegment: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.ageSegment) { setError('Please select your age group.'); return; }
    setLoading(true);
    try {
      await signup(form.email, form.password, form.fullName, form.ageSegment);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Start Your Free Trial</h1>
          <p className="text-gray-600 mt-2">30 days free. Full access. Cancel anytime.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="At least 6 characters" required minLength={6} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Group *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'teens', label: '14–18' },
                { value: 'young-adults', label: '19–36' },
                { value: 'adults', label: '37–65+' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, ageSegment: opt.value })}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    form.ageSegment === opt.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Start Free Trial'}
          </button>

          <p className="text-xs text-gray-400 text-center">By signing up, you agree to our Terms of Service and Privacy Policy.</p>

          <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}