import React, { useState, useEffect } from 'react';
import { CheckCircle, Flame, Calendar, TrendingUp, Brain, Users, Code, Heart, Eye, MessageSquare, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const layerConfig = {
  bioHardware: { label: 'Bio Hardware', icon: Heart, color: 'from-red-500 to-pink-500', description: 'Physical health & energy' },
  internalOS: { label: 'Internal OS', icon: Brain, color: 'from-blue-500 to-cyan-500', description: 'Beliefs & mental models' },
  culturalSoftware: { label: 'Cultural Software', icon: Code, color: 'from-purple-500 to-violet-500', description: 'Cultural influences' },
  socialInstance: { label: 'Social Instance', icon: Users, color: 'from-green-500 to-emerald-500', description: 'Relationships & connections' },
  consciousUser: { label: 'Conscious User', icon: Eye, color: 'from-yellow-500 to-orange-500', description: 'Awareness & presence' }
};

export default function DailyCheckin({ onComplete }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, totalCheckins: 0, checkinDates: [] });
  const [reflectionPrompt, setReflectionPrompt] = useState('');
  
  const [formData, setFormData] = useState({
    bioHardware: 5,
    internalOS: 5,
    culturalSoftware: 5,
    socialInstance: 5,
    consciousUser: 5,
    mood: 5,
    energyLevel: 5,
    culturalBug: '',
    dailyWin: '',
    symptomLog: '',
    reflectionResponse: ''
  });

  useEffect(() => {
    fetchTodayCheckin();
    fetchStreak();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchTodayCheckin = async () => {
    try {
      const response = await fetch(`${API_URL}/api/checkins/today`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.hasCheckedIn) {
        setHasCheckedIn(true);
        setFormData(prev => ({ ...prev, ...data.checkin }));
      } else {
        setReflectionPrompt(data.prompt);
      }
    } catch (err) {
      console.error('Failed to fetch today checkin:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStreak = async () => {
    try {
      const response = await fetch(`${API_URL}/api/checkins/streak`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setStreak(data);
    } catch (err) {
      console.error('Failed to fetch streak:', err);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/checkins`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          reflectionPrompt
        })
      });

      if (response.ok) {
        setHasCheckedIn(true);
        fetchStreak();
        if (onComplete) onComplete();
      }
    } catch (err) {
      console.error('Failed to submit checkin:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderSlider = (key, value) => {
    const config = layerConfig[key];
    if (!config) return null;
    const Icon = config.icon;

    return (
      <div key={key} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">{config.label}</p>
            <p className="text-xs text-gray-400">{config.description}</p>
          </div>
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => setFormData(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Struggling</span>
          <span>Thriving</span>
        </div>
      </div>
    );
  };

  const renderStreakCalendar = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasCheckin = streak.checkinDates?.some(d => 
        new Date(d).toISOString().split('T')[0] === dateStr
      );
      
      days.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-sm ${
            hasCheckin ? 'bg-purple-500' : 'bg-slate-700'
          }`}
          title={dateStr}
        />
      );
    }

    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {days}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const steps = [
    { title: 'Layer Check', subtitle: 'Rate your 5 layers' },
    { title: 'Mood & Energy', subtitle: 'Track how you feel' },
    { title: 'Reflection', subtitle: 'Daily insights' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Streak Header */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 mb-6 border border-orange-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-2xl font-bold text-white">{streak.currentStreak} Day Streak</h3>
              <p className="text-gray-400 text-sm">Longest: {streak.longestStreak} days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-orange-400">{streak.totalCheckins}</p>
            <p className="text-xs text-gray-400">Total Check-ins</p>
          </div>
        </div>
        {renderStreakCalendar()}
      </div>

      {hasCheckedIn ? (
        <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-green-500/30">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Today's Check-in Complete!</h2>
          <p className="text-gray-400 mb-6">Come back tomorrow to keep your streak going</p>
          
          <div className="grid grid-cols-5 gap-2 mb-6">
            {Object.entries(layerConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="text-center">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${config.color} mx-auto w-fit mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg font-bold text-white">{formData[key]}</p>
                  <p className="text-xs text-gray-400">{config.label.split(' ')[0]}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex flex-col items-center ${i <= step ? 'text-purple-400' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    i < step ? 'bg-purple-500 text-white' : 
                    i === step ? 'bg-purple-500/30 border-2 border-purple-500 text-purple-400' : 
                    'bg-slate-700 text-gray-500'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <p className="text-xs mt-1 hidden sm:block">{s.title}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 ${i < step ? 'bg-purple-500' : 'bg-slate-700'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Rate Your 5 Layers Today
              </h2>
              {Object.keys(layerConfig).map(key => renderSlider(key, formData[key]))}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                How Are You Feeling?
              </h2>
              
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Overall Mood</label>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">😔</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.mood}
                    onChange={(e) => setFormData(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <span className="text-2xl">😊</span>
                  <span className="text-xl font-bold text-white w-8">{formData.mood}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Energy Level</label>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🔋</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energyLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <span className="text-2xl">⚡</span>
                  <span className="text-xl font-bold text-white w-8">{formData.energyLevel}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    Today's Win (what went well?)
                  </span>
                </label>
                <textarea
                  value={formData.dailyWin}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyWin: e.target.value }))}
                  placeholder="Share something positive from today..."
                  className="w-full p-3 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    Any symptoms or challenges?
                  </span>
                </label>
                <textarea
                  value={formData.symptomLog}
                  onChange={(e) => setFormData(prev => ({ ...prev, symptomLog: e.target.value }))}
                  placeholder="Note any physical or mental symptoms..."
                  className="w-full p-3 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none"
                  rows={2}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Brain className="w-6 h-6 text-cyan-400" />
                Daily Reflection
              </h2>

              <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl p-4 mb-6 border border-purple-500/30">
                <p className="text-gray-300 text-sm mb-2">Today's Prompt:</p>
                <p className="text-white font-medium">{reflectionPrompt}</p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Your Response</label>
                <textarea
                  value={formData.reflectionResponse}
                  onChange={(e) => setFormData(prev => ({ ...prev, reflectionResponse: e.target.value }))}
                  placeholder="Take a moment to reflect..."
                  className="w-full p-3 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-400" />
                    Cultural Software Bug Noticed Today
                  </span>
                </label>
                <textarea
                  value={formData.culturalBug}
                  onChange={(e) => setFormData(prev => ({ ...prev, culturalBug: e.target.value }))}
                  placeholder="What cultural influence affected your thinking or behavior?"
                  className="w-full p-3 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Check-in
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
