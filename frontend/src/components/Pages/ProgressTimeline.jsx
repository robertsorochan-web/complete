import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Award, Target, ChevronLeft, ChevronRight, Brain, Heart, Code, Users, Eye } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const layerConfig = {
  bioHardware: { label: 'Bio Hardware', color: '#ef4444', icon: Heart },
  internalOS: { label: 'Internal OS', color: '#3b82f6', icon: Brain },
  culturalSoftware: { label: 'Cultural Software', color: '#8b5cf6', icon: Code },
  socialInstance: { label: 'Social Instance', color: '#22c55e', icon: Users },
  consciousUser: { label: 'Conscious User', color: '#f59e0b', icon: Eye }
};

export default function ProgressTimeline() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [compareView, setCompareView] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/api/checkins/history?limit=${selectedPeriod}`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/profile`, { headers: getAuthHeaders() })
      ]);

      const historyData = await historyRes.json();
      const profileData = await profileRes.json();

      setHistory(historyData.checkins || []);
      setBadges(profileData.badges || []);
      setMilestones(profileData.recentMilestones || []);
    } catch (err) {
      console.error('Failed to fetch timeline data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverages = (data) => {
    if (data.length === 0) return null;
    const sum = data.reduce((acc, d) => ({
      bioHardware: acc.bioHardware + d.bioHardware,
      internalOS: acc.internalOS + d.internalOS,
      culturalSoftware: acc.culturalSoftware + d.culturalSoftware,
      socialInstance: acc.socialInstance + d.socialInstance,
      consciousUser: acc.consciousUser + d.consciousUser
    }), { bioHardware: 0, internalOS: 0, culturalSoftware: 0, socialInstance: 0, consciousUser: 0 });

    return {
      bioHardware: (sum.bioHardware / data.length).toFixed(1),
      internalOS: (sum.internalOS / data.length).toFixed(1),
      culturalSoftware: (sum.culturalSoftware / data.length).toFixed(1),
      socialInstance: (sum.socialInstance / data.length).toFixed(1),
      consciousUser: (sum.consciousUser / data.length).toFixed(1)
    };
  };

  const getComparisonData = () => {
    const halfLength = Math.floor(history.length / 2);
    const recentHalf = history.slice(0, halfLength);
    const olderHalf = history.slice(halfLength);

    return {
      recent: calculateAverages(recentHalf),
      older: calculateAverages(olderHalf)
    };
  };

  const chartData = {
    labels: history.slice().reverse().map(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: Object.entries(layerConfig).map(([key, config]) => ({
      label: config.label,
      data: history.slice().reverse().map(h => h[key]),
      borderColor: config.color,
      backgroundColor: `${config.color}20`,
      tension: 0.4,
      pointRadius: 3
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9ca3af', usePointStyle: true }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#9ca3af' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', maxRotation: 45 }
      }
    }
  };

  const comparison = compareView ? getComparisonData() : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-400" />
            Progress Timeline
          </h1>
          <p className="text-gray-400">Track your journey across all layers</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
            className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>

          <button
            onClick={() => setCompareView(!compareView)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              compareView ? 'bg-purple-500 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            Compare
          </button>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-lg font-bold text-white mb-4">Layer Performance Over Time</h2>
        <div className="h-80">
          {history.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Complete daily check-ins to see your progress timeline
            </div>
          )}
        </div>
      </div>

      {/* Comparison View */}
      {compareView && comparison?.recent && comparison?.older && (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Before vs After Comparison
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {Object.entries(layerConfig).map(([key, config]) => {
              const Icon = config.icon;
              const recent = parseFloat(comparison.recent[key]);
              const older = parseFloat(comparison.older[key]);
              const diff = recent - older;
              const isImproved = diff > 0;

              return (
                <div key={key} className="bg-slate-700/50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${config.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{config.label}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-500 text-sm">{older}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                    <span className="text-white font-bold">{recent}</span>
                  </div>
                  <p className={`text-sm mt-1 ${isImproved ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {isImproved ? '+' : ''}{diff.toFixed(1)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges & Milestones */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Badges */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Earned Badges
          </h2>
          {badges.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {badges.slice(0, 9).map((badge, i) => (
                <div key={i} className="bg-slate-700/50 rounded-xl p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white text-sm font-medium truncate">{badge.badge_name}</p>
                  <p className="text-gray-400 text-xs truncate">{badge.badge_description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Keep going to earn badges!</p>
            </div>
          )}
        </div>

        {/* Recent Milestones */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Recent Milestones
          </h2>
          {milestones.length > 0 ? (
            <div className="space-y-3">
              {milestones.slice(0, 5).map((milestone, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{milestone.milestone_type.replace(/_/g, ' ')}</p>
                    <p className="text-gray-400 text-xs">{new Date(milestone.achieved_at).toLocaleDateString()}</p>
                  </div>
                  {milestone.milestone_value && (
                    <span className="text-purple-400 font-bold">+{milestone.milestone_value}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Complete challenges to unlock milestones!</p>
            </div>
          )}
        </div>
      </div>

      {/* Layer Averages */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-lg font-bold text-white mb-4">Period Averages</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(layerConfig).map(([key, config]) => {
            const Icon = config.icon;
            const avg = history.length > 0 
              ? (history.reduce((sum, h) => sum + h[key], 0) / history.length).toFixed(1)
              : '-';

            return (
              <div key={key} className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <span className="text-2xl font-bold" style={{ color: config.color }}>{avg}</span>
                </div>
                <p className="text-sm text-gray-400">{config.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
