import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Flame, Calendar, TrendingUp, Brain, Users, Code, Heart, Eye, MessageSquare, Sparkles, Share2, Download, Trophy, Star, ChevronLeft, ChevronRight, Award, Target, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import html2canvas from 'html2canvas';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const layerBaseConfig = {
  bioHardware: { icon: Heart, color: 'from-red-500 to-pink-500' },
  internalOS: { icon: Brain, color: 'from-blue-500 to-cyan-500' },
  culturalSoftware: { icon: Code, color: 'from-purple-500 to-violet-500' },
  socialInstance: { icon: Users, color: 'from-green-500 to-emerald-500' },
  consciousUser: { icon: Eye, color: 'from-yellow-500 to-orange-500' }
};

const getMilestones = (streakText) => [
  { days: 7, emoji: '🔥', titleKey: 'milestoneWeekWarrior', messageKey: 'milestoneWeekMessage', title: streakText.milestoneWeekWarrior || 'Week Warrior', message: streakText.milestoneWeekMessage || 'You made it 7 days! Building strong habits.' },
  { days: 14, emoji: '⚡', titleKey: 'milestoneTwoWeek', messageKey: 'milestoneTwoWeekMessage', title: streakText.milestoneTwoWeek || 'Two Week Champion', message: streakText.milestoneTwoWeekMessage || '14 days strong! Keep the momentum.' },
  { days: 30, emoji: '🏆', titleKey: 'milestoneMonthMaster', messageKey: 'milestoneMonthMessage', title: streakText.milestoneMonthMaster || 'Month Master', message: streakText.milestoneMonthMessage || '30 days! You are unstoppable.' },
  { days: 60, emoji: '💎', titleKey: 'milestoneDiamond', messageKey: 'milestoneDiamondMessage', title: streakText.milestoneDiamond || 'Diamond Dedication', message: streakText.milestoneDiamondMessage || '60 days of consistent growth!' },
  { days: 100, emoji: '👑', titleKey: 'milestoneCentury', messageKey: 'milestoneCenturyMessage', title: streakText.milestoneCentury || 'Century Legend', message: streakText.milestoneCenturyMessage || '100 days! You are legendary.' },
  { days: 365, emoji: '🌟', titleKey: 'milestoneYear', messageKey: 'milestoneYearMessage', title: streakText.milestoneYear || 'Year Hero', message: streakText.milestoneYearMessage || 'A full year of transformation!' }
];

export default function DailyCheckin({ onComplete }) {
  const { t, getSection } = useLanguage();
  const streakText = getSection('streak');
  const commonText = getSection('common');
  const layersText = getSection('layers');
  const shareCardRef = useRef(null);
  
  const layerConfig = {
    bioHardware: { ...layerBaseConfig.bioHardware, label: layersText.bioHardware || 'Health & Energy', description: streakText.layerBioDesc || 'Physical health & energy' },
    internalOS: { ...layerBaseConfig.internalOS, label: layersText.internalOS || 'Mindset & Beliefs', description: streakText.layerOSDesc || 'Beliefs & mental models' },
    culturalSoftware: { ...layerBaseConfig.culturalSoftware, label: layersText.culturalSoftware || 'Cultural Influences', description: streakText.layerCultureDesc || 'Cultural influences' },
    socialInstance: { ...layerBaseConfig.socialInstance, label: layersText.socialInstance || 'Relationships', description: streakText.layerSocialDesc || 'Relationships & connections' },
    consciousUser: { ...layerBaseConfig.consciousUser, label: layersText.consciousUser || 'Awareness & Focus', description: streakText.layerAwareDesc || 'Awareness & presence' }
  };
  
  const milestones = getMilestones(streakText);
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, totalCheckins: 0, checkinDates: [] });
  const [reflectionPrompt, setReflectionPrompt] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [showMilestone, setShowMilestone] = useState(null);
  const [showShareCard, setShowShareCard] = useState(false);
  
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

  useEffect(() => {
    if (streak.currentStreak > 0) {
      const milestone = milestones.find(m => m.days === streak.currentStreak);
      if (milestone) {
        setShowMilestone(milestone);
      }
    }
  }, [streak.currentStreak]);

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

  const getStreakMessage = () => {
    if (streak.currentStreak >= 100) return streakText.unstoppable || 'Unstoppable!';
    if (streak.currentStreak >= 30) return streakText.onFire || 'On Fire!';
    if (streak.currentStreak >= 7) return streakText.amazing || 'Amazing!';
    if (streak.currentStreak >= 3) return streakText.keepGoing || 'Keep Going!';
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  const getNextMilestone = () => {
    const next = milestones.find(m => m.days > streak.currentStreak);
    return next ? { ...next, daysLeft: next.days - streak.currentStreak } : null;
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
          <span>{streakText.struggling || 'Struggling'}</span>
          <span>{streakText.thriving || 'Thriving'}</span>
        </div>
      </div>
    );
  };

  const renderMonthCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    const weekDays = streakText.weekDays ? streakText.weekDays.split(',') : 
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < startPad; i++) {
      days.push(<div key={`pad-${i}`} className="h-8" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const hasCheckin = streak.checkinDates?.some(d => 
        new Date(d).toISOString().split('T')[0] === dateStr
      );
      const isToday = new Date().toDateString() === date.toDateString();
      
      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
            hasCheckin 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : isToday 
                ? 'border-2 border-purple-500 text-purple-400'
                : 'text-gray-400 hover:bg-slate-700'
          }`}
        >
          {day}
        </div>
      );
    }

    const monthNames = streakText.months ? streakText.months.split(',') : 
      ['January', 'February', 'March', 'April', 'May', 'June', 
       'July', 'August', 'September', 'October', 'November', 'December'];

    return (
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCalendarMonth(new Date(year, month - 1))}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h4 className="font-semibold">{monthNames[month]} {year}</h4>
          <button
            onClick={() => setCalendarMonth(new Date(year, month + 1))}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(d => (
            <div key={d} className="h-8 flex items-center justify-center text-xs text-gray-500">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
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
          className={`w-3 h-3 rounded-sm transition-all ${
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

  const generateShareCard = () => {
    setShowShareCard(true);
  };

  const shareStreak = async (platform) => {
    const text = `I'm on a ${streak.currentStreak} day streak with Akofa Fixit! ${streak.currentStreak >= 7 ? '🔥' : '✨'} Building better habits every day. #AkofaFixit #DailyStreak`;
    
    if (platform === 'download') {
      if (shareCardRef.current) {
        try {
          const canvas = await html2canvas(shareCardRef.current, {
            backgroundColor: null,
            scale: 2
          });
          const link = document.createElement('a');
          link.download = `akofa-streak-${streak.currentStreak}-days.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        } catch (err) {
          console.error('Failed to generate image:', err);
          alert('Could not generate image. Try copying the text instead.');
        }
      }
    } else if (platform === 'copy') {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
    setShowShareCard(false);
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

  const nextMilestone = getNextMilestone();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Milestone Celebration Modal */}
      {showMilestone && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl p-8 max-w-md w-full text-center border border-purple-500/50 animate-pulse-slow">
            <div className="text-6xl mb-4">{showMilestone.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-2">{showMilestone.title}</h2>
            <p className="text-gray-300 mb-4">{showMilestone.message}</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-xl font-bold text-yellow-400">{showMilestone.days} Day Milestone!</span>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setShowMilestone(null);
                  generateShareCard();
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                onClick={() => setShowMilestone(null)}
                className="px-6 py-2 bg-slate-700 rounded-lg font-semibold"
              >
                {commonText.close || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Card Modal */}
      {showShareCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <div 
              ref={shareCardRef}
              className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-xl p-6 mb-4"
            >
              <div className="text-center text-white">
                <Flame className="w-12 h-12 mx-auto mb-2" />
                <h3 className="text-3xl font-bold mb-1">{streak.currentStreak} Day Streak</h3>
                <p className="text-white/80 mb-4">Building better habits with Akofa</p>
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
                  <div className="flex justify-around">
                    <div>
                      <p className="text-2xl font-bold">{streak.totalCheckins}</p>
                      <p className="text-xs">Total Check-ins</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{streak.longestStreak}</p>
                      <p className="text-xs">Best Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => shareStreak('download')}
                className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex flex-col items-center gap-1 transition"
              >
                <Download className="w-5 h-5" />
                <span className="text-xs">{streakText.downloadImage || 'Download'}</span>
              </button>
              <button
                onClick={() => shareStreak('whatsapp')}
                className="p-3 bg-green-600 hover:bg-green-700 rounded-lg flex flex-col items-center gap-1 transition"
              >
                <span className="text-xl">💬</span>
                <span className="text-xs">{streakText.shareToWhatsApp || 'WhatsApp'}</span>
              </button>
              <button
                onClick={() => shareStreak('twitter')}
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-lg flex flex-col items-center gap-1 transition"
              >
                <span className="text-xl">𝕏</span>
                <span className="text-xs">{streakText.shareToTwitter || 'Twitter'}</span>
              </button>
              <button
                onClick={() => shareStreak('copy')}
                className="p-3 bg-slate-600 hover:bg-slate-500 rounded-lg flex flex-col items-center gap-1 transition"
              >
                <span className="text-xl">📋</span>
                <span className="text-xs">{streakText.copyText || 'Copy'}</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowShareCard(false)}
              className="w-full py-2 bg-slate-700 rounded-lg"
            >
              {commonText.close || 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Streak Header */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 mb-6 border border-orange-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Flame className="w-10 h-10 text-orange-500" />
              {streak.currentStreak >= 7 && (
                <Star className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                {streak.currentStreak} {streakText.day || 'Day'} {streakText.currentStreak?.split(' ')[0] || 'Streak'}
                {streak.currentStreak >= 30 && <span className="text-lg">🔥</span>}
                {streak.currentStreak >= 100 && <span className="text-lg">👑</span>}
              </h3>
              <p className="text-gray-400 text-sm">{getStreakMessage()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              title="View Calendar"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button 
              onClick={generateShareCard}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              title="Share Streak"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center bg-slate-800/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-orange-400">{streak.totalCheckins}</p>
            <p className="text-xs text-gray-400">{streakText.totalCheckins || 'Total Check-ins'}</p>
          </div>
          <div className="text-center bg-slate-800/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-purple-400">{streak.longestStreak}</p>
            <p className="text-xs text-gray-400">{streakText.longestStreak || 'Best Streak'}</p>
          </div>
          <div className="text-center bg-slate-800/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-400">
              {nextMilestone ? nextMilestone.daysLeft : '✓'}
            </p>
            <p className="text-xs text-gray-400">
              {nextMilestone ? `Days to ${nextMilestone.emoji}` : 'Max Level'}
            </p>
          </div>
        </div>

        {/* Next Milestone Progress */}
        {nextMilestone && (
          <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Next: {nextMilestone.title}</span>
              <span className="text-sm text-purple-400">{nextMilestone.emoji}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${(streak.currentStreak / nextMilestone.days) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {streak.currentStreak}/{nextMilestone.days} days ({Math.round((streak.currentStreak / nextMilestone.days) * 100)}%)
            </p>
          </div>
        )}

        {showCalendar ? renderMonthCalendar() : renderStreakCalendar()}
      </div>

      {hasCheckedIn ? (
        <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-green-500/30">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {streakText.alreadyCheckedIn || "Today's Check-in Complete!"}
          </h2>
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

          <button
            onClick={generateShareCard}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:opacity-90 transition"
          >
            <Share2 className="w-5 h-5" /> Share Your Progress
          </button>
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
              {commonText.back || 'Back'}
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                {commonText.continue || 'Continue'}
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
                    {commonText.loading || 'Saving...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {streakText.checkInToday || 'Complete Check-in'}
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
