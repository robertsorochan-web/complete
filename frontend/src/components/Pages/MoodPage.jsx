import React, { useState, useEffect } from 'react';
import { Heart, Zap, TrendingUp, BarChart2, Calendar, Clock, Tag } from 'lucide-react';
import MoodTracker from '../ui/MoodTracker';
import LevelDisplay from '../ui/LevelDisplay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function MoodPage() {
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    fetchAnalytics();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mood/history?days=30`, { headers: getAuthHeaders() });
      const data = await res.json();
      setHistory(data.logs || []);
    } catch (err) {
      console.error('Failed to fetch mood history:', err);
    } finally {
      setLoading(false);
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

  const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];
  const energyEmojis = ['😴', '🥱', '😌', '💪', '⚡'];

  const groupByDate = (logs) => {
    const grouped = {};
    logs.forEach(log => {
      const date = new Date(log.loggedAt).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(log);
    });
    return grouped;
  };

  const handleMoodLogged = () => {
    fetchHistory();
    fetchAnalytics();
  };

  const groupedHistory = groupByDate(history);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Heart className="w-8 h-8 text-pink-500" />
          Mood & Energy Tracker
        </h1>
        <p className="text-gray-400">Track your emotional wellbeing and energy levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <MoodTracker onMoodLogged={handleMoodLogged} />
        </div>

        <div className="space-y-4">
          <LevelDisplay />

          {analytics && analytics.byTimeOfDay && analytics.byTimeOfDay.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Best Times</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {analytics.byTimeOfDay.map(time => (
                  <div key={time.time_of_day} className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 capitalize mb-1">{time.time_of_day}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">{moodEmojis[Math.round(time.avg_mood) - 1]}</span>
                      <span className="text-white font-bold">{time.avg_mood}/5</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{time.count} logs</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analytics && analytics.insights && analytics.insights.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-white">Insights</h3>
              </div>
              <div className="space-y-2">
                {analytics.insights.map((insight, i) => (
                  <div 
                    key={i}
                    className={`p-3 rounded-lg text-sm ${
                      insight.type === 'positive' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}
                  >
                    {insight.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {Object.keys(groupedHistory).length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-400" />
              <h3 className="font-bold text-white">Mood History (Last 30 Days)</h3>
            </div>
          </div>
          
          <div className="p-4 max-h-96 overflow-y-auto space-y-4">
            {Object.entries(groupedHistory).map(([date, logs]) => (
              <div key={date}>
                <p className="text-sm text-gray-400 mb-2">{date}</p>
                <div className="space-y-2">
                  {logs.map(log => (
                    <div 
                      key={log.id} 
                      className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{moodEmojis[log.moodScore - 1]}</span>
                        <span className="text-2xl">{energyEmojis[(log.energyScore || 3) - 1]}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 capitalize">
                            {log.timeOfDay}
                          </span>
                          <span className="text-xs text-gray-600">
                            {new Date(log.loggedAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-sm text-gray-300 mt-1">{log.notes}</p>
                        )}
                      </div>
                      
                      {log.tags && log.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {log.tags.map((tag, i) => (
                            <span 
                              key={i}
                              className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && !loading && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-500 mb-2">No mood logs yet</p>
          <p className="text-sm text-gray-600">Start tracking your mood using the form above!</p>
        </div>
      )}
    </div>
  );
}
