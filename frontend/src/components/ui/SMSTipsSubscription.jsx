import React, { useState } from 'react';
import { Phone, MessageSquare, Check, AlertCircle, Send } from 'lucide-react';

const SMSTipsSubscription = ({ purpose = 'personal' }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [frequency, setFrequency] = useState('weekly');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.match(/^(\+233|0)[0-9]{9}$/)) {
      setError('Please enter a valid Ghana phone number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('akofa_sms_subscription', JSON.stringify({
        phone: phoneNumber,
        frequency,
        purpose,
        subscribedAt: new Date().toISOString()
      }));
      
      setSubscribed(true);
    } catch (err) {
      setError('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-green-900/20 rounded-xl p-6 border border-green-500/30 text-center">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-green-400" />
        </div>
        <h3 className="font-bold text-white text-lg mb-2">You Don Subscribe!</h3>
        <p className="text-gray-300 text-sm mb-4">
          We go send you {frequency} tips to <span className="text-green-400">{phoneNumber}</span>
        </p>
        <button
          onClick={() => setSubscribed(false)}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Change settings
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">SMS Tips (No Internet Needed)</h3>
            <p className="text-sm text-gray-400">Get weekly tips on your phone</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubscribe} className="p-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Your Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0XX XXX XXXX or +233 XX XXX XXXX"
              className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:border-purple-500 outline-none text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">How often?</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'daily', label: 'Daily' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFrequency(opt.id)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition ${
                  frequency === opt.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-gray-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !phoneNumber}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 rounded-xl font-semibold transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              Subscribe for Free
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Standard SMS rates apply. Text STOP to unsubscribe anytime.
        </p>
      </form>
    </div>
  );
};

export default SMSTipsSubscription;
