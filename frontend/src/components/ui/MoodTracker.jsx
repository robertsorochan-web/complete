import React, { useState, useEffect } from 'react';
import { Heart, Zap, TrendingUp, Clock, Check, X, Tag, Send, BarChart2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];
const energyEmojis = ['😴', '🥱', '😌', '💪', '⚡'];

const commonTags = ['Work', 'Exercise', 'Social', 'Rest', 'Stress', 'Food', 'Sleep', 'Weather', 'Family'];

export default function MoodTracker({ compact = false, onMoodLogged }) {
  const [moodScore, setMoodScore] = useState(3);
  const [energyScore, setEnergyScore] = useState(3);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchTodayLogs();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchTodayLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mood/today`, { headers: getAuthHeaders() });
      const data = await res.json();
      setTodayLogs(data.logs || []);
    } catch (err) {
      console.error('Failed to fetch mood logs:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mood/analytics?days=30`, { headers: getAuthHeaders() });
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const handleLogMood = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/mood`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          moodScore,
          energyScore,
          notes: notes || null,
          tags: selectedTags
        })
      });

      if (res.ok) {
        fetchTodayLogs();
        setShowForm(false);
        setNotes('');
        setSelectedTags([]);
        if (onMoodLogged) onMoodLogged();
      }
    } catch (err) {
      console.error('Failed to log mood:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleShowAnalytics = () => {
    if (!analytics) fetchAnalytics();
    setShowAnalytics(true);
  };

  if (compact) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="font-medium text-white">Quick Mood Log</span>
          </div>
          <span className="text-xs text-gray-400">{todayLogs.length} logs today</span>
        </div>
        
        <div className="flex gap-2">
          {moodEmojis.map((emoji, i) => (
            <button
              key={i}
              onClick={() => {
                setMoodScore(i + 1);
                setShowForm(true);
              }}
              className={`flex-1 py-2 text-2xl rounded-lg transition-all ${
                moodScore === i + 1 
                  ? 'bg-pink-500/30 scale-110' 
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm text-gray-400 mb-2">Energy Level</p>
              <div className="flex gap-2">
                {energyEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setEnergyScore(i + 1)}
                    className={`flex-1 py-2 text-xl rounded-lg transition-all ${
                      energyScore === i + 1 
                        ? 'bg-yellow-500/30 scale-110' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 bg-slate-700 text-gray-400 rounded-lg hover:bg-slate-600 transition flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleLogMood}
                disabled={loading}
                className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition flex items-center justify-center gap-1"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Log
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-white">Mood & Energy Tracker</h3>
          </div>
          <button
            onClick={handleShowAnalytics}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
          >
            <BarChart2 className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      <div className="p-6">
        {showAnalytics && analytics ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowAnalytics(false)}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Back to logging
            </button>

            <div className="grid grid-cols-2 gap-4">
              {analytics.byTimeOfDay?.map(time => (
                <div key={time.time_of_day} className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400 capitalize">{time.time_of_day}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{moodEmojis[Math.round(time.avg_mood) - 1]}</span>
                    <span className="text-white font-bold">{time.avg_mood}/5</span>
                  </div>
                </div>
              ))}
            </div>

            {analytics.insights?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Insights</p>
                {analytics.insights.map((insight, i) => (
                  <div 
                    key={i}
                    className={`p-3 rounded-lg text-sm ${
                      insight.type === 'positive' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {insight.message}
                  </div>
                ))}
              </div>
            )}

            {analytics.moodEnergyCorrelation && (
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Mood-Energy Correlation</p>
                <p className="text-white font-bold">
                  {analytics.moodEnergyCorrelation > 0.5 
                    ? 'Strong positive correlation' 
                    : analytics.moodEnergyCorrelation > 0 
                      ? 'Moderate positive correlation'
                      : 'Low correlation'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">How are you feeling?</p>
              <div className="flex gap-3 justify-center">
                {moodEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setMoodScore(i + 1)}
                    className={`w-12 h-12 text-2xl rounded-xl transition-all ${
                      moodScore === i + 1 
                        ? 'bg-pink-500/30 scale-110 ring-2 ring-pink-500' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Energy level</p>
              <div className="flex gap-3 justify-center">
                {energyEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setEnergyScore(i + 1)}
                    className={`w-12 h-12 text-2xl rounded-xl transition-all ${
                      energyScore === i + 1 
                        ? 'bg-yellow-500/30 scale-110 ring-2 ring-yellow-500' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Tags (optional)</p>
              <div className="flex flex-wrap gap-2">
                {commonTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note (optional)..."
                className="w-full p-3 bg-slate-700 rounded-lg text-white placeholder-gray-500 border border-slate-600 focus:border-purple-500 focus:outline-none"
                rows={2}
              />
            </div>

            <button
              onClick={handleLogMood}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Log Mood
                </>
              )}
            </button>

            {todayLogs.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-3">Today's logs ({todayLogs.length})</p>
                <div className="space-y-2">
                  {todayLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-xl">{moodEmojis[log.moodScore - 1]}</span>
                      <span className="text-xl">{energyEmojis[(log.energyScore || 3) - 1]}</span>
                      <span className="text-xs text-gray-500 capitalize">{log.timeOfDay}</span>
                      {log.tags?.length > 0 && (
                        <div className="flex gap-1">
                          {log.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
