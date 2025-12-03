import React, { useState } from 'react';
import { signup } from '../../services/auth';
import { ChevronRight } from 'lucide-react';

const purposes = [
  { id: 'personal', label: '💡 Personal Development', desc: 'Improve my own life and well-being' },
  { id: 'team', label: '👥 Team Performance', desc: 'Understand and improve team dynamics' },
  { id: 'business', label: '🎯 Business Growth', desc: 'Optimize organizational performance' },
  { id: 'policy', label: '📊 Policy & Research', desc: 'Study systems and create solutions' },
];

const SignupForm = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', purpose: 'personal' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurposeSelect = (purposeId) => {
    setFormData({ ...formData, purpose: purposeId });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('All fields are required');
      }
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      const user = signup(formData.email, formData.password, formData.purpose, formData.name);
      onSignupSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Join Akorfa</h1>
        <p className="text-gray-400 text-center mb-8">Start fixing your life stack</p>

        {step === 1 ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-300 mb-4">What's your main purpose?</p>
            {purposes.map(p => (
              <button
                key={p.id}
                onClick={() => handlePurposeSelect(p.id)}
                className="w-full text-left p-4 rounded-lg bg-slate-700 hover:bg-slate-600 transition border border-slate-600 hover:border-purple-500"
              >
                <div className="font-semibold flex items-center justify-between">
                  {p.label}
                  <ChevronRight className="w-4 h-4" />
                </div>
                <div className="text-sm text-gray-400 mt-1">{p.desc}</div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none transition"
                placeholder="Min. 6 characters"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-400 hover:text-gray-200 transition"
            >
              ← Change Purpose
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-purple-400 hover:text-purple-300 font-semibold transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
