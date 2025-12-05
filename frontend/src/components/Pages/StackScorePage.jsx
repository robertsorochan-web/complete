import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Trophy, Target, ChevronUp, Users, Star, Zap, Share2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import StackShareCard from '../ui/StackShareCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const tierColors = {
  'Novice': '#808080',
  'Practitioner': '#4A90A4',
  'Adept': '#CD7F32',
  'Master': '#C0C0C0',
  'Guru': '#FFD700'
};

export default function StackScorePage() {
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState(null);
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [activeTab, setActiveTab] = useState('score');
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('akofa_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchAllData = async () => {
    try {
      const [scoreRes, historyRes, leaderboardRes] = await Promise.all([
        fetch(`${API_URL}/api/stackscore`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/stackscore/history`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/stackscore/leaderboard`, { headers: getAuthHeaders() })
      ]);

      const score = await scoreRes.json();
      const historyData = await historyRes.json();
      const leaderboardData = await leaderboardRes.json();

      setScoreData(score);
      setHistory(historyData.history || []);
      setLeaderboard(leaderboardData.leaderboard || []);
      setUserRank(leaderboardData.userRank);
    } catch (err) {
      console.error('Failed to fetch stack score data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreGradient = (score) => {
    if (score >= 750) return 'from-yellow-400 to-yellow-600';
    if (score >= 650) return 'from-gray-300 to-gray-500';
    if (score >= 550) return 'from-orange-400 to-orange-600';
    if (score >= 450) return 'from-blue-400 to-blue-600';
    return 'from-gray-400 to-gray-600';
  };

  const chartData = {
    labels: history.slice().reverse().map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'StackScore',
        data: history.slice().reverse().map(h => h.score),
        fill: true,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#8b5cf6'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#8b5cf6',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        min: 300,
        max: 850,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#9ca3af' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Score Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-purple-400" />
              Your StackScore
            </h2>
            <div className="flex items-center gap-2">
              {userRank && (
                <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-white font-medium">Rank #{userRank}</span>
                </div>
              )}
              <button
                onClick={() => setShowShareCard(true)}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-full text-white font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="relative">
              <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${getScoreGradient(scoreData?.score || 300)} p-1`}>
                <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">{scoreData?.score || 300}</span>
                  <span className="text-gray-400 text-sm">/ 850</span>
                </div>
              </div>
              <div 
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold"
                style={{ backgroundColor: tierColors[scoreData?.tier] || '#808080', color: scoreData?.tier === 'Guru' ? '#000' : '#fff' }}
              >
                {scoreData?.tier || 'Novice'}
              </div>
            </div>

            {/* Breakdown */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Consistency</span>
                  <span className="text-white font-medium">{scoreData?.breakdown?.consistency || 0}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${scoreData?.breakdown?.consistency || 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{scoreData?.breakdown?.progress || 0}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${scoreData?.breakdown?.progress || 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Balance</span>
                  <span className="text-white font-medium">{scoreData?.breakdown?.balance || 0}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${scoreData?.breakdown?.balance || 0}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <Zap className="w-4 h-4" />
                <span>AI Bonus: +{scoreData?.breakdown?.aiBonus || 0} points</span>
              </div>
            </div>
          </div>

          {/* Next Tier Progress */}
          {scoreData?.nextTier && scoreData.nextTier.nextTier !== 'Max Tier' && (
            <div className="mt-6 bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Next Tier: {scoreData.nextTier.nextTier}</span>
                <span className="text-purple-400 text-sm font-medium">{scoreData.nextTier.pointsNeeded} points needed</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${scoreData.nextTier.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['score', 'leaderboard'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            {tab === 'score' ? 'History' : 'Leaderboard'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'score' && (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Score History</h3>
          <div className="h-64">
            {history.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Complete daily check-ins to see your score history
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Anonymous Leaderboard
          </h3>
          <div className="space-y-2">
            {leaderboard.map((user, i) => (
              <div 
                key={i}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  user.isCurrentUser ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-slate-700/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  i === 0 ? 'bg-yellow-500 text-black' :
                  i === 1 ? 'bg-gray-400 text-black' :
                  i === 2 ? 'bg-orange-600 text-white' :
                  'bg-slate-600 text-white'
                }`}>
                  {user.rank}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {user.displayName} {user.isCurrentUser && '(You)'}
                  </p>
                  <p className="text-gray-400 text-sm">{user.streak} day streak</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{user.score}</p>
                  <p className="text-xs text-gray-400">StackScore</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier Guide */}
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Tier Guide
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { name: 'Novice', min: 300, max: 449 },
            { name: 'Practitioner', min: 450, max: 549 },
            { name: 'Adept', min: 550, max: 649 },
            { name: 'Master', min: 650, max: 749 },
            { name: 'Guru', min: 750, max: 850 }
          ].map(tier => (
            <div 
              key={tier.name}
              className={`p-3 rounded-lg text-center ${
                scoreData?.tier === tier.name ? 'ring-2 ring-purple-500' : ''
              }`}
              style={{ backgroundColor: `${tierColors[tier.name]}20` }}
            >
              <Star className="w-5 h-5 mx-auto mb-1" style={{ color: tierColors[tier.name] }} />
              <p className="font-medium text-white text-sm">{tier.name}</p>
              <p className="text-xs text-gray-400">{tier.min}-{tier.max}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Share Card Modal */}
      <StackShareCard isOpen={showShareCard} onClose={() => setShowShareCard(false)} />
    </div>
  );
}
