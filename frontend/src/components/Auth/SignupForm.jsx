import React, { useState } from 'react';
import { signup } from '../../services/auth';
import { ChevronRight, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';

const purposes = [
  { 
    id: 'personal', 
    label: 'My Life', 
    icon: '🌟', 
    desc: 'I wan make my life better', 
    color: 'from-purple-500 to-pink-500',
    examples: ['Sleep wahala', 'Work stress', 'Relationship problems', 'Money worries']
  },
  { 
    id: 'team', 
    label: 'My Team', 
    icon: '👥', 
    desc: 'I wan help my team work better', 
    color: 'from-blue-500 to-cyan-500',
    examples: ['Office wahala', 'People dey leave', 'Low morale', 'Communication problems']
  },
  { 
    id: 'business', 
    label: 'My Business', 
    icon: '📈', 
    desc: 'I wan grow my business', 
    color: 'from-orange-500 to-yellow-500',
    examples: ['Chop bar/shop', 'Market stall', 'Online business', 'Any hustle']
  },
  { 
    id: 'policy', 
    label: 'Community', 
    icon: '🏛️', 
    desc: 'I wan help my community', 
    color: 'from-green-500 to-emerald-500',
    examples: ['Church/mosque group', 'Village project', 'Youth group', 'School program']
  },
];

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!email) return { valid: false, message: '' };
  if (!emailRegex.test(email)) return { valid: false, message: 'Enter correct email address' };
  if (!email.includes('.') || email.endsWith('.')) return { valid: false, message: 'Email must get proper ending' };
  return { valid: true, message: '' };
};

const SignupForm = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', purpose: 'personal' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handlePurposeSelect = (purposeId) => {
    setFormData({ ...formData, purpose: purposeId });
    setStep(2);
  };

  const validateField = (field, value) => {
    const errors = { ...fieldErrors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Put your name';
        } else if (value.trim().length < 2) {
          errors.name = 'Name too short';
        } else {
          delete errors.name;
        }
        break;
      case 'email':
        const emailCheck = validateEmail(value);
        if (!emailCheck.valid && value) {
          errors.email = emailCheck.message;
        } else if (!value) {
          errors.email = 'Put your email';
        } else {
          delete errors.email;
        }
        break;
      case 'password':
        if (!value) {
          errors.password = 'Create password';
        } else if (value.length < 6) {
          errors.password = 'Password too short (6+ letters)';
        } else if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
          errors.password = 'Add letters and numbers';
        } else {
          delete errors.password;
        }
        break;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field]);
  };

  const isFormValid = () => {
    return formData.name.trim().length >= 2 && 
           validateEmail(formData.email).valid && 
           formData.password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    setTouched({ name: true, email: true, password: true });
    
    const nameValid = validateField('name', formData.name);
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    
    if (!nameValid || !emailValid || !passwordValid) {
      return;
    }

    setLoading(true);

    try {
      const user = await signup(formData.email.toLowerCase().trim(), formData.password, formData.purpose, formData.name.trim());
      onSignupSuccess(user);
    } catch (err) {
      if (err.message.includes('already registered') || err.message.includes('already exists')) {
        setFieldErrors({ ...fieldErrors, email: 'This email don register before. Try login.' });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedPurpose = purposes.find(p => p.id === formData.purpose);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <div className="bg-slate-800 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">✨</div>
              <h1 className="text-3xl font-bold mb-2">Welcome to Akↄfa</h1>
              <p className="text-gray-400">Wetin you wan improve?</p>
            </div>

            <div className="space-y-3">
              {purposes.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePurposeSelect(p.id)}
                  className="w-full text-left p-4 rounded-xl bg-slate-700 hover:bg-slate-600 transition-all border-2 border-slate-600 hover:border-purple-500 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl`}>
                      {p.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white group-hover:text-purple-300 transition">
                        {p.label}
                      </div>
                      <div className="text-sm text-gray-400">{p.desc}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.examples.slice(0, 3).map((ex, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-slate-600 rounded-full text-gray-300">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition" />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center text-sm text-gray-400">
              You get account already?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-400 hover:text-purple-300 font-semibold transition"
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl p-8">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span className="text-sm">Change choice</span>
            </button>

            <div className="flex items-center gap-3 mb-6 p-3 bg-slate-700 rounded-xl">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedPurpose.color} flex items-center justify-center text-xl`}>
                {selectedPurpose.icon}
              </div>
              <div>
                <div className="text-sm text-gray-400">Your focus</div>
                <div className="font-semibold">{selectedPurpose.label}</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Create Your Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-700 rounded-lg border ${
                      fieldErrors.name && touched.name ? 'border-red-500' : 
                      touched.name && !fieldErrors.name && formData.name ? 'border-green-500' : 'border-slate-600'
                    } focus:border-purple-500 outline-none transition`}
                    placeholder="Wetin dem dey call you?"
                  />
                  {touched.name && !fieldErrors.name && formData.name && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {fieldErrors.name && touched.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-700 rounded-lg border ${
                      fieldErrors.email && touched.email ? 'border-red-500' : 
                      touched.email && !fieldErrors.email && formData.email ? 'border-green-500' : 'border-slate-600'
                    } focus:border-purple-500 outline-none transition`}
                    placeholder="your@email.com"
                  />
                  {touched.email && !fieldErrors.email && formData.email && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {fieldErrors.email && touched.email && (
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
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-700 rounded-lg border ${
                      fieldErrors.password && touched.password ? 'border-red-500' : 
                      touched.password && !fieldErrors.password && formData.password ? 'border-green-500' : 'border-slate-600'
                    } focus:border-purple-500 outline-none transition`}
                    placeholder="6+ letters and numbers"
                  />
                  {touched.password && !fieldErrors.password && formData.password && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {fieldErrors.password && touched.password && (
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
                disabled={loading || !isFormValid()}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  'Start Now - Free'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              You get account already?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-400 hover:text-purple-300 font-semibold transition"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
