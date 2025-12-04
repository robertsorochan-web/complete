import React, { useState } from 'react';
import { login } from '../../services/auth';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.includes('.');
};

const LoginForm = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: '' });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    if (field === 'email' && formData.email && !validateEmail(formData.email)) {
      setFieldErrors({ ...fieldErrors, email: 'Please enter a valid email' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!formData.email || !formData.password) {
      if (!formData.email) setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
      if (!formData.password) setFieldErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    if (!validateEmail(formData.email)) {
      setFieldErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);

    try {
      const user = await login(formData.email.toLowerCase().trim(), formData.password);
      onLoginSuccess(user);
    } catch (err) {
      if (err.message.includes('Invalid credentials') || err.message.includes('not found')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">👋</div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">Continue improving your stack</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full pl-10 pr-4 py-3 bg-slate-700 rounded-lg border ${
                  fieldErrors.email ? 'border-red-500' : 'border-slate-600'
                } focus:border-purple-500 outline-none transition`}
                placeholder="your@email.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-slate-700 rounded-lg border ${
                  fieldErrors.password ? 'border-red-500' : 'border-slate-600'
                } focus:border-purple-500 outline-none transition`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg text-red-200 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-purple-400 hover:text-purple-300 font-semibold transition"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
